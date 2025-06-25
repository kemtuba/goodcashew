// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

export async function POST(request: NextRequest) {
  // Optional: allow App Check to be bypassed in local/dev environments
  if (process.env.APP_ENV !== 'dev') {
    const appCheckToken = request.headers.get('X-Firebase-AppCheck');
    if (!appCheckToken) {
      return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
    }
    try {
      await adminAppCheck.verifyToken(appCheckToken);
    } catch (err) {
      return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
    }
  }

  try {
    const { idToken, role: requestedRole } = await request.json();

    if (!idToken || !requestedRole) {
      return NextResponse.json({ error: 'Missing ID token or role.' }, { status: 400 });
    }

    const validRoles: UserRole[] = ['farmer', 'coop-leader', 'extension-worker', 'admin', 'retailer'];
    if (!validRoles.includes(requestedRole)) {
      return NextResponse.json({ error: 'Invalid role specified.' }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return NextResponse.json({ error: 'Phone number is required for user mapping.' }, { status: 400 });
    }

    // Upsert the user profile into Supabase
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          firebase_uid: uid,
          phone_number,
          role: requestedRole,
        },
        {
          onConflict: 'firebase_uid', // ensure only one record per Firebase user
        }
      )
      .select('*')
      .single();

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw upsertError;
    }

    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    console.error("Authentication failure:", errorMessage);
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
