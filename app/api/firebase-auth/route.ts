// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Defines the valid user roles for signup
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

export async function POST(request: NextRequest) {
  
  // App Check Verification - We know this works.
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

    // --- UPDATED AND SIMPLIFIED SUPABASE LOGIC ---
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users') // Assumes your table is named 'users'
      .upsert(
        {
          id: uid,              // The user's Firebase ID
          phone_number: phone_number,
          role: requestedRole,  // The role from the frontend
        },
        {
          onConflict: 'id', // Match users based on their Firebase ID
        }
      )
      // This now selects all columns directly from the 'users' table
      .select('*') 
      .single();

    if (upsertError) {
      // If there's a database error, throw it
      console.error("Supabase upsert error:", upsertError);
      throw upsertError;
    }
    
    // Return the real user profile from the database
    return NextResponse.json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
