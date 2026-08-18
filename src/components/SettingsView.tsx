import React, { useRef, useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { CURRENCIES } from '../data/subscriptionsData';
import {
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Shield,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  BellRing,
  CheckCircle2,
  Globe,
  User,
  Mail,
  Lock,
  Edit3,
  Building,
  Phone
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    viewMode,
    setViewMode,
    exportCSV,
    exportJSON,
    importSubscriptions,
    resetToSampleData,
    exchangeRates,
    ratesLastUpdated,
    isRatesLoading,
    refreshExchangeRates,
    notificationPermission,
    requestNotifications,
    sendTestNotification,
    currentUser,
    setIsProfileModalOpen,
  } = useSubscriptions();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = React.useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = importSubscriptions(parsed);
        if (success) {
          setImportStatus('Successfully imported subscriptions!');
        } else {
          setImportStatus('Invalid JSON format. Please check backup file.');
        }
      } catch (err) {
        setImportStatus('Failed to read file.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleTestAlert = () => {
    const success = sendTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  return (
    <div id="settings-container" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Preferences & Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Customize your profile, email, password, default currency, live exchange rates, and financial reports.
        </p>
      </div>

      {/* Profile & Account Customization Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover ring-3 ring-blue-500/20 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center ring-3 ring-blue-500/20">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  {currentUser?.name || 'Account User'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                  {currentUser?.role || 'Owner'}
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                <Mail size={12} className="text-neutral-400" />
                <span>{currentUser?.email}</span>
              </div>
              {(currentUser?.title || currentUser?.department) && (
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-1">
                  {currentUser.title && <span>{currentUser.title}</span>}
                  {currentUser.title && currentUser.department && <span>•</span>}
                  {currentUser.department && <span>{currentUser.department}</span>}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Customize Profile</span>
          </button>
        </div>

        {/* Profile Quick Stats Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Mail size={11} /> Primary Email
            </div>
            <div className="font-semibold text-neutral-900 dark:text-white mt-1 truncate">
              {currentUser?.email}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              ✓ Verified & Active
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Lock size={11} /> Security Level
            </div>
            <div className="font-semibold text-neutral-900 dark:text-white mt-1">
              SHA-256 Encrypted
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Changeable anytime
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Building size={11} /> Multi-Tenant Scope
            </div>
            <div className="font-semibold text-neutral-900 dark:text-white mt-1">
              SQL & PHP Isolation
            </div>
            <div className="text-[10px] text-neutral-500 font-medium mt-0.5">
              Dedicated User Tables
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency & Appearance */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
            <Shield size={18} className="text-blue-500" />
            General Preferences
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Default Primary Currency
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Dark Mode
              </div>
              <div className="text-[11px] text-neutral-500">
                High-contrast dark theme for low light
              </div>
            </div>
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Display Mode
              </div>
              <div className="text-[11px] text-neutral-500">
                Switch layout between Responsive, Web, and Android mockup
              </div>
            </div>
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('responsive')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'responsive' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setViewMode('web')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'web' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Web
              </button>
              <button
                onClick={() => setViewMode('android')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'android' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Android
              </button>
            </div>
          </div>
        </div>

        {/* 24-Hour Browser Push Notifications System */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <BellRing size={18} className="text-amber-500" />
              24-Hour Push Alerts
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {notificationPermission === 'granted' ? 'Active' : notificationPermission === 'denied' ? 'Blocked' : 'Action Required'}
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Automatically sends a browser notification exactly 24 hours prior to the next renewal date for all active, trial, or paused subscriptions.
          </p>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  Browser Permission
                </div>
                <div className="text-[11px] text-neutral-500">
                  Status: {notificationPermission}
                </div>
              </div>

              {notificationPermission !== 'granted' ? (
                <button
                  onClick={() => requestNotifications()}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Enable Push Alerts
                </button>
              ) : (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 size={14} /> Enabled
                </div>
              )}
            </div>

            {notificationPermission === 'granted' && (
              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  Test notification delivery:
                </span>
                <button
                  onClick={handleTestAlert}
                  className="px-3 py-1 bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  {testSent ? '✓ Notification Dispatched' : 'Send Test Alert'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Exchange Rates Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-500" />
              Live Exchange Rate Service
            </h3>
            <button
              onClick={() => refreshExchangeRates()}
              disabled={isRatesLoading}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1 text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              <RefreshCw size={12} className={isRatesLoading ? 'animate-spin text-blue-600' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time conversion feeds against Bangladeshi Taka (BDT) updated at {ratesLastUpdated}.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">1 USD</span>
              <span className="font-bold text-neutral-900 dark:text-white">{Math.round(1 / (exchangeRates['USD'] || 0.0083))} ৳ BDT</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">1 EUR</span>
              <span className="font-bold text-neutral-900 dark:text-white">{Math.round(1 / (exchangeRates['EUR'] || 0.0077))} ৳ BDT</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">1 GBP</span>
              <span className="font-bold text-neutral-900 dark:text-white">{Math.round(1 / (exchangeRates['GBP'] || 0.0066))} ৳ BDT</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">100 ৳ BDT</span>
              <span className="font-bold text-neutral-900 dark:text-white">{((exchangeRates['INR'] || 0.72) * 100).toFixed(0)} ₹ INR</span>
            </div>
          </div>
        </div>

        {/* Data Export & Backup Tools */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
            <Download size={18} className="text-emerald-500" />
            Export & Financial Reports
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Export structured financial records with calculated normalized monthly & annual costs for Excel, Google Sheets, or budgeting software.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={exportCSV}
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-emerald-600">
                  Download CSV
                </div>
                <div className="text-[11px] text-neutral-400">
                  For Excel / Sheets
                </div>
              </div>
            </button>

            <button
              onClick={exportJSON}
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileCode size={18} />
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600">
                  Backup JSON
                </div>
                <div className="text-[11px] text-neutral-400">
                  Full data snapshot
                </div>
              </div>
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={14} />
              Restore from JSON Backup
            </button>

            {importStatus && (
              <div className="mt-2 text-xs font-semibold text-center text-blue-600 dark:text-blue-400">
                {importStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset to Demo Data */}
      <div className="bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={15} className="text-neutral-500" />
            Reset to Sample Dataset
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Restores popular sample subscriptions (Netflix, ChatGPT, Spotify, Chorki, Google One, etc.) with custom icons & upcoming renewal alerts.
          </p>
        </div>

        <button
          onClick={resetToSampleData}
          className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Developer Information Card */}
      <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-900 rounded-3xl p-6 border border-blue-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              SK
            </div>
            <span>Developer & System Information</span>
          </h3>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
            Lead Architect
          </span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Sub Manager is crafted with a high-performance PHP & SQL backend architecture, multi-tenant isolation, real-time daily cost normalization, and strict data security.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Developer Name */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Developer
            </div>
            <div className="font-bold text-sm text-neutral-900 dark:text-white">
              Sazzad Kabir
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Software Engineer
            </div>
          </div>

          {/* Email */}
          <a
            href="mailto:sazzadmbstu@gmail.com"
            className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-0.5 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group block"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Email
            </div>
            <div className="font-bold text-xs text-neutral-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
              sazzadmbstu@gmail.com
            </div>
            <div className="text-[11px] text-neutral-500">
              Click to send email
            </div>
          </a>

          {/* WhatsApp Direct Link */}
          <a
            href="https://wa.me/8801810076761"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-0.5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group block"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>WhatsApp</span>
              <span className="text-[10px]">↗</span>
            </div>
            <div className="font-bold text-xs text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              wa.me/8801810076761
            </div>
            <div className="text-[11px] text-neutral-500">
              +880 1810-076761
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
