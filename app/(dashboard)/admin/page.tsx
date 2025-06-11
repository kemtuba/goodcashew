// app/(dashboard)/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Spinner } from "@/components/ui/spinner"; // optional

// Your existing imports…
import { Users, UserCheck, Activity, LineChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Text translations
const t = {
  title: "Admin Dashboard",
  description: "Oversee program data and support onboarding",
  totalUsers: "Total Users",
  activeUsers: "Active This Week",
  onboardingProgress: "Onboarding Progress",
  systemHealth: "System Health",
  viewAllUsers: "View All Users",
};

export default function AdminDashboardPage() {
  const isAdmin = useAdminCheck();
  const router = useRouter();

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner /> {/* or just: "Loading..." */}
      </div>
    );
  }

  if (!isAdmin) {
    router.push("/unauthorized");
    return null;
  }

  // Placeholder dashboard data
  const dashboardData = {
    totalUsers: 80,
    activeUsers: 65,
    onboardingProgress: 75,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.activeUsers}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+10 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.onboardingProgress}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.onboardingProgress}%</div>
            <Progress value={dashboardData.onboardingProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.systemHealth}</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">All Systems Normal</div>
            <p className="text-xs text-muted-foreground">API response: 24ms</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View, add, or manage users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section would contain a table of users and management actions.</p>
          <Button className="mt-4">{t.viewAllUsers}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
