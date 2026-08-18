import React from 'react';
import { Subscription } from '../types';
import { useSubscriptions } from '../context/SubscriptionContext';
import { ServiceIcon } from './ServiceIcon';
import {
  formatCurrency,
  getDaysUntil,
  formatDaysRemaining,
  normalizeToMonthly,
  normalizeToDaily
} from '../utils/calculations';
import {
  Calendar,
  CreditCard,
  ExternalLink,
  MoreVertical,
  Pause,
  Play,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  Repeat,
  Tag,
  Activity,
  Coins,
  Infinity as InfinityIcon,
  Sparkles
} from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  compact?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  compact = false,
}) => {
  const {
    currency,
    togglePauseSubscription,
    markSubscriptionPaid,
    deleteSubscription,
    setEditingSubscription,
    setIsModalOpen,
    setSelectedTag,
  } = useSubscriptions();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const isLifetime = subscription.billingCycle === 'lifetime';
  const daysUntil = isLifetime ? Infinity : getDaysUntil(subscription.nextRenewalDate);
  const { text: daysText, isSoon, isPast } = isLifetime
    ? { text: 'Unlimited', isSoon: false, isPast: false }
    : formatDaysRemaining(daysUntil);
  const isPaused = subscription.status === 'paused';
  const isTrial = subscription.status === 'trial' || subscription.isTrial;
  const dailyCost = normalizeToDaily(subscription.cost, subscription.billingCycle);

  const handleEdit = () => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
    setMenuOpen(false);
  };

  const isLowUsage =
    subscription.usageFrequency === 'rarely' ||
    subscription.usageFrequency === 'unused' ||
    (subscription.notes || '').toLowerCase().includes('rarely') ||
    (subscription.notes || '').toLowerCase().includes('unused');

  return (
    <div
      id={`sub-card-${subscription.id}`}
      className={`group relative bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
        isPaused
          ? 'opacity-65 border-neutral-200 dark:border-neutral-800'
          : !isLifetime && isSoon && daysUntil <= 2
          ? 'border-rose-300 dark:border-rose-900/60 bg-gradient-to-b from-rose-50/20 dark:from-rose-950/10 to-transparent'
          : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      } ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}
    >
      {/* Top row: Icon, Title, Status & Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ServiceIcon
            name={subscription.name}
            category={subscription.category}
            iconName={subscription.iconName}
            color={subscription.color}
            size={compact ? 'sm' : 'md'}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-sm sm:text-base">
                {subscription.name}
              </h3>
              {subscription.websiteUrl && (
                <a
                  href={subscription.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-0.5"
                  title="Open service website"
                >
                  <ExternalLink size={12} />
                </a>
              )}
              {isLowUsage && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md">
                  <Activity size={10} /> Low Usage
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {subscription.category}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                {isLifetime ? 'Lifetime License' : subscription.billingCycle}
              </span>
              {(subscription.purchaseDate || subscription.startDate) && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    Purchased: {subscription.purchaseDate || subscription.startDate}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="relative shrink-0">
          <button
            id={`btn-menu-${subscription.id}`}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            aria-label="Subscription options"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-30 py-1.5 text-xs">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 size={13} />
                  Edit Details
                </button>
                {!isLifetime && (
                  <button
                    onClick={() => {
                      markSubscriptionPaid(subscription.id);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={13} />
                    Mark as Paid (Advance)
                  </button>
                )}
                <button
                  onClick={() => {
                    togglePauseSubscription(subscription.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
                >
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                  {isPaused ? 'Resume Subscription' : 'Pause Subscription'}
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    deleteSubscription(subscription.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete Subscription
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle row: Price and relative monthly calculation + Daily Cost Badge */}
      <div className="mt-4 flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {formatCurrency(subscription.cost, subscription.currency || currency)}
            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400 ml-1">
              {isLifetime ? (
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">/ lifetime</span>
              ) : (
                `/${subscription.billingCycle === 'yearly' ? 'yr' : subscription.billingCycle === 'weekly' ? 'wk' : 'mo'}`
              )}
            </span>
          </div>
          {isLifetime ? (
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              One-time purchase • Unlimited time
            </div>
          ) : subscription.billingCycle !== 'monthly' && (
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              ~{formatCurrency(normalizeToMonthly(subscription.cost, subscription.billingCycle), subscription.currency || currency)}/mo
            </div>
          )}
        </div>

        {/* Daily Cost Badge & Status */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isLifetime ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
              <InfinityIcon size={12} />
              <span>Lifetime Access</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
              <span>{formatCurrency(dailyCost, subscription.currency || currency)}</span>
              <span className="text-[9px] opacity-75">/day</span>
            </span>
          )}

          {isPaused && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              Paused
            </span>
          )}
          {isTrial && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              Trial
            </span>
          )}
          {!isPaused && !isTrial && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Tags list if available */}
      {subscription.tags && subscription.tags.length > 0 && (
        <div className="mt-3 flex items-center gap-1 flex-wrap">
          {subscription.tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Bottom row: Renewal Date / Unlimited time & Quick Actions */}
      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        {isLifetime ? (
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold text-xs truncate">
            <InfinityIcon size={14} className="shrink-0 text-indigo-500" />
            <span className="truncate">Unlimited Time (No Renewal)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">
              {subscription.nextRenewalDate || 'No date'}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                daysUntil <= 2
                  ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-semibold'
                  : daysUntil <= 7
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {daysText}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => togglePauseSubscription(subscription.id)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
            title={isPaused ? 'Resume' : 'Pause'}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
            title="Edit"
            aria-label="Edit"
          >
            <Edit2 size={13} />
          </button>
        </div>
      </div>

      {subscription.notes && (
        <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 px-2.5 py-1.5 rounded-lg truncate">
          {subscription.notes}
        </div>
      )}
    </div>
  );
};
