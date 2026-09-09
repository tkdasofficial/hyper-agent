import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, CheckCircle2, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Hyper Agent',
  description: 'Public Terms of Service for Hyper Agent autonomous AI video generation platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation back */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-neutral-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Legal Agreement • Publicly Accessible</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400">
            Last Updated: September 9, 2026 • Effective Immediately
          </p>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-300 leading-relaxed">
            By creating an account, accessing, or utilizing the Hyper Agent application and API services,
            you agree to be legally bound by these Terms of Service and our Privacy Policy.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Service Description</h2>
            <p>
              Hyper Agent provides autonomous AI-driven short-form video generation, prompt-to-video
              orchestration, script generation, and media storage pipelines. Features may be updated,
              enhanced, or modified periodically to optimize performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. User Accounts & Registration</h2>
            <p>
              To access generation features, you must register an account using either email and
              password or a verified Google OAuth account. You are solely responsible for safeguarding
              your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Intellectual Property & Commercial Rights</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Your Content & Outputs:</strong> Subject to your
                compliance with these terms, you retain full ownership and commercial rights in the
                video outputs and scripts generated through your account on paid tiers (Pro &
                Enterprise). Free tier outputs are granted under a personal, non-commercial attribution
                license.
              </li>
              <li>
                <strong className="text-neutral-200">Platform Technology:</strong> The Hyper Agent
                interface, autonomous orchestration code, UI design, and branding remain the
                exclusive intellectual property of Hyper Agent and its licensors.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Acceptable Use Policy</h2>
            <p>You agree not to use Hyper Agent to generate, host, or disseminate:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Defamatory, obscene, harassing, or sexually explicit content.</li>
              <li>Deceptive deepfakes or impersonation of individuals without lawful consent.</li>
              <li>Content that infringes third-party copyrights, trademarks, or proprietary rights.</li>
              <li>Malicious software, automated scraping loops, or denial-of-service traffic.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">5. Subscriptions, Credits & Billing</h2>
            <p>
              Subscription fees for paid plans (such as Pro Creator) are billed in advance on a recurring
              monthly or annual basis. Unused rendering credits do not roll over beyond their designated
              billing cycle. You may cancel your subscription at any time; cancellation takes effect at
              the end of your current billing period.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">6. Limitation of Liability & Warranty Disclaimer</h2>
            <p>
              The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Hyper
              Agent does not warrant that AI generations will be entirely error-free or uninterrupted.
              To the maximum extent permitted by applicable law, Hyper Agent shall not be liable for
              indirect, incidental, consequential, or punitive damages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">7. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Delaware,
              without regard to conflict of law principles. Any dispute arising under these terms shall
              be resolved through binding confidential arbitration.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Hyper Agent Autonomous AI © 2026</span>
          <div className="space-x-4">
            <Link href="/privacy" className="hover:text-white underline">
              Privacy Policy
            </Link>
            <Link href="/upgrade" className="hover:text-white underline">
              Upgrade Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
