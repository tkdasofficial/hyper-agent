'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Mail, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth, AuthModalView } from '@/lib/auth-context';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { getSupabaseClient } from '@/lib/supabase';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    signOut,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    resetMessages();
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

  if (!isAuthModalOpen) return null;

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchView = (view: AuthModalView) => {
    resetMessages();
    openAuthModal(view);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Invalid credentials. Please try again.');
      } else {
        closeAuthModal();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password) {
      setErrorMessage('Please provide an email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const { error, user: newUser } = await signUp(email, password);
      if (error) {
        setErrorMessage(error.message);
      } else {
        try {
          const supabase = getSupabaseClient();
          await supabase.from('terms_acceptances').insert({
            email: email.trim(),
            user_id: newUser?.id || null,
            accepted_terms: true,
            accepted_privacy: true,
            version: '1.0',
          });
        } catch (logErr) {
          console.error('Failed to log terms acceptance:', logErr);
        }

        setSuccessMessage(
          newUser?.identities?.length === 0
            ? 'An account with this email already exists. Try signing in.'
            : 'Account created! Check your email to confirm your registration or sign in.'
        );
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) {
      setErrorMessage('Please provide your account email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative flex flex-col gap-4 text-white"
      >
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LOGGED IN VIEW */}
        {user ? (
          <div id="auth-authenticated-card" className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-white">Account Profile</h2>
                <p className="text-xs text-neutral-400 truncate font-mono">{user.email}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>User ID</span>
                <span className="font-mono text-neutral-300 text-[11px] truncate max-w-[160px]">
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Status</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Authenticated
                </span>
              </div>
            </div>

            <button
              id="btn-auth-sign-out"
              type="button"
              onClick={async () => {
                await signOut();
                closeAuthModal();
              }}
              className="w-full h-10 rounded-lg bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* AUTH FORMS (LOGIN / SIGNUP / FORGOT PASSWORD) */
          <>
            {/* Header */}
            <div className="flex flex-col pr-6">
              <h2 id="auth-modal-title" className="text-lg font-bold tracking-tight text-white">
                {authModalView === 'login' && 'Sign in'}
                {authModalView === 'signup' && 'Create account'}
                {authModalView === 'forgot_password' && 'Reset password'}
              </h2>
              {authModalView === 'forgot_password' && (
                <p className="text-xs text-neutral-400 mt-1">
                  Enter your email to receive a password reset link.
                </p>
              )}
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div
                id="auth-error-alert"
                className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div
                id="auth-success-alert"
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authModalView === 'login' && (
              <div className="flex flex-col gap-3">
                {/* Google Sign In */}
                <button
                  id="btn-modal-login-google"
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

                <form id="form-auth-login" onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="auth-email-input" className="text-xs text-neutral-300 font-medium">
                      Email
                    </label>
                    <input
                      id="auth-email-input"
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
                      <label htmlFor="auth-password-input" className="text-xs text-neutral-300 font-medium">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSwitchView('forgot_password')}
                        className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      id="auth-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <button
                    id="btn-auth-submit-login"
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

                  <div className="text-center pt-1 text-xs text-neutral-400">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchView('signup')}
                      className="text-white font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SIGN UP FORM */}
            {authModalView === 'signup' && (
              <div className="flex flex-col gap-3">
                {/* Google Sign In */}
                <button
                  id="btn-modal-signup-google"
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

                <form id="form-auth-signup" onSubmit={handleSignUpSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-email-input" className="text-xs text-neutral-300 font-medium">
                      Email
                    </label>
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-password-input" className="text-xs text-neutral-300 font-medium">
                      Password
                    </label>
                    <input
                      id="signup-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  {/* Terms of Service & Privacy Policy Checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      id="modal-terms-checkbox"
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-900 accent-white cursor-pointer shrink-0"
                    />
                    <label
                      htmlFor="modal-terms-checkbox"
                      className="text-[11px] text-neutral-400 leading-tight cursor-pointer select-none"
                    >
                      I accept the{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        onClick={closeAuthModal}
                        className="text-neutral-300 hover:text-white underline font-medium"
                      >
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        onClick={closeAuthModal}
                        className="text-neutral-300 hover:text-white underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    id="btn-auth-submit-signup"
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 mt-1 rounded-lg bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 text-xs text-neutral-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchView('login')}
                      className="text-white font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authModalView === 'forgot_password' && (
              <form id="form-auth-forgot" onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="forgot-email-input" className="text-xs text-neutral-300 font-medium">
                    Email
                  </label>
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <button
                  id="btn-auth-submit-forgot"
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-1 rounded-lg bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1 text-xs text-neutral-400">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="text-white font-medium hover:underline"
                  >
                    Back to Sign in
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
