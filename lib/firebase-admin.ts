// lib/firebase-admin.ts

import admin from 'firebase-admin';

// This prevents us from initializing the app multiple times in development
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // This line correctly formats the private key from the environment variable
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Export the initialized admin auth service for use in your API routes
const adminAuth = admin.auth();

export { adminAuth };