// app/godmode/[secret]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Your client-side auth instance from lib/firebase.js

/**
 * This page acts as the entry point for the "God Mode" administrative login.
 * It is currently configured to solve the "first-time admin" problem by
 * creating the user and displaying their UID.
 */
export default function GodModeLoginPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('Initiating secure login...');
  const [error, setError] = useState('');
  const [adminUID, setAdminUID] = useState(''); // State to hold the final UID

  useEffect(() => {
    // This function runs automatically when the page loads
    const getAdminId = async () => {
      const secret = params.secret as string;
      const impersonateUserId = searchParams.get('impersonate');

      if (!secret) {
        setError('Secret key is missing from the URL.');
        setStatus('Failed.');
        return;
      }
      
      try {
        setStatus('Verifying secret with API...');
        
        // 1. Call your secure backend API route
        const response = await fetch('/api/godmode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, impersonateUserId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'API request failed.');
        }

        setStatus('Secret verified. Signing in to create user...');
        
        // 2. Use the custom token from the API to sign in.
        // This action will create the user in the Firebase emulator if they don't exist.
        const userCredential = await signInWithCustomToken(auth, data.token);
        const user = userCredential.user;

        if (user) {
            setStatus('Admin user created successfully! Your Admin User ID is below.');
            // 3. Display the new User's UID on the screen
            setAdminUID(user.uid);
        } else {
            throw new Error("Could not retrieve user details after sign-in.");
        }

      } catch (err: any) {
        console.error("God Mode Error:", err);
        setStatus('Login process failed.');
        setError(err.message);
      }
    };

    getAdminId();
  }, [params.secret, router, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 max-w-lg">
        <h1 className="text-3xl font-bold">Admin User Setup</h1>
        <p className="mt-4 text-lg text-gray-400">{status}</p>
        
        {/* This block will appear with the UID once the login is successful */}
        {adminUID && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-sm font-medium">Copy this User UID and set it as your `ADMIN_USER_ID` environment variable:</p>
                <p className="mt-2 text-lg font-mono bg-black/50 p-2 rounded break-all">{adminUID}</p>
            </div>
        )}

        {error && <p className="mt-2 text-red-500 bg-red-100/10 p-2 rounded-md">Error: {error}</p>}
      </div>
    </div>
  );
}
