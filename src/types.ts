export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'active' | 'paused' | 'trial' | 'cancelled';

export type UsageFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely' | 'unused';

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
  | 'Business & SaaS'
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
  alertDaysBefore?: number;
  autoRenew?: boolean;
  notes?: string;
  websiteUrl?: string;
  color: string;
  iconName?: string; // Lucide icon identifier
  tags?: string[]; // Custom user tags like #Work, #Personal, #Team, #Essential
  usageFrequency?: UsageFrequency; // Tracking activity/usage frequency
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
  tags?: string[];
}

export type ViewMode = 'responsive' | 'web' | 'android';
export type AppTab =
  | 'dashboard'
  | 'subscriptions'
  | 'payment'
  | 'analytics'
  | 'customer'
  | 'reports'
  | 'settings'
  | 'calendar'
  | 'forecast'
  | 'audit'
  | 'emails'
  | 'team'
  | 'checkout';

export type UserRole = 'admin' | 'finance' | 'support' | 'sales' | 'owner';

export interface TeamMemberPermissions {
  canManageSubscriptions?: boolean;
  canViewInvoices?: boolean;
  canManageBillingMethods?: boolean;
  canManageTeam?: boolean;
  canRunAudits?: boolean;
  canSendDunning?: boolean;
  canManageBilling?: boolean;
  canExportReports?: boolean;
  canEditSubscriptions?: boolean;
  canAccessCheckout?: boolean;
  canSendEmails?: boolean;
  canManageUsers?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  status: 'active' | 'invited' | 'suspended';
  lastActive?: string;
  createdAt?: string;
  permissions: TeamMemberPermissions;
}

export interface AutomatedEmailTemplate {
  id: string;
  type: 'dunning_failed_payment' | 'renewal_notice' | 'payment_confirmation' | 'invoice_reminder' | string;
  name: string;
  subject: string;
  description: string;
  body: string;
  trigger: string;
  enabled: boolean;
  daysBefore?: number;
  lastSentCount?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
  category?: 'billing' | 'security' | 'subscription' | 'email' | 'user';
  userName?: string;
  userRole?: UserRole;
  type?: string;
}
