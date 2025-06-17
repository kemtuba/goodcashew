import admin from 'firebase-admin';

// This prevents us from initializing the app multiple times in development
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Get the authentication service
const adminAuth = admin.auth();

// NEW: Get the App Check service
const adminAppCheck = admin.appCheck();

// UPDATED: Export both services
export { adminAuth, adminAppCheck };
