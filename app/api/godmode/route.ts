// app/api/godmode/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// This API route is the secure backend for the "God Mode" login.
// It must run on the server and use the Firebase Admin SDK.

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// Initialize the Firebase Admin App on the server if it hasn't been already.
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { secret, impersonateUserId } = await request.json();

    // 1. SECURITY CHECK: Verify the secret key.
    if (secret !== process.env.ADMIN_LOGIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized. Invalid secret.' }, { status: 401 });
    }

    // --- TEMPORARY MODIFICATION FOR FIRST-TIME ADMIN SETUP ---
    // Instead of reading from `process.env.ADMIN_USER_ID` (which isn't set yet),
    // we are hardcoding a unique string. When `createCustomToken` is called with a
    // UID that doesn't exist, Firebase reserves it. When the frontend page signs in
    // with this token, Firebase Auth will create a new user with this UID.
    const uidToSign = impersonateUserId || "goodcashew-admin-initial";

    if (!uidToSign) {
        // This check remains as a safeguard.
        return NextResponse.json({ error: 'Target user ID is missing.' }, { status: 500 });
    }

    // 3. Create the Custom Login Token for the new user ID.
    const customToken = await getAuth().createCustomToken(uidToSign);

    // 4. Send the secure token back to the frontend.
    return NextResponse.json({ token: customToken });

  } catch (error) {
    console.error('Godmode API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
