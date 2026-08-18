import React, { useState } from 'react';
import { SubManagerLogo } from './SubManagerLogo';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, forgotPassword, resetPassword, darkMode } = useSubscriptions();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and retype.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      // Automatically logs in with fresh empty dataset
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account may already exist with this email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMessage(res.message);
      setResetCode(res.code); // Pre-fill verification code for smooth UX
      setMode('reset');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!resetCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim(), resetCode.trim(), newPassword);
      setSuccessMessage('Password reset successfully! You can now sign in with your new password.');
      setPassword(newPassword);
      setMode('signin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The code may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123');
    clearMessages();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full max-w-md">
        {/* Logo and Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <SubManagerLogo size={64} showText={false} className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
            {mode === 'signin' && 'Sign in to access your isolated subscription workspace'}
            {mode === 'signup' && 'Create your account to start fresh with personal tracking'}
            {mode === 'forgot' && 'Reset your password to regain secure account access'}
            {mode === 'reset' && 'Enter your verification code and choose a new password'}
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 leading-relaxed animate-in fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode('forgot');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Demo Account Quick Access */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <p className="text-[11px] text-neutral-400 mb-2 font-medium">Quick Demo Accounts:</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('sazzadmbstu@gmail.com')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[11px] font-semibold transition-colors"
                  >
                    sazzadmbstu@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('john@sublytics.io')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[11px] font-semibold transition-colors"
                  >
                    john@sublytics.io
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: SIGN UP (ALWAYS STARTS FRESH) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sazzad Hossain"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Sparkles size={14} className="shrink-0" />
                <span>New accounts start completely fresh with zero inherited data.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Fresh Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <KeyRound size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <CheckCircle2 size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signup');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign Up Fresh
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signin');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-[11px] text-neutral-400 dark:text-neutral-500">
          Sub Manager • Multi-User Isolated Storage • TLS / SHA-256 Session Encrypted
        </div>
      </div>
    </div>
  );
};
