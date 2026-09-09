'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Google sign in failed.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password.');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center flex flex-col gap-4">
          <h2 className="text-base font-semibold text-white">Already Signed In</h2>
          <p className="text-xs text-neutral-400">
            You are signed in as <span className="text-white font-mono">{user.email}</span>.
          </p>
          <Link
            href="/"
            className="w-full h-10 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div
        id="login-card"
        className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-4 text-white"
      >
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white">Sign in</h1>
        </div>

        {errorMessage && (
          <div
            id="login-error-alert"
            className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Google Authentication */}
        <button
          id="btn-login-google"
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 text-neutral-200 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative my-0.5 flex items-center justify-center">
          <div className="w-full border-t border-neutral-800/80" />
          <span className="bg-neutral-950 px-2.5 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            or
          </span>
        </div>

        <form id="form-login-page" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-page-email" className="text-xs text-neutral-300 font-medium">
              Email
            </label>
            <input
              id="login-page-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-page-password" className="text-xs text-neutral-300 font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="login-page-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <button
            id="btn-login-page-submit"
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-1 rounded-lg bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-1">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white font-medium hover:underline">
            Sign up
          </Link>
        </div>

        <div className="text-center text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-neutral-400 hover:text-white underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-neutral-400 hover:text-white underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
