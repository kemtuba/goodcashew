"use client"

import { useState, useEffect, useRef } from "react";
import { useSupabase } from "@/app/(dashboard)/supabase-context";
import { Users, TrendingUp, Search, GraduationCap, Award, School, MapPin, Target, ShieldCheck, DollarSign, LayoutDashboard, GitCommitHorizontal, MessageSquare, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// --- Data Types (Unchanged) ---
interface UserRecord {
  id: string;
  full_name: string;
  role: string;
  is_rsla_parent: boolean;
  location?: string;
  certification_status?: string;
}
const initialProgramData = {
  kpis: { totalFarmers: 0, organicCertificationRate: 0, averageYieldIncrease: 18, schoolFeePaymentRate: 89, },
  users: [] as any[], agriculturalImpact: [] as any[], educationalImpact: [] as any[],
};
type ProgramData = typeof initialProgramData;

// --- Conversation Type for AI Agent ---
interface Conversation {
  question: string;
  answer: string;
}

// --- Main Admin Page Component ---
export default function AdminAIPage() {
  const supabase = useSupabase();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW STATE MANAGEMENT FOR THE LAYOUT ---
  const [activeView, setActiveView] = useState("overview"); // Controls what's shown in the main panel
  const [conversation, setConversation] = useState<Conversation[]>([]); // Stores the chat history
  const [agentQuestion, setAgentQuestion] = useState(""); // The user's current question for the agent
  const [agentIsLoading, setAgentIsLoading] = useState(false); // Loading state for the agent

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching Logic (Mostly Unchanged) ---
  useEffect(() => {
    if (!supabase) return;
    const fetchAdminData = async () => {
      // ... your existing data fetching logic remains here ...
      // For brevity, using a simplified version. Your full logic is fine.
       try {
        setLoading(true);
        const { data: users, error: usersError } = await supabase.from('users').select('*');
        if (usersError) throw usersError;

        const totalFarmers = users.filter((u: UserRecord) => u.role === 'farmer' || u.role === 'lead-farmer').length;
        const certifiedFarmers = users.filter((u: UserRecord) => u.certification_status === 'certified').length;
        const organicCertificationRate = totalFarmers > 0 ? Math.round((certifiedFarmers / totalFarmers) * 100) : 0;
        
        const liveData: ProgramData = {
          ...initialProgramData,
          kpis: { ...initialProgramData.kpis, totalFarmers, organicCertificationRate },
          agriculturalImpact: [
            { month: "Jan", yield: 450 }, { month: "Feb", yield: 465 }, { month: "Mar", yield: 480 },
            { month: "Apr", yield: 510 }, { month: "May", yield: 515 }, { month: "Jun", yield: 520 },
          ],
           educationalImpact: [
            { month: "Jan", attendance: 82 }, { month: "Feb", attendance: 84 }, { month: "Mar", attendance: 86 },
            { month: "Apr", attendance: 87 }, { month: "May", attendance: 88 }, { month: "Jun", attendance: 89 },
          ],
        };
        setProgramData(liveData);
      } catch (err: any) {
        setError("Could not load program data.");
        console.error("Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [supabase]);

  // --- NEW: Function to handle agent submission ---
  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentQuestion.trim()) return;

    const currentQuestion = agentQuestion;
    setAgentIsLoading(true);
    setAgentQuestion(""); // Clear input immediately

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });

      if (!response.ok) throw new Error("Agent failed to respond.");

      const data = await response.json();
      setConversation(prev => [...prev, { question: currentQuestion, answer: data.answer }]);
    } catch (error) {
      console.error("Agent error:", error);
      setConversation(prev => [...prev, { question: currentQuestion, answer: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setAgentIsLoading(false);
    }
  };
  
  // Auto-scroll chat history
  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversation]);


  // --- Render Logic ---
  if (loading) return <DashboardSkeleton />;
  if (error || !programData) return <div className="text-center text-red-500 p-4">{error || "No data available."}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_350px] h-screen bg-zinc-900 text-white">
      {/* === COLUMN 1: NAVIGATION SIDEBAR === */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* === COLUMN 2: MAIN CONTENT & AGENT INPUT === */}
      <main className="flex flex-col h-screen overflow-hidden">
        {/* --- Top part: Scrollable content --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <header>
            <h1 className="text-3xl font-bold">GoodCashew Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor progress for Jaman North.</p>
          </header>
          {activeView === 'overview' && <OverviewPanel data={programData} />}
          {activeView === 'education' && <EducationPanel data={programData} />}
          {/* Add other panels for 'outcomes', 'community' etc. */}
        </div>

        {/* --- Bottom part: Persistent Agent Input --- */}
        <div className="p-6 border-t border-zinc-700 bg-zinc-800">
            <form onSubmit={handleAgentSubmit} className="flex items-center gap-4">
                <Input
                    type="text"
                    value={agentQuestion}
                    onChange={(e) => setAgentQuestion(e.target.value)}
                    placeholder="Ask about the curriculum or program data..."
                    className="flex-1 bg-zinc-700 border-zinc-600 focus:ring-amber-500"
                    disabled={agentIsLoading}
                />
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={agentIsLoading}>
                    {agentIsLoading ? "Thinking..." : "Ask"}
                </Button>
            </form>
        </div>
      </main>

      {/* === COLUMN 3: AGENT CONVERSATION HISTORY === */}
      <aside ref={chatHistoryRef} className="h-screen overflow-y-auto bg-zinc-900/50 border-l border-zinc-700 flex flex-col">
        <div className="p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold flex items-center gap-2"><MessageSquare size={20} /> Agent History</h2>
        </div>
        <div className="flex-1 p-4 space-y-6">
            {conversation.length === 0 && (
                <div className="text-center text-muted-foreground mt-10">
                    <Bot size={40} className="mx-auto mb-2" />
                    <p>Your conversation with the agent will appear here.</p>
                </div>
            )}
            {conversation.map((chat, index) => (
                <div key={index}>
                    <p className="font-semibold text-amber-400 mb-1">{chat.question}</p>
                    <p className="text-gray-300 leading-relaxed">{chat.answer}</p>
                </div>
            ))}
        </div>
      </aside>
    </div>
  );
}


