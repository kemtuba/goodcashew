// app/api/firebase-auth/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'farmer' | 'coop-leader' | 'extension-worker';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker'];

// In the App Router, we export functions named after HTTP methods
export async function POST(request: NextRequest) {
  
  // --- App Check Verification ---
  // The header name is automatically converted to lowercase by Next.js
  const appCheckToken = request.headers.get('x-firebase-appcheck');
  if (!appCheckToken) {
    return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
  }
  try {
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
  }
  
  // --- Main Logic ---
  try {
    // Get the body using the new request.json() method
    const { firebase_token, role } = await request.json();

    if (!firebase_token || !role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // Supabase logic remains the same
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({ id: uid, phone_number: phone_number, role: role })
      .select('id, full_name, role, is_active')
      .single();

    if (upsertError) throw upsertError;

    // Return a response using the new NextResponse.json() method
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

