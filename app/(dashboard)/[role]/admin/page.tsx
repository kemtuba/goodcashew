"use client";

import React from 'react';
import { Users, BarChart3, TrendingUp, DollarSign, Edit, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import type { Language } from "@/lib/types";

// Translations specific to the admin dashboard
const translations = {
  en: {
    title: "Program Administration",
    overview: "Comprehensive overview of the Good Cashew program.",
    totalUsers: "Total Users",
    trainingCompletion: "Training Completion",
    avgYield: "Average Yield (kg/ha)",
    stipendsDisbursed: "Stipends Disbursed",
    userManagement: "User Management",
    searchUsers: "Search by name, role, or phone...",
    name: "Name",
    role: "Role",
    lastActive: "Last Active",
    actions: "Actions",
    edit: "Edit",
    impersonate: "Impersonate",
    financialOverview: "Financial Overview",
    budgetUtilization: "Budget Utilization",
    programHealth: "Program Health & Impact",
    yieldTrend: "Yield Trend (Last 6 Months)",
    roleDistribution: "Role Distribution",
  },
  // Add other languages as needed
};

// Placeholder data representing aggregated data from your entire Supabase database
const adminData = {
  kpis: {
    totalUsers: 72,
    trainingCompletionRate: 81,
    averageYield: 520,
    stipendsDisbursed: "GHS 54,000",
  },
  users: [
    { name: "Kwame Asante", role: "farmer", lastActive: "2h ago" },
    { name: "Adwoa Serwaa", role: "coop-leader", lastActive: "1d ago" },
    { name: "Kofi Mensah", role: "extension-worker", lastActive: "5m ago" },
    { name: "Ama Osei", role: "farmer", lastActive: "5h ago" },
    { name: "Yaw Boakye", role: "farmer", lastActive: "3d ago" },
  ],
  financials: {
    totalBudget: 150000,
    disbursed: 54000,
    duesCollected: 12500,
  },
  yieldTrendData: [
    { month: "Jan", yield: 450 },
    { month: "Feb", yield: 465 },
    { month: "Mar", yield: 480 },
    { month: "Apr", yield: 510 },
    { month: "May", yield: 515 },
    { month: "Jun", yield: 520 },
  ],
  roleDistributionData: [
    { name: 'Farmers', value: 58 },
    { name: 'Coop Leaders', value: 5 },
    { name: 'Extension Workers', value: 8 },
    { name: 'Admin', value: 1 },
  ],
};

const COLORS = ['#4ADE80', '#A78BFA', '#60A5FA', '#FBBF24'];

// The main component for the Admin Dashboard page
export default function AdminDashboardPage() {
  const language: Language = 'en';
  const t = translations[language];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.overview}</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.kpis.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.trainingCompletion}</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.kpis.trainingCompletionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.avgYield}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.kpis.averageYield}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.stipendsDisbursed}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.kpis.stipendsDisbursed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Program Health & Impact Visualization - Key for reporting and funding */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t.yieldTrend}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adminData.yieldTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#4ADE80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.roleDistribution}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={adminData.roleDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {adminData.roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Management and Financials */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.userManagement}</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.searchUsers} className="pl-8 w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.name}</TableHead>
                  <TableHead>{t.role}</TableHead>
                  <TableHead className="text-right">{t.lastActive}</TableHead>
                  <TableHead className="text-center">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData.users.map((user) => (
                  <TableRow key={user.name}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{user.lastActive}</TableCell>
                    <TableCell className="text-center space-x-2">
                       <Button variant="outline" size="sm">{t.impersonate}</Button>
                       <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t.financialOverview}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1 font-medium">
                        <span>{t.stipendsDisbursed}</span>
                        <span>{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(adminData.financials.disbursed)}</span>
                    </div>
                     <p className="text-xs text-muted-foreground">
                        {t.budgetUtilization}
                    </p>
                    <Progress value={(adminData.financials.disbursed / adminData.financials.totalBudget) * 100} className="mt-2"/>
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1 font-medium">
                        <span>Dues Collected</span>
                        <span>{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(adminData.financials.duesCollected)}</span>
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Contribution to cooperative funds.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
