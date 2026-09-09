'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password reset link has been dispatched to your email address.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div
        id="forgot-password-card"
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-xs text-neutral-400">
            Enter your email and we&apos;ll send you recovery instructions.
          </p>
        </div>

        {errorMessage && (
          <div
            id="forgot-error-alert"
            className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            id="forgot-success-alert"
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        <form id="form-forgot-page" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="forgot-page-email" className="text-xs text-neutral-300 font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="forgot-page-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            id="btn-forgot-page-submit"
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-1 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>Send Recovery Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400">
          Remembered your credentials?{' '}
          <Link href="/login" className="text-white font-medium hover:underline">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
