'use client';

import React from 'react';
import Link from 'next/link';
import { X, Check, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user, openAuthModal } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!user) {
      onClose();
      openAuthModal('signup');
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.assign(
        `mailto:support@hyperagent.ai?subject=Upgrade%20to%20Pro%20Plan&body=Account:%20${encodeURIComponent(
          user.email || ''
        )}`
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        id="upgrade-modal-dialog"
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-upgrade-modal"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Clean Header */}
        <div className="flex flex-col items-center text-center gap-1.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-1">
            <Crown className="w-5 h-5 fill-amber-400/20" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Upgrade to Pro
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
            Unlimited 4K renders, sub-minute priority queue, and commercial rights.
          </p>
        </div>

        {/* Pro Plan Feature Card */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 mb-5 space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-3">
            <div>
              <div className="text-sm font-semibold text-white">Pro Creator</div>
              <div className="text-[11px] text-neutral-400">Everything you need to produce & publish</div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white tracking-tight">$29</span>
              <span className="text-xs text-neutral-400">/mo</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-neutral-300">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited 1080p & 4K video renders</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Priority GPU queue (sub-minute processing)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full commercial rights & zero watermark</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Custom voice cloning & ElevenLabs sync</span>
            </li>
          </ul>
        </div>

        {/* Action Button & Clean Subtext */}
        <div className="space-y-3">
          <button
            id="btn-modal-upgrade-submit"
            type="button"
            onClick={handleUpgrade}
            className="w-full h-10 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1 pt-1">
            <span>Cancel anytime • Instant activation</span>
            <Link
              id="link-view-all-plans"
              href="/upgrade"
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors underline"
            >
              Compare all plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

