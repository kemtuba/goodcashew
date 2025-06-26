// /app/api/firebase-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
// EXPLANATION: adminAuth is for verifying the user's identity token.
// adminAppCheck is for verifying that the request comes from your genuine app.
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

// EXPLANATION: Keeping this type definition is good practice for type safety,
// even though the role is now determined by the database.
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

export async function POST(request: NextRequest) {
  // --- PRESERVED: App Check Verification ---
  // EXPLANATION: This entire block is preserved exactly as you wrote it.
  // It's a robust security measure that ensures requests can only come from
  // your genuine application, and the `APP_ENV !== 'dev'` check is a smart
  // way to allow for easier local testing.
  if (process.env.APP_ENV !== 'dev') {
    const appCheckToken = request.headers.get('X-Firebase-AppCheck');
    if (!appCheckToken) {
      return NextResponse.json({ error: 'App Check token not found.' }, { status: 401 });
    }
    try {
      // This verifies the token using the Firebase Admin SDK.
      await adminAppCheck.verifyToken(appCheckToken);
    } catch (err) {
      return NextResponse.json({ error: 'App Check token is invalid.' }, { status: 401 });
    }
  }

  try {
    // --- CHANGED: Simplified Request Body ---
    // EXPLANATION: We now only expect the `idToken` from the client. The `role`
    // is no longer needed because the backend is the single source of truth for a
    // user's role, which is already stored in your pre-populated `users` table.
    // This is more secure as it prevents a user from trying to assign themselves a role.
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token.' }, { status: 400 });
    }

    // --- REMOVED: Client-Side Role Validation ---
    // EXPLANATION: The section that checked `requestedRole` against a `validRoles`
    // array has been removed. As explained above, this check is now redundant and
    // the responsibility has correctly moved to the backend.

    // --- PRESERVED: Firebase ID Token Verification ---
    // EXPLANATION: This is the core of the authentication. It securely verifies that
    // the token is valid and was issued by Firebase, and it decodes the token to
    // give us the user's permanent, unique Firebase UID and their phone number.
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return NextResponse.json({ error: 'Phone number is required for user mapping.' }, { status: 400 });
    }

    // --- REPLACED: Core Database Logic (The "Activation" Step) ---
    // EXPLANATION: This is the most significant change. Instead of `upsert`, we now
    // perform an `update`. We find the pre-existing user in your `users` table by
    // their `phone_number`. If found, we "activate" their account by setting their
    // Firebase `uid` in the `id` column. This happens only once, on their first login.
    const { data: userProfile, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ id: uid }) // Set the Firebase UID in the 'id' column.
      .eq('phone_number', phone_number) // Find the user by their phone number.
      .select('id, full_name, role, phone_number') // Return the complete, activated profile.
      .single(); // We expect to update exactly one user.

    // --- NEW: Robust Error Handling for the Update ---
    // EXPLANATION: If `updateError` exists, it almost certainly means the user's
    // phone number was not found in the `users` table. This is our security check.
    // It means the user is not part of the pilot, so we deny them access.
    if (updateError || !userProfile) {
      console.error(`Login failed. User not found or update failed for phone: ${phone_number}`, updateError);
      return NextResponse.json({ error: 'This phone number is not registered for the pilot program.' }, { status: 403 });
    }

    // --- CHANGED: Simplified Success Response ---
    // EXPLANATION: We now return the `userProfile` object directly. This is a cleaner
    // pattern that makes the response easier to handle on the frontend, which can
    // immediately use the user's name, role, etc.
    return NextResponse.json(userProfile);

  } catch (error: any) {
    // --- PRESERVED: Global Error Handling ---
    // EXPLANATION: This block is preserved. It's a crucial safety net that catches
    // any unexpected errors (e.g., Firebase is down, database connection fails),
    // logs them for your review, and sends a generic, non-revealing error to the client.
    const errorMessage = error instanceof Error ? error.message : 'An internal error occurred.';
    console.error("Authentication failure:", errorMessage);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
