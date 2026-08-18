import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, normalizeToMonthly } from '../utils/calculations';
import { ServiceIcon } from './ServiceIcon';
import { Subscription } from '../types';
import {
  Sparkles,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  Activity,
  AlertOctagon,
  Trash2,
  Pause,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OptimizationAudit: React.FC = () => {
  const {
    subscriptions,
    stats,
    currency,
    togglePauseSubscription,
    deleteSubscription,
    updateSubscription,
    setEditingSubscription,
    setIsModalOpen,
  } = useSubscriptions();

  const [downgradedSubIds, setDowngradedSubIds] = useState<string[]>([]);

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

  // Heuristic scan for low activity / usage frequency from user notes & frequency setting
  const lowActivityAudits = activeSubs.map(sub => {
    const notesLower = (sub.notes || '').toLowerCase();
    const isRareByFrequency = sub.usageFrequency === 'rarely' || sub.usageFrequency === 'unused';

    let reason = '';
    let confidence: 'high' | 'medium' = 'medium';
    let suggestion: 'cancel' | 'downgrade' | 'pause' = 'pause';

    if (notesLower.includes('rarely used') || notesLower.includes('rarely')) {
      reason = 'Notes mention this service is rarely used or replaced by alternatives.';
      confidence = 'high';
      suggestion = 'downgrade';
    } else if (notesLower.includes('haven\'t opened') || notesLower.includes('haven\'t logged')) {
      reason = 'Notes indicate inactivity in recent months.';
      confidence = 'high';
      suggestion = 'cancel';
    } else if (notesLower.includes('dormant') || notesLower.includes('forgot') || notesLower.includes('waste')) {
      reason = 'Flagged as dormant/wasteful in personal notes.';
      confidence = 'high';
      suggestion = 'cancel';
    } else if (isRareByFrequency) {
      reason = 'Marked as rarely used or unused frequency in activity settings.';
      confidence = 'high';
      suggestion = 'pause';
    } else if (sub.isTrial) {
      reason = 'Expiring trial period pending cancellation decision.';
      confidence = 'medium';
      suggestion = 'cancel';
    }

    if (reason) {
      const monthlyWaste = normalizeToMonthly(sub.cost, sub.billingCycle);
      return {
        sub,
        reason,
        confidence,
        suggestion,
        monthlyWaste,
        yearlyWaste: monthlyWaste * 12,
      };
    }
    return null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const totalZombieWasteMonthly = lowActivityAudits.reduce((acc, item) => acc + item.monthlyWaste, 0);
  const potentialAnnualSavings = monthlyOnlySubs.reduce((acc, sub) => acc + (sub.cost * 12 * 0.18), 0);
  const totalCombinedSavings = potentialAnnualSavings + (totalZombieWasteMonthly * 12);

  const handleDowngrade = (sub: Subscription) => {
    const newCost = Math.round(sub.cost * 0.5);
    updateSubscription(sub.id, {
      cost: newCost,
      notes: `${sub.notes ? sub.notes + ' ' : ''}[Downgraded to lower tier via Smart Audit]`,
    });
    setDowngradedSubIds(prev => [...prev, sub.id]);
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div id="optimization-audit-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300 backdrop-blur-xs w-fit mb-3 border border-emerald-500/30">
          <Sparkles size={14} className="text-amber-300" />
          <span>Smart Savings AI & Usage Audit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Subscription Waste & Optimization Intelligence
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl">
          Automated heuristic audit scanning user notes, activity frequency, duplicate service categories, and trial timers to eliminate wasted recurring spend.
        </p>

        {totalCombinedSavings > 0 && (
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
              <div className="p-2 rounded-xl bg-emerald-400 text-neutral-900 font-bold">
                <TrendingDown size={20} />
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
                  Total Recoverable Savings
                </div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  ~{formatCurrency(totalCombinedSavings, currency)} / year
                </div>
              </div>
            </div>

            {totalZombieWasteMonthly > 0 && (
              <div className="inline-flex items-center gap-2.5 bg-rose-500/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-rose-400/30">
                <AlertOctagon size={20} className="text-rose-400" />
                <div>
                  <div className="text-xs font-medium text-rose-200 uppercase tracking-wider">
                    Zombie & Low-Usage Spend
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {formatCurrency(totalZombieWasteMonthly, currency)} / month
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Low Activity & Notes Usage Frequency Detector */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <Activity size={18} className="text-rose-500" />
              Low Activity & Zombie Subscriptions (Notes-Based Analysis)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Identified from your usage frequency tags and personal notes as under-utilized.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
            {lowActivityAudits.length} Detected
          </span>
        </div>

        {lowActivityAudits.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl">
            <ShieldCheck size={28} className="mx-auto mb-2 text-emerald-500" />
            <p className="font-medium text-neutral-700 dark:text-neutral-300">No low-activity or dormant subscriptions detected!</p>
            <p className="text-neutral-500 mt-1">All active services have regular usage recorded.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowActivityAudits.map(({ sub, reason, monthlyWaste, yearlyWaste, suggestion }) => {
              const isDowngraded = downgradedSubIds.includes(sub.id);

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <ServiceIcon
                      name={sub.name}
                      category={sub.category}
                      iconName={sub.iconName}
                      color={sub.color}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm">
                          {sub.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
                          {sub.usageFrequency === 'unused' ? 'Unused' : 'Infrequent Usage'}
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">
                          {formatCurrency(sub.cost, sub.currency || currency)}/{sub.billingCycle}
                        </span>
                      </div>

                      <p className="text-xs text-rose-700 dark:text-rose-400 font-medium mt-1">
                        🎯 {reason}
                      </p>

                      {sub.notes && (
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 italic truncate max-w-md">
                          Note: "{sub.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Savings & Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <div className="text-right mr-2 hidden sm:block">
                      <div className="text-[11px] text-neutral-500">Potential Savings</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(yearlyWaste, currency)}/yr
                      </div>
                    </div>

                    <button
                      onClick={() => togglePauseSubscription(sub.id)}
                      className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Pause size={12} />
                      Pause
                    </button>

                    <button
                      onClick={() => handleDowngrade(sub)}
                      disabled={isDowngraded}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 ${
                        isDowngraded
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <ArrowDownCircle size={12} />
                      {isDowngraded ? 'Downgraded' : 'Downgrade Plan (50%)'}
                    </button>

                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Cancel and remove subscription"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2-Column Audit Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overlapping Categories Insight */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Category Stacking & Duplicate Services
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Multiple active subscriptions serving the same purpose
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
              Trial Watchdog & Auto-Renew Alert
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Active trials that will auto-charge if not cancelled
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
              Switching long-term monthly subscriptions to annual billing saves an average of 18%
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
