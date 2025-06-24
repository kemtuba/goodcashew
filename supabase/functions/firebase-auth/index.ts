// /supabase/functions/firebase-auth/index.ts

/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

// Define the valid user roles for security
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker', 'admin', 'retailer'];


// This "singleton" pattern ensures Firebase is initialized only once
let firebaseApp: App;
function initializeFirebase() {
  if (firebaseApp) {
    return;
  }
  const firebaseServiceAccount = {
    projectId: Deno.env.get('FIREBASE_PROJECT_ID')!,
    privateKey: Deno.env.get('FIREBASE_PRIVATE_KEY')!.replace(/\\n/g, '\n'),
    clientEmail: Deno.env.get('FIREBASE_CLIENT_EMAIL')!,
  };
  firebaseApp = initializeApp({
    credential: cert(firebaseServiceAccount),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    initializeFirebase();

    // Get both the token AND the role from the request
    const { firebase_token, role } = await req.json();

    // Validate the input
    if (!firebase_token || !role || !VALID_ROLES.includes(role)) {
      throw new Error('Missing or invalid firebase_token or role.');
    }

    const decodedToken = await getAuth().verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;
    if (!uid) throw new Error('Firebase UID not found in token.');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // UPDATED: The upsert logic now includes the 'role'
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: uid, // The Primary Key linking to Firebase Auth
          phone_number: phone_number,
          role: role, // <-- The selected role is now saved to the database
          last_login_at: new Date().toISOString(),
        },
        {
          onConflict: 'id', // Match users based on their Firebase ID
        }
      )
      .select('id, full_name, role, is_active')
      .single();

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ userProfile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e: unknown) {
    const error = e as Error;
    console.error("Error in firebase-auth function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

