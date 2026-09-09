'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Workflow,
  Share2,
  X,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export type NavPage = 'dashboard' | 'library' | 'workflows' | 'integrations';

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const SidebarAuthItem: React.FC<{ isOpen: boolean; onCloseMobile: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { user, openAuthModal } = useAuth();

  const handleClick = () => {
    onCloseMobile();
    openAuthModal('login');
  };

  if (user) {
    const initials = (user.email || 'U').slice(0, 2).toUpperCase();
    return (
      <button
        id="sidebar-btn-auth-user"
        type="button"
        onClick={handleClick}
        className={`
          w-full flex items-center rounded-lg text-xs font-medium transition-colors
          px-2.5 py-2 gap-2.5 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 cursor-pointer
          ${!isOpen ? 'lg:px-0 lg:py-2 lg:justify-center' : ''}
        `}
        title={user.email || 'Account'}
      >
        <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px] shrink-0">
          {initials}
        </div>
        <div className={`flex flex-col text-left min-w-0 ${!isOpen ? 'lg:hidden' : ''}`}>
          <span className="text-[11px] font-medium text-white truncate max-w-[130px]">
            {user.email}
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">Authenticated</span>
        </div>
      </button>
    );
  }

  return (
    <button
      id="sidebar-btn-auth-signin"
      type="button"
      onClick={handleClick}
      className={`
        w-full flex items-center rounded-lg text-xs font-medium transition-colors
        px-3 py-2 gap-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer
        ${!isOpen ? 'lg:px-0 lg:py-2 lg:justify-center' : ''}
      `}
      title="Sign In / Register"
    >
      <LogIn className="w-4 h-4 shrink-0 text-neutral-400" />
      <span className={`truncate text-left ${!isOpen ? 'lg:hidden' : ''}`}>
        Sign In / Register
      </span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/library', label: 'Library', icon: Film },
    { href: '/workflows', label: 'Workflows', icon: Workflow },
    { href: '/integrations', label: 'Integrations', icon: Share2 },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="hyper-agent-sidebar"
        className={`
          fixed lg:static top-0 lg:top-auto bottom-0 left-0 z-50 lg:z-30
          bg-[#0a0a0c] border-r border-neutral-800
          flex flex-col justify-between
          transition-all duration-200 ease-in-out select-none
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          ${isOpen ? 'lg:translate-x-0 lg:w-56' : 'lg:translate-x-0 lg:w-16'}
        `}
      >
        <div className="flex flex-col flex-1">
          {/* Mobile-only Header with brand and close button */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-800 lg:hidden shrink-0">
            <span className="font-semibold text-sm tracking-tight text-white">
              Hyper Agent
            </span>
            <button
              id="btn-close-mobile-sidebar"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none"
              title="Close navigation"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="p-2.5 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  id={`sidebar-nav-${item.label.toLowerCase()}`}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`
                    w-full flex items-center rounded-lg text-xs font-medium transition-colors
                    px-3 py-2.5 gap-3
                    ${!isOpen ? 'lg:px-0 lg:py-2.5 lg:justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }
                  `}
                  title={item.label}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-400'
                    }`}
                  />
                  <span className={`truncate text-left flex-1 ${!isOpen ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Auth / Account Footer */}
        <div className="p-2.5 border-t border-neutral-800/80">
          <SidebarAuthItem isOpen={isOpen} onCloseMobile={onCloseMobile} />
        </div>
      </aside>
    </>
  );
};
