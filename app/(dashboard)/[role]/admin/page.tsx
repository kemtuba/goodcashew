"use client"

import { useState, useEffect, useRef } from "react";
// --- HIGHLIGHT: This import path has been corrected to use an absolute alias ---
import { useUserProfile } from "@/app/(dashboard)/layout"; 
import { Users, TrendingUp, Sparkles, CalendarDays, Bot, ChevronRight, Mic, Award, DollarSign, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// --- Types ---
interface ProgramData {
  kpis: { totalFarmers: number; organicCertificationRate: number; averageYieldIncrease: number; schoolFeePaymentRate: number; };
  agriculturalImpact: any[];
}
interface Conversation {
  question: string;
  answer: string;
}

// --- Main Page Component ---
export default function AdminDashboardPage() {
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Agent State
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [agentQuestion, setAgentQuestion] = useState("");
  const [agentIsLoading, setAgentIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const userProfile = useUserProfile();

  // Mock data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgramData({
        kpis: { totalFarmers: 80, organicCertificationRate: 0, averageYieldIncrease: 18, schoolFeePaymentRate: 89 },
        agriculturalImpact: [
          { month: "Jan", yield: 450 }, { month: "Feb", yield: 465 }, { month: "Mar", yield: 480 },
          { month: "Apr", yield: 510 }, { month: "May", yield: 515 }, { month: "Jun", yield: 520 },
        ],
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAgentSubmit = async (questionText: string) => {
    if (!questionText.trim() || agentIsLoading) return;

    setAgentIsLoading(true);
    setAgentQuestion("");
    setConversation(prev => [...prev, { question: questionText, answer: "" }]);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) throw new Error("Agent failed to respond.");

      const data = await response.json();
      setConversation(prev => {
        const newConversation = [...prev];
        newConversation[newConversation.length - 1].answer = data.answer;
        return newConversation;
      });
    } catch (error) {
       setConversation(prev => {
        const newConversation = [...prev];
        newConversation[newConversation.length - 1].answer = "Sorry, I encountered an error. Please try again.";
        return newConversation;
      });
    } finally {
      setAgentIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    console.log("Voice input activated. Implement speech-to-text here.");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (loading || !programData) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8">
        <AgentHub 
          data={programData} 
          conversation={conversation} 
          onSuggestionClick={handleAgentSubmit}
          userName={userProfile?.full_name.split(' ')[0]} 
        />
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 md:p-6 lg:p-8 border-t border-zinc-700 bg-zinc-800/50">
        <form onSubmit={(e) => { e.preventDefault(); handleAgentSubmit(agentQuestion); }} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="flex-shrink-0">
            <Mic size={20} />
          </Button>
          <div className="relative flex-1">
            <Input
              value={agentQuestion}
              onChange={(e) => setAgentQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-zinc-700 border-zinc-600 focus:ring-amber-500 h-12 pl-4 pr-12"
              disabled={agentIsLoading}
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 h-8 w-8" disabled={agentIsLoading}>
              <ChevronRight size={20} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Agent Hub Component ---
const SUGGESTED_QUESTIONS = [ "What are the key tasks for January?", "List safety measures for pest control.", "Summarize organic certification." ];
function AgentHub({ data, conversation, onSuggestionClick, userName }: { data: ProgramData, conversation: Conversation[], onSuggestionClick: (question: string) => void, userName?: string }) {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {conversation.length === 0 ? (
                <>
                    <div className="text-center"><h2 className="text-2xl font-bold">Welcome, {userName || 'Admin'}</h2><p className="text-muted-foreground">Here are today's insights. Ask the agent anything below.</p></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        <Card className="bg-zinc-800/50 border-zinc-700"><CardHeader className="flex flex-row items-center gap-3 space-y-0"><CalendarDays className="text-amber-400" /><CardTitle>Timely Insight: July Focus</CardTitle></CardHeader><CardContent><p>The curriculum focus shifts to post-harvest handling and preparing for the next cycle. This is a critical time for farm management and soil health.</p></CardContent></Card>
                         <Card className="bg-zinc-800/50 border-zinc-700"><CardHeader className="flex flex-row items-center gap-3 space-y-0"><Sparkles className="text-blue-400" /><CardTitle>Suggested Questions</CardTitle></CardHeader><CardContent className="flex flex-col gap-2">
                                {SUGGESTED_QUESTIONS.map(q => ( <button key={q} onClick={() => onSuggestionClick(q)} className="text-left text-sm p-2 rounded-md hover:bg-zinc-700 transition-colors">{q}</button> ))}
                            </CardContent></Card>
                    </div>
                    <OverviewPanel data={data} />
                </>
            ) : (
                <div className="space-y-8">
                    {conversation.map((chat, index) => (
                        <div key={index}>
                            <p className="font-semibold text-amber-400 mb-2 pl-4 border-l-2 border-amber-400">{chat.question}</p>
                            <div className="flex items-start gap-4"><Bot className="flex-shrink-0 mt-1 text-muted-foreground" /><div className="text-gray-300 leading-relaxed prose prose-invert prose-p:my-0">{chat.answer ? <p>{chat.answer}</p> : <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>}</div></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Overview Panel Component ---
function OverviewPanel({ data }: { data: ProgramData }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Program KPIs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-zinc-800/50 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Farmers</CardTitle><Users /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.totalFarmers}</div></CardContent></Card>
                <Card className="bg-zinc-800/50 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Organic Certified</CardTitle><Award /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.organicCertificationRate}%</div></CardContent></Card>
                <Card className="bg-zinc-800/50 border-zinc-700"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">School Fee Payments</CardTitle><DollarSign /></CardHeader><CardContent><div className="text-2xl font-bold">{data.kpis.schoolFeePaymentRate}%</div></CardContent></Card>
                <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-zinc-600 hover:border-amber-500 hover:bg-zinc-800/50 transition-colors"><Plus className="h-8 w-8 text-zinc-500" /><span className="mt-2 text-sm font-medium text-zinc-400 text-center">Add New Metric</span></button>
            </div>
            <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader><CardTitle>Agricultural Impact Over Time</CardTitle></CardHeader>
                <CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.agriculturalImpact}><defs><linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} /><YAxis stroke="#a1a1aa" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46' }} /><Area type="monotone" dataKey="yield" stroke="#f59e0b" fill="url(#colorYield)" /></AreaChart></ResponsiveContainer></CardContent>
            </Card>
        </div>
    );
}

// --- Skeleton Loader ---
function DashboardSkeleton() {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <Skeleton className="h-12 w-full max-w-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
            <Skeleton className="h-80 w-full" />
        </div>
    );
}
