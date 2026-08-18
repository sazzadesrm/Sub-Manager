import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, normalizeToMonthly } from '../utils/calculations';
import { ServiceIcon } from './ServiceIcon';
import {
  Sparkles,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock
} from 'lucide-react';

export const OptimizationAudit: React.FC = () => {
  const { subscriptions, stats, currency, togglePauseSubscription, setEditingSubscription, setIsModalOpen } = useSubscriptions();

  const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
  const trialSubs = subscriptions.filter(s => s.status === 'trial' || s.isTrial);
  const monthlyOnlySubs = activeSubs.filter(s => s.billingCycle === 'monthly' && s.cost > 10);

  // Group by category to find overlaps
  const categoryGroups: Record<string, typeof activeSubs> = {};
  activeSubs.forEach(s => {
    if (!categoryGroups[s.category]) categoryGroups[s.category] = [];
    categoryGroups[s.category].push(s);
  });

  const overlapCategories = Object.entries(categoryGroups).filter(([_, subs]) => subs.length >= 2);

  // Estimated annual savings if monthly subscriptions were switched to annual plans (assuming 18% standard discount)
  const potentialAnnualSavings = monthlyOnlySubs.reduce((acc, sub) => acc + (sub.cost * 12 * 0.18), 0);

  return (
    <div id="optimization-audit-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs w-fit mb-3">
          <Sparkles size={14} className="text-amber-300" />
          <span>Subscription Waste & Savings Audit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Optimization & Cost Reduction Opportunities
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl">
          Automated heuristic audit to help you eliminate zombie subscriptions, prevent unwanted trial auto-renewals, and unlock annual tier discounts.
        </p>

        {potentialAnnualSavings > 0 && (
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="p-2 rounded-xl bg-emerald-400 text-neutral-900 font-bold">
              <TrendingDown size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
                Potential Annual Savings
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                ~{formatCurrency(potentialAnnualSavings, currency)} / year
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overlapping Categories Insight */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Category Stacking & Overlaps
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Categories with multiple concurrent active services
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {overlapCategories.length} Categories
            </span>
          </div>

          {overlapCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              <ShieldCheck size={28} className="mx-auto mb-2 text-emerald-500" />
              <p>Clean stack! No duplicate categories detected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {overlapCategories.map(([category, subs]) => {
                const groupMonthly = subs.reduce((a, b) => a + normalizeToMonthly(b.cost, b.billingCycle), 0);

                return (
                  <div
                    key={category}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{category}</span>
                        <span className="text-xs font-normal text-neutral-400">({subs.length} active)</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {formatCurrency(groupMonthly, currency)}/mo
                      </span>
                    </div>

                    <div className="space-y-2">
                      {subs.map(sub => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between text-xs bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800"
                        >
                          <div className="flex items-center gap-2">
                            <ServiceIcon
                              name={sub.name}
                              category={sub.category}
                              iconName={sub.iconName}
                              color={sub.color}
                              size="sm"
                            />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">
                              {sub.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500 font-medium">
                              {formatCurrency(sub.cost, sub.currency || currency)}/{sub.billingCycle}
                            </span>
                            <button
                              onClick={() => togglePauseSubscription(sub.id)}
                              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Pause
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2.5">
                      💡 Tip: Consolidating {subs.map(s => s.name).join(' & ')} could save up to{' '}
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {formatCurrency(normalizeToMonthly(subs[0].cost, subs[0].billingCycle) * 12, currency)}/year
                      </span>.
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Free Trials & Monthly-to-Annual Savings */}
        <div className="space-y-6">
          {/* Free Trials Watchdog */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2 mb-1">
              <Clock size={18} className="text-rose-500" />
              Trial Watchdog
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Active trials to cancel before auto-charge
            </p>

            {trialSubs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 text-center text-xs text-neutral-500">
                <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500" />
                No active trials currently.
              </div>
            ) : (
              <div className="space-y-3">
                {trialSubs.map(trial => (
                  <div
                    key={trial.id}
                    className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <ServiceIcon
                        name={trial.name}
                        category={trial.category}
                        iconName={trial.iconName}
                        color={trial.color}
                        size="sm"
                      />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white text-sm">
                          {trial.name}
                        </div>
                        <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                          Auto-renews on {trial.nextRenewalDate} ({formatCurrency(trial.cost, trial.currency || currency)})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingSubscription(trial);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold shadow-xs hover:bg-neutral-50"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Annual Switch Opportunity */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2 mb-1">
              <Percent size={18} className="text-emerald-500" />
              Annual Switch Discount Advisor
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Services billed monthly that you keep year-round
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {monthlyOnlySubs.slice(0, 4).map(sub => {
                const estAnnualSaving = sub.cost * 12 * 0.18;

                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <ServiceIcon
                        name={sub.name}
                        category={sub.category}
                        iconName={sub.iconName}
                        color={sub.color}
                        size="sm"
                      />
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {sub.name}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Current: {formatCurrency(sub.cost, currency)}/mo
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Save ~{formatCurrency(estAnnualSaving, currency)}/yr
                      </span>
                      <div className="text-[10px] text-neutral-400">with annual plan</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
