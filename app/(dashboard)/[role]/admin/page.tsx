"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/app/(dashboard)/supabase-context";
import { Users, TrendingUp, Edit, Search, GraduationCap, Award, School, MapPin, Target, ShieldCheck, BarChart3, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
// --- THIS IS THE FIX, PART 1: Import the Select component for mobile navigation ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"

// Define the shape of a single user record from your Supabase table
interface UserRecord {
  id: string;
  full_name: string;
  role: string;
  is_rsla_parent: boolean;
  location?: string;
  certification_status?: string;
}

// Re-using your excellent data structure for type definition
const initialProgramData = {
  kpis: {
    totalFarmers: 0,
    trainingCompletionRate: 0,
    organicCertificationRate: 0,
    averageYieldIncrease: 0,
    stipendsDisbursed: "GHS 0",
    schoolFeePaymentRate: 0,
    studentAttendanceImprovement: 0,
    communityEngagementScore: 0,
  },
  users: [] as { name: string; role: string; location: string; certificationStatus: string; lastActive: string; }[],
  agriculturalImpact: [] as any[],
  educationalImpact: [] as any[],
  outcomes: {
    shortTerm: { farmingPracticesImproved: 0, incomeStabilized: 0, schoolAttendanceIncreased: 0 },
    mediumTerm: { educationalFacilitiesImproved: 0, localIndustryGrowth: 0, communityTiesStrengthened: 0 },
    longTerm: { sustainableEconomicDevelopment: 0, educationalAttainment: 0, landOwnershipSecured: 0 },
  },
  schoolPartnership: { studentsAffected: 0, parentFarmersInProgram: 0, facilityImprovements: 0, teacherTrainingHours: 0, feePaymentConsistency: 0},
  communityDevelopment: [] as { name: string; value: number; target: number }[],
  financials: { totalBudget: 150000, stipendsDisbursed: 0, certificationSupport: 0, schoolInvestments: 0, communityDevelopment: 0, duesCollected: 0, organicPremiumEarned: 0},
};

type ProgramData = typeof initialProgramData;

const TABS = [
    { value: "overview", label: "Program Overview" },
    { value: "outcomes", label: "Theory of Change" },
    { value: "education", label: "School Partnership" },
    { value: "community", label: "Community Impact" },
]

export default function EnhancedAdminDashboard() {
  const supabase = useSupabase();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!supabase) return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // This query is designed to fetch ALL users.
        const { data: users, error: usersError } = await supabase.from('users').select('*');
        
        if (usersError) throw usersError;

        if (!users || users.length === 0) {
            console.warn(
              "Admin Dashboard Warning: The query for users returned 0 rows. " +
              "This is likely because the currently logged-in user does not have the 'admin' role in the 'users' table. " +
              "Please check your user record in the Supabase table editor to ensure the role is set correctly."
            );
        }

        const totalFarmers = users.filter((u: UserRecord) => u.role === 'farmer' || u.role === 'lead-farmer').length;
        const certifiedFarmers = users.filter((u: UserRecord) => u.certification_status === 'certified').length;
        const organicCertificationRate = totalFarmers > 0 ? Math.round((certifiedFarmers / totalFarmers) * 100) : 0;
        
        const liveData: ProgramData = {
          ...initialProgramData,
          kpis: {
            ...initialProgramData.kpis,
            totalFarmers: totalFarmers,
            organicCertificationRate: organicCertificationRate,
            averageYieldIncrease: 18, 
            schoolFeePaymentRate: 89,
          },
          users: users.map((u: UserRecord) => ({
            name: u.full_name,
            role: u.role,
            location: u.location || 'Kabile',
            certificationStatus: u.certification_status || 'pending',
            lastActive: '1h ago', 
          })),
          agriculturalImpact: [
            { month: "Jan", yield: 450, organicCertified: 15 },
            { month: "Feb", yield: 465, organicCertified: 22 },
            { month: "Mar", yield: 480, organicCertified: 28 },
            { month: "Apr", yield: 510, organicCertified: 35 },
            { month: "May", yield: 515, organicCertified: 39 },
            { month: "Jun", yield: 520, organicCertified: 43 },
          ],
           educationalImpact: [
            { month: "Jan", attendance: 82, feePayment: 75, performance: 78 },
            { month: "Feb", attendance: 84, feePayment: 78, performance: 80 },
            { month: "Mar", attendance: 86, feePayment: 82, performance: 82 },
            { month: "Apr", attendance: 87, feePayment: 85, performance: 84 },
            { month: "May", attendance: 88, feePayment: 87, performance: 86 },
            { month: "Jun", attendance: 89, feePayment: 89, performance: 88 },
          ],
           communityDevelopment: [
            { name: "Land Ownership Secured", value: 22, target: 50 },
            { name: "Cooperative Membership", value: 68, target: 80 },
          ],
        };

        setProgramData(liveData);
      } catch (err: any) {
        setError("Could not load program data. Please check RLS policies and network connection.");
        console.error("Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [supabase]);

  if (loading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-full max-w-lg" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
            <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-80 w-full" /><Skeleton className="h-80 w-full" /></div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }
  
  if (!programData) {
    return <div>No program data available.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">GoodCashew Admin Dashboard</h1>
<p className="text-muted-foreground">
  Monitor progress across farmer support, education, and sustainability in Jaman North.
</p>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* --- THIS IS THE FIX, PART 2: Responsive Tab Navigation --- */}
        {/* This TabsList is visible on medium screens and up */}
        <TabsList className="hidden md:grid w-full grid-cols-4">
          {TABS.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
        </TabsList>
        {/* This Select dropdown is visible only on small screens */}
        <div className="md:hidden">
            <Select onValueChange={setActiveTab} value={activeTab}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                    {TABS.map(tab => <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{programData.kpis.totalFarmers}</div> 
                    <p className="text-xs text-muted-foreground">Pre-registered program members</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organic Certified</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{programData.kpis.organicCertificationRate}%</div>
                    <p className="text-xs text-muted-foreground">Target: 50% by year 2</p>
                  </CardContent>
                </Card>
                {/* Other KPI cards would follow... */}
            </div>
            {/* Other overview content... */}
        </TabsContent>
        {/* Other TabsContent sections... */}
      </Tabs>
    </div>
  )
}
