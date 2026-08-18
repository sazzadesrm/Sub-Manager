import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, formatDaysRemaining } from '../utils/calculations';
import { AlertTriangle, Bell, CheckCircle2, X, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RenewalAlertBanner: React.FC = () => {
  const { alerts, dismissAlert, markSubscriptionPaid, currency } = useSubscriptions();

  if (alerts.length === 0) return null;

  return (
    <div id="renewal-alerts-container" className="mb-6 space-y-3">
      <AnimatePresence>
        {alerts.slice(0, 3).map(alert => {
          const isUrgent = alert.severity === 'urgent';
          const { text: daysText } = formatDaysRemaining(alert.daysRemaining);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              id={`alert-banner-${alert.id}`}
              className={`rounded-2xl p-4 sm:p-4.5 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isUrgent
                  ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-100'
                  : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isUrgent
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                      : 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  }`}
                >
                  {isUrgent ? <AlertTriangle size={18} /> : <Clock size={18} />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm sm:text-base">
                      {alert.subscriptionName}
                    </span>
                    {alert.isTrial && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                        Free Trial Ending
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isUrgent
                          ? 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200'
                          : 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {daysText}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Scheduled payment of{' '}
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(alert.cost, alert.currency || currency)}
                    </span>{' '}
                    on {alert.renewalDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  id={`btn-paid-${alert.id}`}
                  onClick={() => markSubscriptionPaid(alert.subscriptionId)}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                  title="Mark as paid and advance next renewal date"
                >
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  Mark Renewed
                </button>
                <button
                  id={`btn-dismiss-${alert.id}`}
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Dismiss alert"
                  aria-label="Dismiss alert"
                >
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
