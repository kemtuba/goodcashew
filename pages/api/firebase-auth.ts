import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'farmer' | 'coop-leader' | 'extension-worker';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // App Check Verification
  const appCheckToken = req.headers['x-firebase-appcheck'] as string | undefined;
  if (!appCheckToken) {
    return res.status(401).json({ error: 'App Check token is missing.' });
  }
  try {
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    return res.status(401).json({ error: 'App Check token is invalid.' });
  }
  
  // Main Logic
  try {
    const { firebase_token, role } = req.body as { firebase_token: string; role: UserRole };

    if (!firebase_token || !role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Missing or invalid parameters.' });
    }

    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // --- UPDATED SUPABASE LOGIC ---
    const { data: userProfile, error: upsertError } = await supabaseAdmin
      .from('users') // UPDATED: to match your table name
      .upsert(
        {
          id: uid,              // UPDATED: to match your column name for the Firebase UID
          phone_number: phone_number,
          role: role,
        },
        {
          onConflict: 'id', // UPDATED: telling Supabase the unique column is 'id'
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      throw upsertError;
    }
    
    return res.status(200).json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