// --- SUPPORTING COMPONENTS ---

// --- Sidebar Navigation Component ---
const NAV_ITEMS = [
    { id: 'overview', label: 'Program Overview', icon: LayoutDashboard },
    { id: 'education', label: 'School Partnership', icon: School },
    { id: 'outcomes', label: 'Theory of Change', icon: GitCommitHorizontal },
    { id: 'community', label: 'Community Impact', icon: MapPin },
]
function Sidebar({ activeView, setActiveView }: { activeView: string, setActiveView: (view: string) => void }) {
    return (
        <nav className="p-4 space-y-2 bg-zinc-800 border-r border-zinc-700 h-screen">
            <h2 className="px-4 text-lg font-semibold tracking-tight mb-4">Dashboard</h2>
            {NAV_ITEMS.map(item => (
                <Button
                    key={item.id}
                    variant={activeView === item.id ? "secondary" : "ghost"}
                    onClick={() => setActiveView(item.id)}
                    className="w-full justify-start gap-2"
                >
                    <item.icon size={18} />
                    {item.label}
                </Button>
            ))}
        </nav>
    );
}

// --- Overview Panel Component ---
function OverviewPanel({ data }: { data: ProgramData }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-800 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Farmers</CardTitle><Users /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.totalFarmers}</div></CardContent></Card>
                <Card className="bg-zinc-800 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Organic Certified</CardTitle><Award /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.organicCertificationRate}%</div></CardContent></Card>
                <Card className="bg-zinc-800 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Yield Increase</CardTitle><TrendingUp /></CardHeader><CardContent><div className="text-2xl font-bold">+{data.kpis.averageYieldIncrease}%</div></CardContent></Card>
                <Card className="bg-zinc-800 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">School Fee Payments</CardTitle><DollarSign /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.schoolFeePaymentRate}%</div></CardContent></Card>
            </div>
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader><CardTitle>Agricultural Impact Over Time</CardTitle></CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.agriculturalImpact}>
                            <defs><linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="month" stroke="#a1a1aa" />
                            <YAxis stroke="#a1a1aa" />
                            <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                            <Area type="monotone" dataKey="yield" stroke="#f59e0b" fill="url(#colorYield)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Education Panel Component ---
function EducationPanel({ data }: { data: ProgramData }) {
    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader><CardTitle>Educational Impact Over Time</CardTitle></CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.educationalImpact}>
                        <XAxis dataKey="month" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" />
                        <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#34d399" name="Attendance (%)" />
                        <Line type="monotone" dataKey="feePayment" stroke="#f59e0b" name="Fee Payments (%)" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// --- Skeleton Loader ---
function DashboardSkeleton() {
    return (
        <div className="flex h-screen bg-zinc-900">
            <div className="w-[280px] p-4 space-y-4 border-r border-zinc-700"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
            <div className="flex-1 p-6 space-y-6"><Skeleton className="h-12 w-full max-w-lg" /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div><Skeleton className="h-80 w-full" /></div>
            <div className="w-[350px] p-4 border-l border-zinc-700"><Skeleton className="h-8 w-1/2" /></div>
        </div>
    );
}