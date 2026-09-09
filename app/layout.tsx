import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Hyper Agent | Autonomous AI Video Agent Interface',
  description: 'Autonomous AI Video Agent interface featuring dynamic active canvas, generation carousel, modular config pills, automated workflows, and multi-platform integrations.',
  openGraph: {
    title: 'Hyper Agent | Autonomous AI Video Agent Interface',
    description: 'Autonomous AI Video Agent interface featuring dynamic active canvas, generation carousel, modular config pills, automated workflows, and multi-platform integrations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hyper Agent | Autonomous AI Video Agent Interface',
    description: 'Autonomous AI Video Agent interface featuring dynamic active canvas, generation carousel, modular config pills, automated workflows, and multi-platform integrations.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#09090b] text-neutral-100 antialiased selection:bg-neutral-800 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
