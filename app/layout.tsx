import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scene AI - AI Video Background Removal',
  description: 'Remove video backgrounds instantly with AI-powered precision. Perfect for creators, marketers, and professionals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "bg-black min-h-screen"
      )}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
