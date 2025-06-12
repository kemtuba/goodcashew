// pages/api/firebase-auth.ts (AFTER)

import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebase-admin'; // Assuming you have an admin setup

// It's good practice to define the type on the backend as well
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';
const VALID_ROLES: UserRole[] = ['farmer', 'coop-leader', 'extension-worker']; // Only these roles can be assigned on signup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // UPDATED: Destructure both firebase_token and role from the request body
    const { firebase_token, role } = req.body as { firebase_token: string; role: UserRole };

    // NEW: Add validation to ensure both token and a valid role are present
    if (!firebase_token || !role) {
      return res.status(400).json({ error: 'Missing firebase_token or role in request body.' });
    }
    
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided.' });
    }

    // 1. Verify the Firebase ID token using the Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(firebase_token);
    const { uid, phone_number } = decodedToken;

    // 2. Find or create the user in your own database (e.g., PostgreSQL, MongoDB)
    //    You would replace this with your actual database logic.
    //
    //    IMPORTANT: The `role` is now passed when creating a new user.
    //    Your database logic should be designed to only set the role on the *first* login.
    
    // Example database interaction (replace with your own db client like Prisma, etc.)
    // let userProfile = await db.user.findUnique({ where: { firebaseUID: uid } });
    // if (!userProfile) {
    //   userProfile = await db.user.create({
    //     data: {
    //       firebaseUID: uid,
    //       phoneNumber: phone_number,
    //       role: role, // <-- Using the role from the request!
    //       // ... other default fields
    //     }
    //   });
    // }
    
    // For now, we'll return a mock user profile for demonstration
    const userProfile = {
        firebaseUID: uid,
        phoneNumber: phone_number,
        role: role, 
    };

    // 3. Return the user profile to the client
    return res.status(200).json({ message: "Authentication successful", userProfile });

  } catch (error: any) {
    console.error("Firebase auth API error:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}