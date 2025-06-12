import admin from 'firebase-admin';

// This prevents us from initializing the app multiple times
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key needs to be properly formatted by replacing the literal `\n` with actual newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    // Optionally add your databaseURL if you use Realtime Database
    // databaseURL: `https://<YOUR-PROJECT-ID>.firebaseio.com` 
  });
}

// Export the initialized admin auth service
const adminAuth = admin.auth();

export { adminAuth };