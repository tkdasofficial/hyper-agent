import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Hyper Agent',
  description: 'Privacy Policy for Hyper Agent autonomous video generation platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-850 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Last updated: September 2026
          </p>
        </div>

        {/* Concise Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-300">
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">1. Information We Collect</h2>
            <p className="text-neutral-400">
              We collect your account email and basic profile details when you sign up. When you create videos, we process the prompts, text, and parameters you provide to render the output.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">2. How We Use Your Data</h2>
            <p className="text-neutral-400">
              Your information is strictly used to authenticate your session, execute video generation, and manage your saved renders. We do not sell your personal data or use your private creations to train public models.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">3. Security & Infrastructure</h2>
            <p className="text-neutral-400">
              All communications are encrypted using standard TLS protocols. Media files and database records are protected by strict row-level security and access controls.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">4. Data Retention & Deletion</h2>
            <p className="text-neutral-400">
              You can delete generated videos directly from your Library at any time. To request full account deletion and associated data removal, email support.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">5. Contact</h2>
            <p className="text-neutral-400">
              For any privacy questions or requests, contact us at{' '}
              <a href="mailto:privacy@hyperagent.ai" className="text-white hover:underline">
                privacy@hyperagent.ai
              </a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-neutral-500">
          <span>Hyper Agent © 2026</span>
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-neutral-300 transition-colors underline">
              Terms of Service
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
