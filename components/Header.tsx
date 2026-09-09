'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  Crown,
  User,
  LogIn,
  Settings,
  Shield,
  FileText,
  LogOut,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenUpgrade: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onOpenUpgrade,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openAuthModal, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSubpage = pathname !== '/';

  const hideHamburger =
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/upgrade') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password');

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropdownOpen]);

  const getPageTitle = () => {
    if (pathname === '/') return 'Hyper Agent';
    if (pathname.startsWith('/library')) return 'Library';
    if (pathname.startsWith('/workflows')) return 'Workflows';
    if (pathname.startsWith('/integrations')) return 'Integrations';
    if (pathname.startsWith('/upgrade')) return 'Plans & Pricing';
    if (pathname.startsWith('/privacy')) return 'Privacy Policy';
    if (pathname.startsWith('/terms')) return 'Terms of Service';
    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/login')) return 'Sign In';
    if (pathname.startsWith('/signup')) return 'Create Account';
    if (pathname.startsWith('/forgot-password')) return 'Reset Password';

    const segment = pathname.split('/').filter(Boolean)[0];
    if (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    }
    return 'Hyper Agent';
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <header
      id="hyper-agent-header"
      className="h-14 border-b border-neutral-800 bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between transition-colors"
    >
      {/* Left section: Dynamic Back Button, Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isSubpage ? (
          <button
            id="btn-header-back"
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="p-1.5 -ml-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none cursor-pointer flex items-center gap-1.5 group"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium text-neutral-400 group-hover:text-white hidden sm:inline">
              Back
            </span>
          </button>
        ) : null}

        {!hideHamburger && (
          <button
            id="btn-hamburger-sidebar"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar navigation"
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none cursor-pointer"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="h-4 w-px bg-neutral-800" />

        <h1 id="header-page-title" className="font-semibold text-sm tracking-tight text-white select-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right section: Upgrade button & User auth button */}
      <div className="flex items-center gap-3">
        {/* Upgrade Plan button: Only King Crown Icon */}
        <button
          id="btn-header-upgrade"
          type="button"
          onClick={onOpenUpgrade}
          aria-label="Upgrade plan"
          title="Upgrade plan"
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 hover:bg-neutral-800/90 text-amber-400 hover:text-amber-300 transition-all focus:outline-none cursor-pointer flex items-center justify-center group shadow-xs"
        >
          <Crown className="w-4 h-4 fill-amber-400/20 group-hover:scale-110 transition-transform" />
        </button>

        {/* User Profile / Auth Action */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              id="user-profile-button"
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 text-xs transition-colors cursor-pointer focus:outline-none"
              title={`Account options for ${user.email}`}
            >
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-[11px] shrink-0">
                {getUserInitials()}
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-neutral-300 max-w-[110px] truncate">
                {user.email}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {/* Profile Options Dropdown (Only when user logged in) */}
            {profileDropdownOpen && (
              <div
                id="user-profile-dropdown"
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {/* User email info block */}
                <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
                  <div className="text-[11px] font-medium text-white truncate">
                    {user.email}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-0.5">
                    <span className="font-mono text-emerald-400">Authenticated</span>
                    <span className="text-amber-400 font-semibold">Free Tier</span>
                  </div>
                </div>

                {/* Settings */}
                <Link
                  id="menu-item-settings"
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Settings</span>
                </Link>

                {/* Upgrade Plan */}
                <button
                  id="menu-item-upgrade"
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenUpgrade();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-amber-300 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer text-left"
                  role="menuitem"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span>Upgrade Plan</span>
                </button>

                <div className="my-1 border-t border-neutral-800/80" />

                {/* Privacy Policy */}
                <Link
                  id="menu-item-privacy"
                  href="/privacy"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Privacy Policy</span>
                </Link>

                {/* Terms of Service */}
                <Link
                  id="menu-item-terms"
                  href="/terms"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Terms of Service</span>
                </Link>

                <div className="my-1 border-t border-neutral-800/80" />

                {/* Sign Out */}
                <button
                  id="menu-item-signout"
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-left"
                  role="menuitem"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            id="btn-header-signin"
            type="button"
            onClick={() => openAuthModal('login')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
