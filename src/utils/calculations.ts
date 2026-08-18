import { Subscription, BillingCycle, RenewalAlert } from '../types';

export function normalizeToDaily(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return cost / 7;
    case 'monthly':
      return cost / 30.417; // Standard average monthly days
    case 'quarterly':
      return cost / 91.25;
    case 'yearly':
      return cost / 365.25;
    case 'lifetime':
      return 0; // One-time payment, no recurring daily cost
    default:
      return cost / 30.417;
  }
}

export function normalizeToMonthly(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return (cost * 52) / 12;
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'yearly':
      return cost / 12;
    case 'lifetime':
      return 0; // One-time payment, 0 recurring monthly expense
    default:
      return cost;
  }
}

export function normalizeToYearly(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return cost * 52;
    case 'monthly':
      return cost * 12;
    case 'quarterly':
      return cost * 4;
    case 'yearly':
      return cost;
    case 'lifetime':
      return 0; // One-time payment, 0 recurring yearly expense
    default:
      return cost * 12;
  }
}

export function getDaysUntil(dateString?: string): number {
  if (!dateString || dateString === 'Unlimited' || dateString === 'lifetime' || dateString.trim() === '') {
    return Infinity;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateString);
  if (isNaN(target.getTime())) {
    return Infinity;
  }
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(days: number): { text: string; isPast: boolean; isSoon: boolean } {
  if (!isFinite(days) || days > 10000) {
    return { text: 'Unlimited', isPast: false, isSoon: false };
  }
  if (days < 0) {
    return { text: `${Math.abs(days)}d overdue`, isPast: true, isSoon: true };
  }
  if (days === 0) {
    return { text: 'Charges Today', isPast: false, isSoon: true };
  }
  if (days === 1) {
    return { text: 'Charges Tomorrow', isPast: false, isSoon: true };
  }
  if (days <= 7) {
    return { text: `In ${days} days`, isPast: false, isSoon: true };
  }
  return { text: `In ${days} days`, isPast: false, isSoon: false };
}

export function generateAlerts(subscriptions: Subscription[]): RenewalAlert[] {
  const alerts: RenewalAlert[] = [];

  subscriptions
    .filter(s => (s.status === 'active' || s.status === 'trial') && s.billingCycle !== 'lifetime' && s.nextRenewalDate)
    .forEach(sub => {
      const days = getDaysUntil(sub.nextRenewalDate);
      if (!isFinite(days)) return;
      const alertWindow = Math.max(sub.alertDaysBefore || 3, 3);

      if (days <= alertWindow) {
        let severity: 'urgent' | 'warning' | 'info' = 'info';
        if (days <= 1 || (sub.isTrial && days <= 2)) {
          severity = 'urgent';
        } else if (days <= 4) {
          severity = 'warning';
        }

        alerts.push({
          id: `alert-${sub.id}-${sub.nextRenewalDate}`,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          cost: sub.cost,
          currency: sub.currency,
          renewalDate: sub.nextRenewalDate || 'Unlimited',
          daysRemaining: days,
          isTrial: !!sub.isTrial,
          severity,
          color: sub.color,
        });
      }
    });

  // Sort by urgency (fewer days remaining first)
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function exportSubscriptionsToCSV(subscriptions: Subscription[]): void {
  const headers = [
    'ID',
    'Name',
    'Category',
    'Cost',
    'Currency',
    'Billing Cycle',
    'Daily Equivalent ($)',
    'Normalized Monthly ($)',
    'Normalized Yearly ($)',
    'Next Renewal Date',
    'Status',
    'Is Trial',
    'Payment Method',
    'Auto Renew',
    'Notes',
    'Website'
  ];

  const rows = subscriptions.map(sub => [
    `"${sub.id}"`,
    `"${sub.name.replace(/"/g, '""')}"`,
    `"${sub.category}"`,
    sub.cost.toFixed(2),
    `"${sub.currency}"`,
    `"${sub.billingCycle}"`,
    normalizeToDaily(sub.cost, sub.billingCycle).toFixed(2),
    normalizeToMonthly(sub.cost, sub.billingCycle).toFixed(2),
    normalizeToYearly(sub.cost, sub.billingCycle).toFixed(2),
    sub.billingCycle === 'lifetime' ? '"Unlimited"' : `"${sub.nextRenewalDate || ''}"`,
    `"${sub.status}"`,
    sub.isTrial ? 'YES' : 'NO',
    `"${(sub.paymentMethod || '').replace(/"/g, '""')}"`,
    sub.autoRenew ? 'YES' : 'NO',
    `"${(sub.notes || '').replace(/"/g, '""')}"`,
    `"${(sub.websiteUrl || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubscriptionsToJSON(subscriptions: Subscription[]): void {
  const jsonContent = JSON.stringify(subscriptions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `subscriptions_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatCurrency(amount: number, currencyCode: string = 'BDT'): string {
  const symbols: Record<string, string> = {
    BDT: '৳',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
    INR: '₹',
  };
  const sym = symbols[currencyCode] || symbols.BDT || '৳';
  return `${sym}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
