"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, Auth } from 'firebase/auth';
// UPDATED: Import both auth and appCheck from your central config file
import { auth, appCheck } from '@/lib/firebase'; 
import { getToken } from 'firebase/app-check'; // NEW: Import getToken for App Check
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// This interface is required for attaching Firebase objects to the window
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');

  useEffect(() => {
    if (!role) {
      setError('Missing role in URL. Please use ?role=farmer or ?role=admin, etc.');
    }
  }, [role]);

  useEffect(() => {
    // This check prevents the verifier from being created multiple times
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      // The reCAPTCHA is invisible and attaches to this div
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  }, []);

  const handlePhoneSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('verify-otp');
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
    }
    setLoading(false);
  };

  const handleOtpSubmit = async () => {
    if (!confirmationResult) {
      setError("Confirmation result not found. Please try again.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Step 1: Confirm the OTP with Firebase
      const userCredential = await confirmationResult.confirm(otp);
      const firebaseToken = await userCredential.user.getIdToken();

      // Step 2: Get the App Check token
      if (!appCheck) throw new Error("App Check not initialized.");
      const appCheckTokenResponse = await getToken(appCheck, false);

      // Step 3: Call your backend with both tokens and the role
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appCheckTokenResponse.token, // Send App Check token in header
        },
        // CORRECTED: The body now uses 'firebase_token' to match the backend
        body: JSON.stringify({ firebase_token: firebaseToken, role }), 
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Authentication failed on the server.');
      }

      const data = await response.json();
      const finalRole = data.userProfile?.role;

      // Step 4: Redirect to the role-based dashboard
      if (finalRole) {
        router.push(`/dashboard/${finalRole}`);
      } else {
        router.push('/dashboard'); // Fallback
      }
      
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(err.message || 'OTP verification failed.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 md:p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800 dark:text-white">
          {step === 'enter-phone' ? 'Enter Phone Number' : 'Enter Verification Code'}
        </h1>

        {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          {step === 'enter-phone' ? (
            <>
              <Input
                type="tel"
                placeholder="+1 555 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button
                onClick={handlePhoneSubmit}
                className="w-full"
                disabled={loading || !role || !phoneNumber}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                onClick={handleOtpSubmit}
                className="w-full"
                disabled={loading || otp.length < 6}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
            </>
          )}
        </div>
        
        {/* This div is required for the invisible reCAPTCHA */}
        <div id="recaptcha-container" className="my-4"></div>

        {/* This part of the code was removed for simplicity as createClientComponentClient was not used */}
        {/* const supabase = createClientComponentClient(); */}
      </div>
    </div>
  );
}

