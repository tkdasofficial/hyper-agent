import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, Database, Eye, Globe } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Hyper Agent',
  description: 'Public Privacy Policy for Hyper Agent autonomous AI video generation platform.',
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Legal Document • Publicly Accessible</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400">
            Last Updated: September 9, 2026 • Effective Immediately
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white">Encryption In Transit</h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              All credentials, API keys, and assets are secured via TLS 1.3 and database-level RLS.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white">Data Minimization</h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              We collect strictly what is required to authenticate your account and render your videos.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
            <Eye className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold text-white">No Model Training on Private Data</h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Your video prompts, custom scripts, and generated media are not used to train public models.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
            <p>
              When you interact with Hyper Agent, we collect information directly from you and
              automatically through your use of our platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Account Credentials:</strong> Email address,
                display name, profile avatar, and encrypted authentication tokens provided via Supabase
                or third-party OAuth providers (e.g. Google).
              </li>
              <li>
                <strong className="text-neutral-200">Video Generation Inputs:</strong> Prompts, script
                definitions, aspect ratios, style parameters, and media assets you submit to the
                rendering pipeline.
              </li>
              <li>
                <strong className="text-neutral-200">Technical Logs & Usage:</strong> IP address,
                browser user-agent, error logs, and performance metrics necessary to diagnose rendering
                failures.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. How We Use Your Information</h2>
            <p>We process your data for specific, lawful operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>To execute video rendering requests via distributed Edge Functions and GPU pipelines.</li>
              <li>To store and deliver rendered MP4 media through Cloudflare R2 and Supabase Storage.</li>
              <li>To manage your subscription tier, billing status, and usage quotas.</li>
              <li>To authenticate your identity and protect against malicious abuse or unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Third-Party Infrastructure & Integrations</h2>
            <p>
              To provide autonomous agent capabilities, we partner with industry-leading infrastructure
              providers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Supabase:</strong> Cloud database, authentication,
                and session management.
              </li>
              <li>
                <strong className="text-neutral-200">Cloudflare:</strong> Edge compute and low-latency
                asset delivery.
              </li>
              <li>
                <strong className="text-neutral-200">Google OAuth:</strong> Identity verification when
                using Google Single Sign-On.
              </li>
              <li>
                <strong className="text-neutral-200">Media Generation APIs:</strong> Pixazo and AI
                voice providers strictly for synthesis per your explicit render triggers.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Data Retention & Deletion</h2>
            <p>
              You maintain total control over your creations. You can delete individual video renders
              at any time from your Library. Upon account closure or upon your written request, all
              associated profile records, database entries, and media storage objects will be
              permanently purged from our systems within 30 days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">5. Cookies & Local Storage</h2>
            <p>
              Hyper Agent utilizes standard browser Local Storage and session tokens exclusively to
              maintain your active login session and remember your layout preferences (such as canvas
              aspect ratio and dark theme). We do not deploy third-party advertising tracking cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">6. Contact Information</h2>
            <p>
              For privacy-related inquiries, data export requests, or to exercise your GDPR/CCPA
              rights, contact our privacy officer at{' '}
              <a href="mailto:privacy@hyperagent.ai" className="text-white underline">
                privacy@hyperagent.ai
              </a>.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Hyper Agent Autonomous AI © 2026</span>
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-white underline">
              Terms of Service
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
