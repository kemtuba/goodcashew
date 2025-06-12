"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, AlertCircle, Loader2, Users, Briefcase, Crown } from "lucide-react"
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserRole } from "@/lib/types"

// This interface is required for attaching Firebase objects to the window
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

// --- ALL UI COMPONENTS ARE NOW DEFINED IN THIS FILE ---

// UPDATED: The SVG now includes a third path for the brown cashew nut.
const CashewIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 100 105" // viewBox is slightly taller to include the nut
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Path for the green leaf */}
    <path
      d="M60 20 C50 10, 30 15, 20 30"
      stroke="#4ADE80" strokeWidth="8" strokeLinecap="round"
    />
    {/* Path for the yellow fruit body */}
    <path
      d="M50 30 C10 40, 10 90, 55 90 S90 60, 70 40 C65 30, 55 25, 50 30 Z"
      fill="#FBBF24"
    />
    {/* Path for the brown cashew nut */}
    <path
      d="M55 90 C 50 100, 60 105, 65 95"
      stroke="#A16207" strokeWidth="8" strokeLinecap="round"
    />
  </svg>
);


// UPDATED: The logotype now uses absolute positioning for a true superscript effect.
const GoodCashewLogo = () => {
  return (
    // The parent container is now 'relative'
    <div className="relative">
      <svg width="180" height="28" viewBox="0 0 180 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="22" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="300" fill="white" letterSpacing="0.05em">GOOD</text>
        <text x="73" y="22" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="700" fill="white" letterSpacing="0.05em">CASHEW</text>
      </svg>
      {/* This div is now 'absolute' and positioned at the top-right */}
      <div className="absolute -top-2 -right-3">
        <CashewIcon />
      </div>
    </div>
  );
};


// The illustration component - no changes needed here.
const RoleIllustration = ({ role }: { role: UserRole | "" }) => {
  const roleVisuals = {
    farmer: { Icon: Users, gradient: "from-green-500/10 to-green-500/0", color: "text-green-400" },
    'coop-leader': { Icon: Crown, gradient: "from-amber-500/10 to-amber-500/0", color: "text-amber-400" },
    'extension-worker': { Icon: Briefcase, gradient: "from-slate-500/10 to-slate-500/0", color: "text-slate-400" },
  };
  const visual = roleVisuals[role || 'farmer'];

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-zinc-800/30 p-4 gap-y-3`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${visual.gradient}`} />
      <visual.Icon size={80} className={visual.color} strokeWidth={1.5} />
      <GoodCashewLogo />
    </div>
  );
};

const SegmentedControl = ({ roles, selectedRole, setSelectedRole }: {
  roles: { key: UserRole; label: string }[],
  selectedRole: UserRole,
  setSelectedRole: (role: UserRole) => void
}) => {
  return (
    <div className="flex w-full p-1 bg-gray-900/50">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => setSelectedRole(role.key)}
          className={`w-full rounded-md p-2 text-sm font-semibold transition-colors duration-200 ${selectedRole === role.key ? "bg-amber-600 text-white" : "text-gray-400 hover:text-white"}`}>
          {role.label}
        </button>
      ))}
    </div>
  );
};


// --- THE MAIN PAGE COMPONENT ---
export default function HomePage() {
  const router = useRouter();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [isPristine, setIsPristine] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  }, []);

  useEffect(() => {
    if (phoneNumber) {
        setPhoneValid(phoneNumber.length >= 10);
    } else {
        setPhoneValid(null);
    }
  }, [phoneNumber]);

  const handleSendCode = async () => {
    if (!selectedRole || !phoneValid) {
      setError("Please select a role and enter a valid phone number.");
      return;
    }
    setError(''); setLoading(true);
    try {
      const verifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      window.confirmationResult = confirmationResult;
      setIsCodeSent(true);
    } catch (err: any) {
      console.error("Error sending code:", err);
      setError(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError(''); setLoading(true);
    try {
      const confirmationResult = window.confirmationResult!;
      const userCredential = await confirmationResult.confirm(code);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error("Firebase user not found.");

      const firebaseToken = await firebaseUser.getIdToken(true);
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_token: firebaseToken, role: selectedRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to sync user profile.');

      router.push(`/dashboard`);
    } catch (err: any) {
      console.error("Error verifying code:", err);
      setError(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: "farmer" as UserRole, label: "Farmer" },
    { key: "extension-worker" as UserRole, label: "Extension Worker" },
    { key: "coop-leader" as UserRole, label: "Cooperative Leader" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-stone-900">
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row md:items-center rounded-xl overflow-hidden bg-stone-800/30 shadow-2xl">
        
        <div className="w-full md:w-1/2">
          <div className="w-full h-48 md:h-full md:aspect-auto aspect-video">
            <RoleIllustration role={selectedRole} />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8">
            <div id="recaptcha-container"></div>
            {!isCodeSent ? (
              <div className="space-y-4">
                <p className="text-xs text-center text-gray-400 font-medium">Select your role</p>
                <div className="rounded-lg border border-gray-600/80 overflow-hidden bg-gray-900/50">
                  <SegmentedControl roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                  <div className="w-full h-px bg-gray-600/80"></div>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setIsPristine(false);
                      }}
                      className={`w-full bg-transparent border-0 rounded-none h-14 px-4 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 transition-all ${isPristine ? 'animate-pulse ring-2 ring-amber-500/50' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {phoneNumber.length > 0 && (phoneValid ? <Check className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />)}
                    </div>
                  </div>
                </div>
                <Button onClick={handleSendCode} disabled={loading || !selectedRole || !phoneValid} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold text-lg py-3 h-14">
                  {loading ? "Sending..." : `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).replace('-', ' ')}`}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-300">Enter the code we sent you.</p>
                <Input
                  id="code" type="text" value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code" required
                  className="w-full bg-gray-900/50 border border-gray-600/80 rounded-lg h-14 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button onClick={handleVerifyCode} disabled={loading || code.length < 6} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold text-lg py-3 h-14">
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>
            )}
            {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}