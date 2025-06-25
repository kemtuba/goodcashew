// /lib/firebase.ts

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// --- THIS IS THE FIX, PART 1 ---
// We import the `getToken` function directly from the `firebase/app-check` package
// so we can use and export it.
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck, getToken } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let appCheck: AppCheck | undefined;
// Initialize App Check only in the browser
if (typeof window !== 'undefined') {
  // Use a global flag to ensure this only runs once per page load
  if (!(window as any).FIREBASE_APPCHECK_INITIALIZED) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true,
    });
    (window as any).FIREBASE_APPCHECK_INITIALIZED = true;
    console.log('✅ Firebase App Check initialized with v3 provider.');
  }
}

// --- THIS IS THE FIX, PART 2 ---
// We now explicitly export `getToken` alongside `auth` and `appCheck`.
// This makes it available for import in your LoginPage component.
export { auth, appCheck, getToken };
