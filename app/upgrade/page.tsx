'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function UpgradePage() {
  const { user, openAuthModal } = useAuth();

  const handleAction = (plan: string) => {
    if (!user) {
      openAuthModal('signup');
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.assign(
        `mailto:support@hyperagent.ai?subject=Upgrade%20to%20${encodeURIComponent(
          plan
        )}%20Plan&body=Account:%20${encodeURIComponent(user.email || '')}`
      );
    }
  };

  const tiers = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      period: 'mo',
      description: 'Essential features for testing and light generation.',
      features: [
        '10 video render credits',
        'Standard 720p rendering speed',
        'Basic video templates',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'mo',
      badge: 'Most Popular',
      description: 'For creators requiring high throughput and speed.',
      features: [
        'Unlimited 1080p & 4K renders',
        'Priority GPU processing queue',
        'Full commercial usage rights',
        'Custom voice cloning & sync',
        'Dedicated priority support',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: 'mo',
      description: 'For teams and automated high-volume pipelines.',
      features: [
        'Everything in Pro tier',
        'Dedicated rendering infrastructure',
        'Custom webhooks & API access',
        'Multi-seat team workspace',
        'Custom branding & SLA guarantee',
      ],
      cta: 'Contact Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Plans & Pricing
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Choose the plan that fits your production workflow. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              id={`pricing-card-${tier.id}`}
              className={`
                relative rounded-2xl border flex flex-col justify-between p-6 transition-colors
                ${
                  tier.popular
                    ? 'bg-neutral-900/80 border-amber-500/40 shadow-xl'
                    : 'bg-neutral-950/60 border-neutral-850 hover:border-neutral-800'
                }
              `}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3 fill-neutral-950" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-white">{tier.name}</h2>
                  <p className="text-xs text-neutral-400 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1 border-b border-neutral-800/80 pb-4">
                  <span className="text-3xl font-bold text-white tracking-tight">{tier.price}</span>
                  <span className="text-xs text-neutral-400">/{tier.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  id={`btn-plan-select-${tier.id}`}
                  onClick={() => handleAction(tier.name)}
                  className={`
                    w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs
                    ${
                      tier.popular
                        ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold'
                        : 'bg-white hover:bg-neutral-200 text-neutral-950'
                    }
                  `}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Footer Links */}
        <div className="text-center pt-6 text-xs text-neutral-500 space-x-3">
          <Link href="/privacy" className="hover:text-neutral-300 transition-colors underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-neutral-300 transition-colors underline">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
