import React, { useRef } from 'react';
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
  Bell,
  CheckCircle2,
  AlertCircle
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
    subscriptions,
  } = useSubscriptions();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = React.useState<string | null>(null);

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

  return (
    <div id="settings-container" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Preferences & Data Management
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Customize currency, export financial statements for budgeting, and manage backup data.
        </p>
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
              Default Currency
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
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
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
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'responsive' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setViewMode('web')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'web' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Web
              </button>
              <button
                onClick={() => setViewMode('android')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'android' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Android
              </button>
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
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2.5 text-left group"
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
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2.5 text-left group"
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
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
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
            Restores 8 popular sample subscriptions (Netflix, ChatGPT, Spotify, Adobe, Figma, etc.) with upcoming alerts.
          </p>
        </div>

        <button
          onClick={resetToSampleData}
          className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
