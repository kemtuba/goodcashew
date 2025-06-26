import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

if (!admin.apps.length) {
  // THIS IS THE CODE THAT IS RUNNING NOW
  // It uses the three separate, reliable variables.
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");

}

const adminAuth = admin.auth();
const adminAppCheck = admin.appCheck();

export { adminAuth, adminAppCheck };

