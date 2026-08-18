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
  ArrowUpDown,
  ExternalLink,
  Edit2,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  Calendar,
  Activity,
  Coins,
  ShoppingBag,
  Infinity as InfinityIcon
} from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ subscriptions }) => {
  const {
    currency,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    togglePauseSubscription,
    markSubscriptionPaid,
    deleteSubscription,
    setEditingSubscription,
    setIsModalOpen,
    setSelectedTag,
  } = useSubscriptions();

  const handleSort = (column: 'cost' | 'renewal' | 'name') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1.5">
                <span>Service</span>
                <ArrowUpDown size={12} className={sortBy === 'name' ? 'text-blue-600 dark:text-blue-400' : ''} />
              </div>
            </th>
            <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
            <th className="py-3.5 px-4 hidden lg:table-cell">
              <div className="flex items-center gap-1">
                <ShoppingBag size={12} className="text-blue-500" />
                <span>Purchase Date</span>
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={() => handleSort('renewal')}
            >
              <div className="flex items-center gap-1.5">
                <span>Next Renewal</span>
                <ArrowUpDown size={12} className={sortBy === 'renewal' ? 'text-blue-600 dark:text-blue-400' : ''} />
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={() => handleSort('cost')}
            >
              <div className="flex items-center gap-1.5">
                <span>Cost / Normalized</span>
                <ArrowUpDown size={12} className={sortBy === 'cost' ? 'text-blue-600 dark:text-blue-400' : ''} />
              </div>
            </th>
            {/* Daily Cost Badge Column */}
            <th className="py-3.5 px-4">
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <Coins size={13} />
                <span>Daily Cost</span>
              </div>
            </th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
          {subscriptions.map(sub => {
            const isLifetime = sub.billingCycle === 'lifetime';
            const daysUntil = isLifetime ? Infinity : getDaysUntil(sub.nextRenewalDate);
            const { text: daysText, isSoon } = isLifetime
              ? { text: 'Unlimited', isSoon: false }
              : formatDaysRemaining(daysUntil);
            const isPaused = sub.status === 'paused';
            const isTrial = sub.status === 'trial' || sub.isTrial;
            const dailyCost = normalizeToDaily(sub.cost, sub.billingCycle);
            const purchaseDateDisplay = sub.purchaseDate || sub.startDate || '—';
            const isLowUsage =
              sub.usageFrequency === 'rarely' ||
              sub.usageFrequency === 'unused' ||
              (sub.notes || '').toLowerCase().includes('rarely') ||
              (sub.notes || '').toLowerCase().includes('unused');

            return (
              <tr
                key={sub.id}
                id={`sub-row-${sub.id}`}
                className={`transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 ${
                  isPaused ? 'opacity-60 bg-neutral-50/30 dark:bg-neutral-900/30' : ''
                }`}
              >
                {/* Service Name & Icon & Tags */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <ServiceIcon
                      name={sub.name}
                      category={sub.category}
                      iconName={sub.iconName}
                      color={sub.color}
                      size="sm"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 flex-wrap">
                        <span>{sub.name}</span>
                        {sub.websiteUrl && (
                          <a
                            href={sub.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            title="Visit website"
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
                        {sub.paymentMethod && (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {sub.paymentMethod}
                          </span>
                        )}
                        {sub.tags && sub.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {sub.tags.slice(0, 2).map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setSelectedTag(tag)}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-500 cursor-pointer"
                              >
                                #{tag}
                              </button>
                            ))}
                            {sub.tags.length > 2 && (
                              <span className="text-[10px] text-neutral-400">+{sub.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {sub.category}
                  </span>
                </td>

                {/* Purchase Date */}
                <td className="py-3 px-4 hidden lg:table-cell text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                    {purchaseDateDisplay}
                  </span>
                </td>

                {/* Next Renewal */}
                <td className="py-3 px-4">
                  {isLifetime ? (
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium text-xs">
                      <InfinityIcon size={14} />
                      <span>Unlimited Time</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
                        {sub.nextRenewalDate}
                      </span>
                      <span
                        className={`text-[11px] font-medium inline-block ${
                          daysUntil <= 2
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : daysUntil <= 7
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {daysText}
                      </span>
                    </div>
                  )}
                </td>

                {/* Cost (Nominal & Normalized) */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(sub.cost, sub.currency || currency)}
                    <span className="text-xs text-neutral-400 font-normal ml-0.5">
                      {isLifetime ? '/ lifetime' : `/${sub.billingCycle === 'yearly' ? 'yr' : sub.billingCycle === 'weekly' ? 'wk' : 'mo'}`}
                    </span>
                  </div>
                  {isLifetime ? (
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      One-time license
                    </div>
                  ) : sub.billingCycle !== 'monthly' && (
                    <div className="text-[11px] text-neutral-400">
                      {formatCurrency(normalizeToMonthly(sub.cost, sub.billingCycle), sub.currency || currency)}/mo
                    </div>
                  )}
                </td>

                {/* Daily Cost Badge */}
                <td className="py-3 px-4">
                  {isLifetime ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs">
                      <InfinityIcon size={12} />
                      <span>Lifetime</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs">
                      <span>{formatCurrency(dailyCost, sub.currency || currency)}</span>
                      <span className="text-[10px] font-medium opacity-75">/day</span>
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  {isPaused ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      Paused
                    </span>
                  ) : isTrial ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      Trial
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {!isLifetime && (
                      <button
                        id={`table-btn-paid-${sub.id}`}
                        onClick={() => markSubscriptionPaid(sub.id)}
                        className="p-1.5 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="Mark as paid (advance date)"
                        aria-label="Mark as paid"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button
                      id={`table-btn-pause-${sub.id}`}
                      onClick={() => togglePauseSubscription(sub.id)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title={isPaused ? 'Resume' : 'Pause'}
                      aria-label={isPaused ? 'Resume' : 'Pause'}
                    >
                      {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    </button>
                    <button
                      id={`table-btn-edit-${sub.id}`}
                      onClick={() => handleEdit(sub)}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit details"
                      aria-label="Edit details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      id={`table-btn-delete-${sub.id}`}
                      onClick={() => deleteSubscription(sub.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
