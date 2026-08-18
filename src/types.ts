export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'active' | 'paused' | 'trial' | 'cancelled';

export type SubscriptionCategory =
  | 'Streaming'
  | 'Software'
  | 'Productivity'
  | 'Cloud & Hosting'
  | 'Gaming'
  | 'Health & Fitness'
  | 'Utilities'
  | 'News & Reading'
  | 'Shopping & Delivery'
  | 'Other';

export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  nextRenewalDate: string; // ISO format YYYY-MM-DD
  startDate?: string;
  paymentMethod?: string;
  status: SubscriptionStatus;
  isTrial?: boolean;
  trialEndDate?: string;
  alertDaysBefore: number; // e.g., 1, 3, 7
  autoRenew: boolean;
  notes?: string;
  websiteUrl?: string;
  color: string;
  iconName?: string; // Lucide icon identifier
}

export interface RenewalAlert {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  cost: number;
  currency: string;
  renewalDate: string;
  daysRemaining: number;
  isTrial: boolean;
  severity: 'urgent' | 'warning' | 'info';
  color: string;
}

export interface PresetSubscription {
  name: string;
  category: SubscriptionCategory;
  defaultCost: number;
  billingCycle: BillingCycle;
  color: string;
  websiteUrl: string;
  iconName: string;
  description: string;
}

export type ViewMode = 'responsive' | 'web' | 'android';
export type AppTab = 'dashboard' | 'subscriptions' | 'calendar' | 'analytics' | 'settings' | 'audit';
