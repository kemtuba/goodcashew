import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminAppCheck } from '@/lib/firebase-admin';

// Defines the valid user roles that can be assigned during this flow
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- App Check Verification Block ---
  const appCheckToken = req.headers['x-firebase-appcheck'] as string | undefined;

  if (!appCheckToken) {
    return res.status(401).json({ error: 'App Check token is missing.' });
  }

  try {
    // CORRECTED: The official method name is 'verifyToken'
    await adminAppCheck.verifyToken(appCheckToken);
  } catch (err) {
    console.error("App Check verification failed:", err);
    return res.status(401).json({ error: 'App Check token is invalid.' });
  }
  
  // --- If App Check passes, proceed with the rest of the logic ---
  try {
    const { firebase_token, role } = req.body as { firebase_token: string; role: UserRole };

    // Validate that both token and role are present
    if (!firebase_token || !role) {
      return res.status(400).json({ error: 'Missing firebase_token or role in request body.' });
    }
    
    // RESTORED: Use the VALID_ROLES array to validate the incoming role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'An invalid role was provided.' });
    }

    // Verify the user's Firebase Auth ID token
    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // TODO: Your database logic to find or create a user in Supabase
    // const userProfile = await findOrCreateUserInDb(uid, phone_number, role);
    
    // For now, we return a mock profile for demonstration
    const userProfile = {
        firebaseUID: uid,
        phoneNumber: phone_number,
        role: role, 
    };

    return res.status(200).json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("Firebase auth API error:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
