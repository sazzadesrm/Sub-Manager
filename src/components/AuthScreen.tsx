import React, { useState, useMemo } from 'react';
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
  EyeOff,
  Check,
  X,
  ExternalLink,
  Shield
} from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'verify_email' | 'forgot' | 'reset';

export const AuthScreen: React.FC = () => {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    verifyEmail,
    forgotPassword,
    resetPassword,
  } = useSubscriptions();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification state
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [simulatedToken, setSimulatedToken] = useState('');

  // Google Sign-In modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Password strength computation for Sign Up
  const passwordStrength = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    let score = 0;
    if (password.length >= 6) score += 1;
    if (hasMinLength) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;

    let label = 'Very Weak';
    let color = 'bg-rose-500 text-rose-500';
    let width = 'w-1/5';

    if (score === 2) {
      label = 'Weak';
      color = 'bg-amber-500 text-amber-500';
      width = 'w-2/5';
    } else if (score === 3 || score === 4) {
      label = 'Good';
      color = 'bg-blue-500 text-blue-500';
      width = 'w-4/5';
    } else if (score === 5) {
      label = 'Strong';
      color = 'bg-emerald-500 text-emerald-500';
      width = 'w-full';
    }

    return {
      score,
      label,
      color,
      width,
      hasMinLength,
      hasUpperAndLower: hasUpper && hasLower,
      hasNumber,
      hasSymbol,
    };
  }, [password]);

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
      if (err.message === 'EMAIL_UNVERIFIED') {
        setPendingVerificationEmail(email.trim());
        setMode('verify_email');
        setErrorMessage('Please verify your email address to access your subscription workspace.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in. Please check your credentials.');
      }
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
      const res = await signUp(name.trim(), email.trim(), password);
      setPendingVerificationEmail(email.trim());
      setSimulatedToken(res.verificationToken);
      setVerificationCodeInput(res.verificationCode);
      setSuccessMessage('Account created! A verification link has been sent to your email inbox.');
      setMode('verify_email');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account may already exist with this email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (codeOrTokenToVerify?: string) => {
    clearMessages();
    const tokenToUse = codeOrTokenToVerify || verificationCodeInput.trim() || simulatedToken || 'VERIFY_NOW';

    setIsLoading(true);
    try {
      await verifyEmail(pendingVerificationEmail, tokenToUse);
      setSuccessMessage('Email verified successfully! Loading your workspace...');
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code or request a new link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (googleUser: { name: string; email: string; avatar?: string }) => {
    clearMessages();
    setIsLoading(true);
    setIsGoogleModalOpen(false);
    try {
      await signInWithGoogle(googleUser);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
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
      setResetCode(res.code);
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
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setPassword(newPassword);
      setMode('signin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. Code may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 select-none">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <SubManagerLogo size={60} showText={false} className="mb-2.5" />
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
            {mode === 'signin' && 'Sign in to access your secure subscription management workspace'}
            {mode === 'signup' && 'Create your account with isolated SQL storage and fresh workspace'}
            {mode === 'verify_email' && 'Verify your email address to unlock full subscription features'}
            {mode === 'forgot' && 'Reset your password to regain secure account access'}
            {mode === 'reset' && 'Enter your verification code and set a new password'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xl p-6 sm:p-8 backdrop-blur-sm relative">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 leading-relaxed animate-in fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <div className="space-y-4">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-2.5 px-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
                <span className="bg-white dark:bg-neutral-900 px-3 text-[11px] font-semibold text-neutral-400 uppercase">
                  or sign in with email
                </span>
              </div>

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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* MODE: SIGN UP WITH REAL-TIME PASSWORD STRENGTH INDICATOR */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sazzad Kabir"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  {password && (
                    <span className={`text-[11px] font-bold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Progress Bar & Live Checklist */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score <= 1
                            ? 'bg-rose-500'
                            : passwordStrength.score === 2
                            ? 'bg-amber-500'
                            : passwordStrength.score <= 4
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 pt-0.5">
                      <div className="flex items-center gap-1">
                        {passwordStrength.hasMinLength ? (
                          <Check size={11} className="text-emerald-500 font-bold" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 inline-block" />
                        )}
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordStrength.hasUpperAndLower ? (
                          <Check size={11} className="text-emerald-500 font-bold" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 inline-block" />
                        )}
                        <span>Upper & lowercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordStrength.hasNumber ? (
                          <Check size={11} className="text-emerald-500 font-bold" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 inline-block" />
                        )}
                        <span>At least 1 number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordStrength.hasSymbol ? (
                          <Check size={11} className="text-emerald-500 font-bold" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 inline-block" />
                        )}
                        <span>Symbol (!@#$%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Mail size={13} className="shrink-0" />
                <span>An email verification link will be sent to confirm your inbox.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Sending verification...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Verify</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: MANDATORY EMAIL VERIFICATION FLOW */}
          {mode === 'verify_email' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
                <Mail size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Verify your email address
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  We sent a confirmation link & 6-digit code to{' '}
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {pendingVerificationEmail || email}
                  </span>
                </p>
              </div>

              {/* Click-to-Verify Link (Instant Simulation of opening email inbox link) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-800 text-left space-y-2">
                <div className="text-[11px] font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-blue-600" />
                  <span>Simulated Inbox Email Link:</span>
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300">
                  Click below to activate your account exactly as if you clicked the verification link in your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => handleVerifyEmail('VERIFY_NOW')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Click Link to Verify & Open Dashboard</span>
                </button>
              </div>

              {/* Or manual 6-digit code entry */}
              <div className="space-y-2 pt-1 text-left">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Or enter 6-digit confirmation code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={verificationCodeInput}
                    onChange={e => setVerificationCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyEmail()}
                    disabled={isLoading || !verificationCodeInput}
                    className="px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 text-white dark:text-neutral-900 rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signin');
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          {mode !== 'verify_email' && (
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
              {mode === 'signin' ? (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode('signup');
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Google Account Picker Modal */}
        {isGoogleModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Sign in with Google
                  </h3>
                </div>
                <button
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Choose an account to continue to Sub Manager
              </p>

              {/* Fast Option: Sazzad Kabir */}
              <button
                onClick={() =>
                  handleGoogleSignIn({
                    name: 'Sazzad Kabir',
                    email: 'sazzadmbstu@gmail.com',
                    avatar:
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
                  })
                }
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all flex items-center gap-3 text-left group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                  alt="Sazzad Kabir"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-neutral-900 dark:text-white truncate group-hover:text-blue-600">
                    Sazzad Kabir
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    sazzadmbstu@gmail.com
                  </div>
                </div>
                <Shield size={14} className="text-blue-600 shrink-0" />
              </button>

              {/* Custom Google Account input */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-500">
                  Or use another Google account:
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customGoogleName}
                  onChange={e => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="google.account@gmail.com"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.trim()}
                  onClick={() =>
                    handleGoogleSignIn({
                      name: customGoogleName.trim() || 'Google User',
                      email: customGoogleEmail.trim(),
                    })
                  }
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Continue with this Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-[11px] text-neutral-400 dark:text-neutral-500">
          Sub Manager • PHP / SQL Storage Schema • SHA-256 Multi-Tenant Isolation
        </div>
      </div>
    </div>
  );
};
