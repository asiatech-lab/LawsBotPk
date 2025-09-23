import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Literata } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'LawPlan AI',
  description: 'AI-powered legal strategy assistant',
};

const fontSerif = Literata({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'font-serif antialiased',
          fontSerif.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
