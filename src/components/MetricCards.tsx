import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, formatDaysRemaining } from '../utils/calculations';
import { DollarSign, Calendar, Zap, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';

export const MetricCards: React.FC = () => {
  const { stats, currency, setActiveTab } = useSubscriptions();

  return (
    <div id="overview-metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Monthly Spend */}
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
  );
};
