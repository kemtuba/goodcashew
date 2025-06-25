'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// No need for Supabase client on this page anymore
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// This is the complete, final component for your login page.
export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref for the verifier to avoid re-rendering and global window object issues.
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const router = useRouter();

  // EXPLANATION: All logic related to `useSearchParams` and `role` has been removed.
  // The client no longer needs to know the user's role before logging in.

  // This useEffect initializes the invisible reCAPTCHA verifier once.
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      // The 'recaptcha-container' div must be present in the JSX.
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // This callback is fired when the reCAPTCHA is solved.
          // You could trigger the phone submit here automatically if desired.
        }
      });
    }
  }, []);

  // Handles sending the phone number to Firebase to get an OTP.
  const handlePhoneSubmit = async () => {
    setLoading(true);
    setError(null);
    
    if (!recaptchaVerifierRef.current) {
      setError("reCAPTCHA verifier not initialized.");
      setLoading(false);
      return;
    }

    try {
      const appVerifier = recaptchaVerifierRef.current;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('verify-otp');
    } catch (err) {
      console.error("Phone number submission error:", err);
      setError('Failed to send OTP. Please check your phone number and try again.');
    }

    setLoading(false);
  };

  // Handles submitting the OTP to confirm the user's identity.
  const handleOtpSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!confirmationResult) {
      setError("No confirmation result available. Please try sending the OTP again.");
      setLoading(false);
      return;
    }

    try {
      // 1. Confirm the OTP with Firebase.
      const result = await confirmationResult.confirm(otp);
      // 2. Get the secure ID token for the authenticated user.
      const idToken = await result.user.getIdToken();

      // 3. Send ONLY the idToken to our secure backend API.
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      // 4. Get the response from the API.
      const userProfile = await response.json();

      if (!response.ok) {
        // If the API returned an error, display it to the user.
        throw new Error(userProfile.error || 'Authentication failed. Please try again.');
      }

      // 5. If successful, the API returns the user's profile, including their role.
      // We use this role for the redirect.
      if (userProfile.role) {
        router.push(`/dashboard/${userProfile.role}`);
      } else {
        // This case should not happen if the API is working correctly.
        throw new Error('Could not determine user role after login.');
      }

    } catch (err: any) {
      console.error("OTP submission error:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center mb-6">
            {/* You can add your GoodCashew SVG logo here */}
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500">
              {step === 'enter-phone' 
                ? 'Enter your phone number to continue' 
                : 'A code was sent to your phone'}
            </p>
        </div>


        {error && <p className="mb-4 text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>}

        {step === 'enter-phone' && (
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="+233 24 000 0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 text-lg"
            />
            <Button
              onClick={handlePhoneSubmit}
              className="w-full p-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {step === 'verify-otp' && (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 text-lg tracking-widest text-center"
            />
            <Button
              onClick={handleOtpSubmit}
              className="w-full p-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </div>
        )}

        {/* This div is required by Firebase for the invisible reCAPTCHA widget. */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

