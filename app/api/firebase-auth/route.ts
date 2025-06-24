// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

export async function POST(request: NextRequest) {
  
  // App Check Verification
  const appCheckToken = request.headers.get('X-Firebase-AppCheck');
  if (!appCheckToken) {
    return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
  }
  try {
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
  }
  
  // Main Logic
  try {
    const { firebase_token, role: requestedRole } = await request.json();
    if (!firebase_token || !requestedRole) {
      return NextResponse.json({ error: 'Missing token or role.' }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // --- FINAL SUPABASE LOGIC ---
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          // We now use the new 'firebase_uid' column to store the link to Firebase
          firebase_uid: uid,
          phone_number: phone_number,
          role: requestedRole,
        },
        {
          // This tells Supabase that 'firebase_uid' should be unique
          onConflict: 'firebase_uid', 
        }
      )
      .select('*') // Select all data for the found or created user
      .single();

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw upsertError;
    }
    
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

