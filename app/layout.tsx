// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Import the ThemeProvider you created.
import { ThemeProvider } from "@/components/ThemeProvider";
// Import the Toaster component for notifications.
import { Toaster } from "@/components/ui/sonner";

// Import the global stylesheet. The path is correct.
import "../styles/globals.css";

// Setup the primary font for the application.
const inter = Inter({ subsets: ["latin"] });

// The metadata remains the same.
export const metadata: Metadata = {
  title: "GoodCashew",
  description: "A platform for cashew farmers and cooperatives.",
};

/**
 * This is the RootLayout for the entire application. It wraps every page.
 * It's the ideal place to include global context providers like ThemeProvider
 * and to render global components like a Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The `suppressHydrationWarning` is recommended when using next-themes.
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/*
          The ThemeProvider wraps everything, allowing any component
          in your app to access and react to the current theme.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/*
            The Toaster component is rendered here at the root so that toast
            notifications can be triggered from any page and will appear
            correctly on top of all other content.
          */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
