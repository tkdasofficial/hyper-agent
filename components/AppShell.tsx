'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from '@/lib/session-context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UpgradeModal } from '@/components/UpgradeModal';
import { AuthModal } from '@/components/AuthModal';

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { upgradeModalOpen, setUpgradeModalOpen } = useSession();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const isStandalone =
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/upgrade') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password');

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col antialiased selection:bg-neutral-800 selection:text-white">
      {/* Dynamic Header Bar */}
      <Header
        sidebarOpen={desktopSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onOpenUpgrade={() => setUpgradeModalOpen(true)}
      />

      {/* Main Workspace Body: Sidebar + Routed Page Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {!isStandalone && (
          <Sidebar
            isOpen={desktopSidebarOpen}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        <main
          id="main-workspace-scroll-area"
          className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)] relative pb-32"
        >
          {children}
        </main>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>
        <AppShellContent>{children}</AppShellContent>
      </SessionProvider>
    </AuthProvider>
  );
}
