import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, formatDaysRemaining } from '../utils/calculations';
import {
  DollarSign,
  Calendar,
  Zap,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Globe2,
  Bell,
  BellRing,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const MetricCards: React.FC = () => {
  const {
    stats,
    currency,
    exchangeRates,
    ratesLastUpdated,
    isRatesLoading,
    refreshExchangeRates,
    convertSpend,
    notificationPermission,
    requestNotifications,
    sendTestNotification,
    isNotificationSupported,
  } = useSubscriptions();

  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const monthlyBDT = stats.totalMonthlySpend;
  const spendUSD = convertSpend(monthlyBDT, 'USD');
  const spendEUR = convertSpend(monthlyBDT, 'EUR');
  const spendGBP = convertSpend(monthlyBDT, 'GBP');
  const spendINR = convertSpend(monthlyBDT, 'INR');

  const handleTestNotification = () => {
    const success = sendTestNotification();
    if (success) {
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 4000);
    }
  };

  return (
    <div id="overview-metrics-section" className="space-y-4 mb-6">
      {/* Top 4 Primary Metric Cards */}
      <div id="overview-metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Monthly Spend (BDT) */}
        <div
          id="metric-monthly-spend"
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Monthly Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {formatCurrency(stats.totalMonthlySpend, currency)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <span>Avg {formatCurrency(stats.totalMonthlySpend / Math.max(stats.activeCount, 1), currency)}/service</span>
            </div>
          </div>
        </div>

        {/* Total Yearly Projected */}
        <div
          id="metric-yearly-spend"
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Yearly Projected
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {formatCurrency(stats.totalYearlySpend, currency)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Annual recurring cost
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div
          id="metric-active-services"
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Active Services
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
              <span>{stats.activeCount}</span>
              {stats.trialCount > 0 && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  ({stats.trialCount} trial)
                </span>
              )}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {stats.pausedCount > 0 ? `${stats.pausedCount} paused` : 'All active'}
            </div>
          </div>
        </div>

        {/* Upcoming In 7 Days */}
        <div
          id="metric-upcoming-charges"
          className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Upcoming (7 Days)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {formatCurrency(stats.upcomingNext7DaysCost, currency)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
              {stats.nextImmediateRenewal ? (
                <span>
                  Next: {stats.nextImmediateRenewal.name} ({formatDaysRemaining(stats.nextImmediateRenewal.days).text})
                </span>
              ) : (
                'No upcoming charges this week'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Multi-Currency Spend Conversion Banner */}
      <div
        id="real-time-exchange-card"
        className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 border border-blue-200/60 dark:border-neutral-800 rounded-2xl p-4 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100/80 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <Globe2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Real-Time Multi-Currency Spend Equivalents
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Live API
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Total monthly outflow converted from BDT to major international currencies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Synced: {ratesLastUpdated}
            </span>
            <button
              onClick={() => refreshExchangeRates()}
              disabled={isRatesLoading}
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-neutral-800 rounded-lg border border-neutral-200/60 dark:border-neutral-700 transition-all flex items-center gap-1 text-xs"
              title="Refresh live exchange rates"
            >
              <RefreshCw size={13} className={isRatesLoading ? 'animate-spin text-blue-600' : ''} />
              <span className="hidden sm:inline text-[11px] font-medium">Update Rates</span>
            </button>
          </div>
        </div>

        {/* Currency Conversion Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          {/* USD ($) */}
          <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span>US Dollar (USD)</span>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">$</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
              ${spendUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              1 USD ≈ {Math.round(1 / (exchangeRates['USD'] || 0.0083))} ৳
            </div>
          </div>

          {/* EUR (€) */}
          <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span>Euro (EUR)</span>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">€</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
              €{spendEUR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              1 EUR ≈ {Math.round(1 / (exchangeRates['EUR'] || 0.0077))} ৳
            </div>
          </div>

          {/* GBP (£) */}
          <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span>British Pound (GBP)</span>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">£</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
              £{spendGBP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              1 GBP ≈ {Math.round(1 / (exchangeRates['GBP'] || 0.0066))} ৳
            </div>
          </div>

          {/* INR (₹) */}
          <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span>Indian Rupee (INR)</span>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">₹</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
              ₹{spendINR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              1 ৳ ≈ {(exchangeRates['INR'] || 0.72).toFixed(2)} ₹
            </div>
          </div>
        </div>
      </div>

      {/* Browser Push Notifications 24h Setup Bar */}
      {isNotificationSupported && notificationPermission !== 'granted' && (
        <div
          id="push-notifications-prompt"
          className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <BellRing size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 dark:text-amber-100">
                Enable 24-Hour Browser Push Renewal Alerts
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Receive proactive desktop/mobile browser notifications 24 hours before any subscription or free trial renews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => requestNotifications()}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors"
            >
              Enable Browser Alerts
            </button>
          </div>
        </div>
      )}

      {/* Test Push Notification confirmation badge */}
      {notificationPermission === 'granted' && (
        <div className="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-[11px]">
              24-Hour Automated Push Notifications are active for all subscriptions
            </span>
          </div>
          <button
            onClick={handleTestNotification}
            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Bell size={12} />
            {testNotificationSent ? '✓ Sent Test Alert!' : 'Send Test Notification'}
          </button>
        </div>
      )}
    </div>
  );
};
