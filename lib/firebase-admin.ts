import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This "singleton" pattern prevents re-initializing the app on every server call.
if (!admin.apps.length) {
  // Get the entire service account JSON from our single environment variable.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error("The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
  }

  try {
    // Parse the JSON string into an object that the Admin SDK can use.
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully from single variable.");
  } catch (error) {
    console.error("Error parsing Firebase service account JSON or initializing app:", error);
    // Throw an error to prevent the app from running with a bad configuration.
    throw new Error("Could not initialize Firebase Admin SDK.");
  }
}

// Export the initialized services for use in your API routes.
const adminAuth = admin.auth();
const adminAppCheck = admin.appCheck();

export { adminAuth, adminAppCheck };