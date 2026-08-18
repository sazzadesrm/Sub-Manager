import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  X,
  User,
  Mail,
  Lock,
  Camera,
  Check,
  AlertCircle,
  Building,
  Phone,
  Briefcase,
  FileText,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=faces',
  'https://api.dicebear.com/7.x/bottts/svg?seed=submanager_dev&backgroundColor=6366f1',
  'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=3b82f6',
];

export const ProfileCustomizationModal: React.FC = () => {
  const {
    currentUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    updateUserProfile,
    changeUserEmail,
    changeUserPassword,
  } = useSubscriptions();

  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'password'>('general');

  // General Profile State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Email State
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Populate data when modal opens
  useEffect(() => {
    if (currentUser && isProfileModalOpen) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setTitle(currentUser.title || '');
      setDepartment(currentUser.department || 'Finance & Subscriptions');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
      setEmail(currentUser.email || '');
      setNewEmail(currentUser.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [currentUser, isProfileModalOpen]);

  if (!isProfileModalOpen || !currentUser) return null;

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passScore = getPasswordStrength(newPassword);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await updateUserProfile({
        name,
        avatar,
        title,
        department,
        phone,
        bio,
      });
      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (newEmail.trim().toLowerCase() === currentUser.email.toLowerCase()) {
      setErrorMsg('This is already your current email address.');
      return;
    }
    setLoading(true);
    try {
      await changeUserEmail(newEmail);
      setEmail(newEmail);
      setSuccessMsg('Email address changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        id="profile-customization-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Account & Profile Settings
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Customize your profile picture, personal info, email and password
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-5 pt-3 gap-2 bg-neutral-50/30 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => {
              setActiveTab('general');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <User size={14} />
            Basic Info & Picture
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Mail size={14} />
            Email Address
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Lock size={14} />
            Change Password
          </button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-5 pt-4">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
              >
                <Check size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab 1: General Profile Customization & Picture */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
            {/* Avatar Section */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800">
              <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Camera size={14} className="text-blue-500" />
                Profile Picture Customization
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover ring-3 ring-blue-500/30 shadow-xs"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=6366f1`;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center ring-3 ring-blue-500/30">
                      {name.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (Unsplash, DiceBear, Gravatar, Imgur)..."
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />

                  {/* Preset Avatar Selection */}
                  <div>
                    <div className="text-[11px] text-neutral-400 mb-1.5 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-500" /> Quick Avatar Presets:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            avatar === preset ? 'border-blue-600 scale-110 shadow-xs' : 'border-transparent hover:scale-105'
                          }`}
                        >
                          <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name & Job Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-neutral-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-neutral-400" />
                  Job Title / Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Software Architect / Finance Director"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Department & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Building size={13} className="text-neutral-400" />
                  Department / Team
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering & IT, Finance"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-neutral-400" />
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="e.g. +8801810076761"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <FileText size={13} className="text-neutral-400" />
                Short Bio / Description
              </label>
              <textarea
                rows={2}
                placeholder="A brief overview of your account purpose or team role..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Email Change */}
        {activeTab === 'email' && (
          <form onSubmit={handleSaveEmail} className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
              <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" />
                Current Account Email
              </div>
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentUser.email}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Changing your email address will update your sign-in identifier and notification target.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-neutral-400" />
                New Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update Email Address'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Password Change */}
        {activeTab === 'password' && (
          <form onSubmit={handleSavePassword} className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Lock size={13} className="text-neutral-400" />
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(prev => !prev)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Lock size={13} className="text-neutral-400" />
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(prev => !prev)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(step => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          passScore >= step
                            ? passScore <= 2
                              ? 'bg-rose-500'
                              : passScore <= 3
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-neutral-500 flex justify-between">
                    <span>
                      {passScore <= 2
                        ? 'Weak password'
                        : passScore <= 3
                        ? 'Moderate strength'
                        : 'Strong & secure password'}
                    </span>
                    <span>{newPassword.length} chars</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Check size={13} className="text-neutral-400" />
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
