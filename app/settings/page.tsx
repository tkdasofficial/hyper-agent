'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Shield, Crown, Sliders, Bell, Sparkles, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase';

export default function SettingsPage() {
  const { user, openAuthModal, signOut } = useAuth();
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [notifications, setNotifications] = useState(true);
  const [autoCaptions, setAutoCaptions] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState<{ plan_tier: string; credits: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      setLoadingProfile(true);
      try {
        const supabase = getSupabaseClient();
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_tier, credits')
          .eq('id', user.id)
          .single();

        if (profile) {
          setProfileData(profile);
        }

        const { data: settings } = await supabase
          .from('user_settings')
          .select('aspect_ratio, email_notifications, auto_captions')
          .eq('user_id', user.id)
          .single();

        if (settings) {
          setAspectRatio(settings.aspect_ratio || '9:16');
          setNotifications(settings.email_notifications ?? true);
          setAutoCaptions(settings.auto_captions ?? true);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          aspect_ratio: aspectRatio,
          email_notifications: notifications,
          auto_captions: autoCaptions,
        });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-neutral-200 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
          <User className="w-10 h-10 text-neutral-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Sign In Required</h2>
          <p className="text-xs text-neutral-400">
            Please sign in to access and customize your account preferences.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="w-full py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  const initials = (user.email || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage your profile, video rendering preferences, and subscription tier.
            </p>
          </div>
          <Link
            href="/upgrade"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition-colors shadow-xs"
          >
            <Crown className="w-3.5 h-3.5 fill-black" />
            <span>Upgrade Plan</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-base">
              {initials}
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{user.email}</div>
              <div className="text-xs text-neutral-400 font-mono mt-0.5 flex items-center gap-2">
                <span>UID: {user.id.slice(0, 8)}...</span>
                <span className="text-emerald-400 font-sans">• Connected</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-neutral-400 block">Current Plan</span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                {profileData?.plan_tier || 'Free'} Plan
              </span>
            </div>
            <div className="text-right pl-3 border-l border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Credits</span>
              <span className="text-xs font-bold text-white">
                {profileData?.credits ?? 10} Left
              </span>
            </div>
          </div>
        </div>

        {/* Render Preferences Form */}
        <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
            <Sliders className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold text-white">Video Generation Defaults</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-white block">Default Aspect Ratio</label>
                <span className="text-neutral-400 text-[11px]">
                  Aspect ratio applied to new AI video prompts by default.
                </span>
              </div>
              <div className="flex gap-2">
                {['9:16', '16:9', '1:1'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`
                      px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer
                      ${
                        aspectRatio === ratio
                          ? 'bg-white text-black font-semibold'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800/60 pt-4">
              <div>
                <label className="font-medium text-white block">Auto-Generate Captions</label>
                <span className="text-neutral-400 text-[11px]">
                  Automatically synchronize animated subtitles on generated reels.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoCaptions}
                onChange={(e) => setAutoCaptions(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white accent-white cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800/60 pt-4">
              <div>
                <label className="font-medium text-white block">Email Notifications</label>
                <span className="text-neutral-400 text-[11px]">
                  Receive notification alerts when long GPU renders complete.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>Settings saved!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Legal & Account Actions */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="space-x-4">
            <Link href="/privacy" className="hover:text-white underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white underline">
              Terms of Service
            </Link>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-medium"
          >
            Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
}
