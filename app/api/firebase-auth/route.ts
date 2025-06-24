// /app/api/firebase-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  // ... (App Check verification block is the same)
  
  try {
    const { firebase_token, role: requestedRole } = await request.json();
    if (!firebase_token || !requestedRole) {
      return NextResponse.json({ error: 'Missing token or role.' }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // First, try to find an existing user
    let { data: userProfile } = await supabaseAdmin
      .from('users')
      .select(`*, roles: user_roles (role)`)
      .eq('id', uid)
      .single();

    // If no user is found, create one
    if (!userProfile) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({ id: uid, phone_number: phone_number, role: requestedRole })
        .select(`*, roles: user_roles (role)`)
        .single();
      
      if (createError) throw createError;
      userProfile = newUser;
    }
    
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

