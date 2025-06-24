// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Define the valid user roles for signup
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker'];

export async function POST(request: NextRequest) {
  
  // --- App Check Verification ---
  // CORRECTED: A more robust way to get the header that works on Vercel
  const appCheckToken = request.headers.get('X-Firebase-AppCheck');

  if (!appCheckToken) {
    return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
  }

  try {
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    console.error("App Check verification failed:", err);
    return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
  }
  
  // --- Main Logic ---
  try {
    const body = await request.json();
    const { firebase_token, role } = body as { firebase_token: string; role: UserRole };

    // Validate request body
    if (!firebase_token || !role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    // Verify the user's Firebase Auth ID token
    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // Find or create the user in your Supabase database
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: uid,
          phone_number: phone_number,
          role: role,
        },
        {
          onConflict: 'id',
        }
      )
      .select('id, full_name, role, is_active')
      .single();

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw upsertError;
    }
    
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("API Error:", error);
    // Be careful not to leak internal error details to the client in production
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
