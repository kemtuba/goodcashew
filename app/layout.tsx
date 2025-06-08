// app/layout.tsx

import type { Metadata } from 'next';
// CORRECTED PATH: This path goes up one level from 'app' to find the 'styles' directory.
import '../styles/globals.css'; 

// UPDATED METADATA: Changed to reflect your project.
export const metadata: Metadata = {
  title: 'GoodCashew',
  description: 'A platform for cashew farmers and cooperatives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}