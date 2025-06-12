// app/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, AlertCircle, Loader2, Users, Briefcase, Crown, Trees } from "lucide-react"
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserRole, Language } from "@/lib/types"

// This interface is required for attaching Firebase objects to the window
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

// --- ALL COMPONENTS ARE NOW IN THIS SINGLE FILE ---

// The RoleIllustration component is now defined directly inside this file.
// This removes the need for any external import.
const RoleIllustration = ({ role }: { role: UserRole | "" }) => {
  const roleVisuals = {
    farmer: { Icon: Users, gradient: "from-green-500/20 to-green-500/0", color: "text-green-400" },
    'coop-leader': { Icon: Crown, gradient: "from-purple-500/20 to-purple-500/0", color: "text-purple-400" },
    'extension-worker': { Icon: Briefcase, gradient: "from-blue-500/20 to-blue-500/0", color: "text-blue-400" },
    default: { Icon: Trees, gradient: "from-gray-500/20 to-gray-500/0", color: "text-gray-400" }
  };
  const visual = roleVisuals[role || 'default'];
  return (
    <div className={`relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden bg-gray-800/50`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${visual.gradient}`} />
      <visual.Icon size={120} className={visual.color} strokeWidth={1.5} />
    </div>
  );
};

const SegmentedControl = ({ roles, selectedRole, setSelectedRole }: {
  roles: { key: UserRole; label: string }[],
  selectedRole: UserRole | "",
  setSelectedRole: (role: UserRole) => void
}) => {
  return (
    <div className="flex w-full p-1 bg-gray-900/50">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => setSelectedRole(role.key)}
          className={`w-full rounded-md p-2 text-sm font-semibold transition-colors duration-200 ${selectedRole === role.key ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"}`}>
          {role.label}
        </button>
      ))}
    </div>
  );
};


// --- The Main Page Component ---

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  }, []);

  useEffect(() => {
    setPhoneValid(phoneNumber.length >= 10);
  }, [phoneNumber]);

  const handleSendCode = async () => {
    // ... function logic from previous step
  };
  
  const handleVerifyCode = async () => {
    // ... function logic from previous step
  };

  const roles = [
    { key: "farmer" as UserRole, label: "Farmer" },
    { key: "extension-worker" as UserRole, label: "Extension Worker" },
    { key: "coop-leader" as UserRole, label: "Cooperative Leader" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-[#1F2937]">
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row md:items-center rounded-xl overflow-hidden">
        <div className="w-full md:w-1/2">
          <div className="w-full h-48 md:h-full md:aspect-auto aspect-video">
            <RoleIllustration role={selectedRole} />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8 bg-gray-800/50">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold tracking-wider text-white">GOODCASHEW</div>
          </div>
          <div id="recaptcha-container"></div>
          {!isCodeSent ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-600/80 overflow-hidden bg-gray-900/50">
                <SegmentedControl roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                <div className="w-full h-px bg-gray-600/80"></div>
                <div className="relative">
                  <Input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-transparent border-0 rounded-none h-14 px-4 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {phoneNumber.length > 0 && (phoneValid ? <Check className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />)}
                  </div>
                </div>
              </div>
              <Button onClick={handleSendCode} disabled={loading || !selectedRole || !phoneValid} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 h-14">
                {loading ? "Sending..." : "Continue"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-300">Enter the code we sent you.</p>
              <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" required className="w-full bg-gray-900/50 border border-gray-600/80 rounded-lg h-14 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <Button onClick={handleVerifyCode} disabled={loading || code.length < 6} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 h-14">
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