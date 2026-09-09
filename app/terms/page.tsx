import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Hyper Agent',
  description: 'Terms of Service for Hyper Agent autonomous video generation platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-850 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Last updated: September 2026
          </p>
        </div>

        {/* Concise Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-300">
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-neutral-400">
              By accessing or using Hyper Agent, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">2. User Accounts</h2>
            <p className="text-neutral-400">
              You are responsible for maintaining the confidentiality of your account credentials and for all actions taken under your account.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">3. Content Ownership & Commercial Rights</h2>
            <p className="text-neutral-400">
              You retain full ownership and commercial rights to videos generated on paid subscriptions. Generations created under free tiers are intended for personal, non-commercial evaluation.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">4. Acceptable Use</h2>
            <p className="text-neutral-400">
              You agree not to use the service to generate illegal, defamatory, harassing, or copyright-infringing content, or to disrupt or overload platform infrastructure.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">5. Subscriptions & Billing</h2>
            <p className="text-neutral-400">
              Paid plans renew automatically on a recurring monthly or annual basis unless cancelled. You may cancel your subscription at any time.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">6. Service Availability & Disclaimer</h2>
            <p className="text-neutral-400">
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We reserve the right to modify or discontinue features to improve performance.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">7. Contact</h2>
            <p className="text-neutral-400">
              For questions regarding these Terms of Service, email{' '}
              <a href="mailto:support@hyperagent.ai" className="text-white hover:underline">
                support@hyperagent.ai
              </a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-neutral-500">
          <span>Hyper Agent © 2026</span>
          <div className="space-x-4">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors underline">
              Privacy Policy
            </Link>
            <Link href="/upgrade" className="hover:text-neutral-300 transition-colors underline">
              Plans & Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
