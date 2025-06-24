// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

export async function POST(request: NextRequest) {
  
  const appCheckToken = request.headers.get('X-Firebase-AppCheck');
  if (!appCheckToken) {
    return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
  }
  try {
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
  }
  
  try {
    const { firebase_token, role } = await request.json();
    if (!firebase_token || !role) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({ id: uid, phone_number: phone_number, role: role })
      .select('id, role')
      .single();

    if (upsertError) throw upsertError;
    
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
