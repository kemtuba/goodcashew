// supabase/functions/firebase-auth/index.ts
// This is the final, corrected version.

import { initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

// This "singleton" pattern ensures Firebase is initialized only once,
// which is more efficient in a serverless environment.
let firebaseApp: App;
function initializeFirebase() {
  if (firebaseApp) {
    return;
  }

  // Check for required environment variables
  const firebaseProjectId = Deno.env.get('FIREBASE_PROJECT_ID');
  const firebasePrivateKey = Deno.env.get('FIREBASE_PRIVATE_KEY');
  const firebaseClientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL');

  if (!firebaseProjectId || !firebasePrivateKey || !firebaseClientEmail) {
    throw new Error('Missing required Firebase environment variables.');
  }

  const firebaseServiceAccount = {
    projectId: firebaseProjectId,
    privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    clientEmail: firebaseClientEmail,
  };

  firebaseApp = initializeApp({
    credential: cert(firebaseServiceAccount),
  });
  console.log("Firebase Admin SDK initialized.");
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ensure Firebase is initialized before proceeding
    initializeFirebase();

    // Get the ID token sent from the user's browser
    const { firebase_token } = await req.json();
    if (!firebase_token) throw new Error('Firebase token not provided.');

    // Verify the token is valid and get the user's details
    const decodedToken = await getAuth().verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    if (!uid) throw new Error('Firebase UID not found in token.');

    // Create the Supabase admin client to perform privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // "Upsert" the user profile. This is the core logic.
    // It will CREATE the user if their ID doesn't exist,
    // or UPDATE their last_login_at time if they do.
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: uid, // The Primary Key linking to Firebase Auth
        phone_number: phone_number,
        last_login_at: new Date().toISOString(),
        // Note: We don't set the role here, allowing it to keep its existing value
        // or use the table's default ('farmer') on first creation.
      })
      .select('id, full_name, role, is_active') // Return the data we need on the frontend
      .single();

    if (upsertError) throw upsertError;

    // Return the clean, simple user profile object
    return new Response(JSON.stringify({ userProfile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in firebase-auth function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});