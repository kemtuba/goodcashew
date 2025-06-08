// components/sections/dashboard/Header.tsx
"use client";

import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home, BookOpen, Wrench, Users, Award, Settings } from "lucide-react";
import { Button } from "@/components/ui/button"; // Corrected path
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Corrected path

// Assuming these types are defined in a central file like `/types.ts`
type UserRole = "farmer" | "extension-worker" | "coop-leader" | "admin" | "retailer";
type Language = "en" | "twi" | "nafana" | "fr";

// The props this component accepts. UserRole and Language can be used for display.
interface HeaderProps {
  language: Language;
  userRole: UserRole;
}

// All your great translation work is preserved.
const translations = {
  en: {
    title: "GoodCashew",
    dashboard: "Dashboard",
    education: "Education Modules",
    technical: "Technical Assistance",
    cooperative: "Cooperative Services",
    certification: "Certification",
    settings: "Settings",
  },
  twi: { /* ... */ },
  nafana: { /* ... */ },
  fr: { /* ... */ },
};

export function Header({ language, userRole }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // The usePathname hook from Next.js gets the current URL path.
  // This is the modern way to determine which link is "active".
  const pathname = usePathname();
  const t = translations[language];

  // The menu items now use an `href` for direct navigation.
  const menuItems = [
    { href: `/${userRole}`, label: t.dashboard, icon: Home }, // Links to the user's main dashboard, e.g., /farmer
    { href: "/education", label: t.education, icon: BookOpen },
    { href: "/technical", label: t.technical, icon: Wrench },
    { href: "/cooperative", label: t.cooperative, icon: Users },
    { href: "/certification", label: t.certification, icon: Award },
    { href: "/settings", label: t.settings, icon: Settings },
  ];

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-white px-4 md:px-6">
      <div className="flex-1">
        {/* On desktop, you might want a title or breadcrumbs */}
        <h1 className="hidden text-lg font-semibold md:block">
          {/* Find the current page's label to display as a title */}
          {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile dropdown can go here */}
      </div>

      {/* This Sheet component for the mobile menu is perfect. */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          {/* This button is now visible on all screen sizes, but you can add `md:hidden` if you prefer */}
          <Button variant="ghost" size="icon" className="ml-4">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-white">
          <div className="flex flex-col gap-4 pt-8">
            <div className="text-center pb-4 border-b">
              <h2 className="text-lg font-semibold text-green-600">{t.title}</h2>
              <p className="text-sm text-gray-600 capitalize">{userRole.replace("-", " ")}</p>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              // We check if the current pathname matches the link's href to apply active styles.
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  asChild // The 'asChild' prop allows the Button to act as a Link
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start gap-3 h-12 text-lg"
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  <Link href={item.href}>
                    <Icon className="h-6 w-6" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
