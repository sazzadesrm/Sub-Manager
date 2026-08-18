import { Subscription, SubscriptionCategory, TeamMember, AutomatedEmailTemplate, AuditLogEntry } from '../types';

export const CATEGORIES: SubscriptionCategory[] = [
  'Streaming',
  'Software',
  'Productivity',
  'Cloud & Hosting',
  'Gaming',
  'Health & Fitness',
  'Utilities',
  'News & Reading',
  'Shopping & Delivery',
  'Business & SaaS',
  'Other',
];

export const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  'Streaming': '#E50914',
  'Software': '#6366F1',
  'Productivity': '#0EA5E9',
  'Cloud & Hosting': '#F59E0B',
  'Gaming': '#10B981',
  'Health & Fitness': '#EC4899',
  'Utilities': '#64748B',
  'News & Reading': '#8B5CF6',
  'Shopping & Delivery': '#F97316',
  'Business & SaaS': '#8B5CF6',
  'Other': '#94A3B8',
};

export const COMMON_TAGS = [
  'Work',
  'Personal',
  'Essential',
  'Entertainment',
  'TeamShared',
  'Trial',
  'Design',
  'Development',
  'Fitness',
  'HighPriority',
  'Corporate',
  'Billing',
];

export const CURRENCIES = [
  { code: 'BDT', symbol: '৳', label: 'BDT - Bangladeshi Taka (৳)' },
  { code: 'USD', symbol: '$', label: 'USD - US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound (£)' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen (¥)' },
];

// Helper to get formatted relative date helper
export function getRelativeDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Netflix Premium',
    category: 'Streaming',
    cost: 1500.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(1), // Renews in 1 day! (Urgent alert)
    paymentMethod: 'City Bank Visa Dual Currency',
    status: 'active',
    alertDaysBefore: 3,
    autoRenew: true,
    notes: 'Family 4K plan. Shared with home members. Watched weekly on living room TV.',
    websiteUrl: 'https://netflix.com/youraccount',
    color: '#E50914',
    iconName: 'Tv',
    tags: ['Entertainment', 'Personal', 'Family'],
    usageFrequency: 'daily',
  },
  {
    id: 'sub-2',
    name: 'ChatGPT Plus',
    category: 'Productivity',
    cost: 2400.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(3), // Renews in 3 days!
    paymentMethod: 'EBL Mastercard Aqua',
    status: 'active',
    alertDaysBefore: 3,
    autoRenew: true,
    notes: 'Core daily coding & writing AI assistant.',
    websiteUrl: 'https://chatgpt.com',
    color: '#10A37F',
    iconName: 'Bot',
    tags: ['Work', 'Essential', 'Development'],
    usageFrequency: 'daily',
  },
  {
    id: 'sub-3',
    name: 'Spotify Premium',
    category: 'Streaming',
    cost: 599.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(6), // In 6 days
    paymentMethod: 'bKash / Card',
    status: 'active',
    alertDaysBefore: 3,
    autoRenew: true,
    notes: 'Ad-free high quality audio streaming during commute and focus.',
    websiteUrl: 'https://spotify.com/account',
    color: '#1DB954',
    iconName: 'Music',
    tags: ['Entertainment', 'Personal'],
    usageFrequency: 'daily',
  },
  {
    id: 'sub-4',
    name: 'High-Speed Fiber Broadband',
    category: 'Utilities',
    cost: 1000.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(12),
    paymentMethod: 'bKash Auto-Pay',
    status: 'active',
    alertDaysBefore: 5,
    autoRenew: true,
    notes: '35 Mbps Dedicated optical fiber internet line. Home backbone.',
    websiteUrl: 'https://isp.com',
    color: '#0284C7',
    iconName: 'Wifi',
    tags: ['Essential', 'Utilities', 'Work'],
    usageFrequency: 'daily',
  },
  {
    id: 'sub-5',
    name: 'Google One (2TB)',
    category: 'Cloud & Hosting',
    cost: 1100.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(18),
    paymentMethod: 'Visa •••• 4242',
    status: 'active',
    alertDaysBefore: 3,
    autoRenew: true,
    notes: 'Cloud backup for Drive and Google Photos storage.',
    websiteUrl: 'https://one.google.com',
    color: '#4285F4',
    iconName: 'Cloud',
    tags: ['Essential', 'Personal', 'Work'],
    usageFrequency: 'weekly',
  },
  {
    id: 'sub-6',
    name: 'Figma Professional',
    category: 'Productivity',
    cost: 1800.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(24),
    paymentMethod: 'Corporate Card',
    status: 'active',
    alertDaysBefore: 5,
    autoRenew: true,
    notes: 'UI/UX workspace and design team collaboration.',
    websiteUrl: 'https://figma.com',
    color: '#A259FF',
    iconName: 'Layout',
    tags: ['Work', 'Design', 'TeamShared'],
    usageFrequency: 'daily',
  },
  {
    id: 'sub-7',
    name: 'Midjourney Trial',
    category: 'Productivity',
    cost: 1200.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(2), // Trial expiring soon!
    paymentMethod: 'Dual Currency Card',
    status: 'trial',
    isTrial: true,
    trialEndDate: getRelativeDate(2),
    alertDaysBefore: 2,
    autoRenew: true,
    notes: '7-day trial. Rarely used since last batch, cancel before auto-billing.',
    websiteUrl: 'https://midjourney.com/account',
    color: '#2B2D42',
    iconName: 'Sparkles',
    tags: ['Design', 'Trial'],
    usageFrequency: 'rarely',
  },
  {
    id: 'sub-8',
    name: 'Chorki VIP Subscription',
    category: 'Streaming',
    cost: 299.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(28),
    paymentMethod: 'Nagad / bKash',
    status: 'paused',
    alertDaysBefore: 3,
    autoRenew: false,
    notes: 'Paused temporarily after binge watching last series.',
    websiteUrl: 'https://chorki.com',
    color: '#F97316',
    iconName: 'Film',
    tags: ['Entertainment', 'Personal'],
    usageFrequency: 'unused',
  },
  {
    id: 'sub-9',
    name: 'Adobe Illustrator Solo',
    category: 'Software',
    cost: 2800.0,
    currency: 'BDT',
    billingCycle: 'monthly',
    nextRenewalDate: getRelativeDate(9),
    paymentMethod: 'City Bank Visa Dual Currency',
    status: 'active',
    alertDaysBefore: 3,
    autoRenew: true,
    notes: 'Rarely used in past 2 months because Figma covers 95% of vector work. Suggest cancelling or downgrading.',
    websiteUrl: 'https://adobe.com/illustrator',
    color: '#FF9A00',
    iconName: 'Palette',
    tags: ['Design', 'Software'],
    usageFrequency: 'rarely',
  },
];

// Initial Team Members for RBAC
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sazzad Hossain',
    email: 'sazzadmbstu@gmail.com',
    role: 'admin',
    department: 'Executive Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2025-01-10',
    permissions: {
      canManageSubscriptions: true,
      canViewInvoices: true,
      canManageBillingMethods: true,
      canManageTeam: true,
      canRunAudits: true,
      canSendDunning: true,
      canManageBilling: true,
      canExportReports: true,
      canEditSubscriptions: true,
      canAccessCheckout: true,
      canSendEmails: true,
      canManageUsers: true,
    },
  },
  {
    id: 'user-2',
    name: 'Farhana Rahman (Finance)',
    email: 'farhana.finance@submanager.io',
    role: 'finance',
    department: 'Finance & Treasury',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    lastActive: '18 mins ago',
    createdAt: '2025-02-14',
    permissions: {
      canManageSubscriptions: true,
      canViewInvoices: true,
      canManageBillingMethods: true,
      canManageTeam: false,
      canRunAudits: true,
      canSendDunning: true,
      canManageBilling: true,
      canExportReports: true,
      canEditSubscriptions: true,
      canAccessCheckout: false,
      canSendEmails: true,
      canManageUsers: false,
    },
  },
  {
    id: 'user-3',
    name: 'Tanvir Ahmed (Support)',
    email: 'tanvir.support@submanager.io',
    role: 'support',
    department: 'Customer Success',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2025-03-01',
    permissions: {
      canManageSubscriptions: false,
      canViewInvoices: true,
      canManageBillingMethods: false,
      canManageTeam: false,
      canRunAudits: false,
      canSendDunning: true,
      canManageBilling: false,
      canExportReports: true,
      canEditSubscriptions: false,
      canAccessCheckout: false,
      canSendEmails: true,
      canManageUsers: false,
    },
  },
  {
    id: 'user-4',
    name: 'Nadia Islam (Sales)',
    email: 'nadia.sales@submanager.io',
    role: 'sales',
    department: 'Commercial Growth',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    lastActive: 'Yesterday',
    createdAt: '2025-03-15',
    permissions: {
      canManageSubscriptions: true,
      canViewInvoices: true,
      canManageBillingMethods: false,
      canManageTeam: false,
      canRunAudits: false,
      canSendDunning: false,
      canManageBilling: false,
      canExportReports: false,
      canEditSubscriptions: false,
      canAccessCheckout: true,
      canSendEmails: false,
      canManageUsers: false,
    },
  },
];

// Initial Automated Email Templates
export const INITIAL_EMAIL_TEMPLATES: AutomatedEmailTemplate[] = [
  {
    id: 'tpl-renewal',
    type: 'renewal_notice',
    name: 'Upcoming Subscription Renewal Notice',
    subject: 'Action Required: Your {subscription_name} renewal scheduled for {renewal_date}',
    description: 'Sent automatically 24 to 72 hours before charge hits the user payment method.',
    trigger: '24-48 hours before renewal date',
    enabled: true,
    daysBefore: 2,
    lastSentCount: 42,
    body: `Hi {customer_name},

This is a proactive reminder that your {subscription_name} subscription is scheduled to renew automatically on {renewal_date}.

• Service: {subscription_name}
• Scheduled Amount: {amount}
• Billing Cycle: {billing_cycle}
• Payment Method: {payment_method}

If you wish to keep your service active, no action is required. If you would like to pause, cancel, or modify your tier, please visit your account dashboard below.

Manage Subscription: {action_url}

Thank you,
The SubManager Operations Team`,
  },
  {
    id: 'tpl-dunning',
    type: 'dunning_failed_payment',
    name: 'Payment Failure & Dunning Warning (Grace Period)',
    subject: 'Urgent: Unable to process payment for {subscription_name}',
    description: 'Dispatches when a recurring charge fails. Offers 3-day grace period with direct payment retry link.',
    trigger: 'Immediate on charge decline',
    enabled: true,
    daysBefore: 0,
    lastSentCount: 8,
    body: `Hi {customer_name},

We attempted to process your scheduled payment of {amount} for {subscription_name}, but the transaction could not be completed by your bank/card issuer.

To prevent any service interruption, we have initiated a 3-day grace period. Please update your payment method or retry the transaction:

Update Card / Pay Now: {action_url}

If you need any assistance, our support team is available 24/7.

Regards,
SubManager Billing & Support`,
  },
  {
    id: 'tpl-confirmation',
    type: 'payment_confirmation',
    name: 'Digital Payment Receipt & Confirmation',
    subject: 'Receipt: Your payment of {amount} for {subscription_name} was successful',
    description: 'Instant transaction receipt generated with VAT/Tax invoice breakdown and PDF export.',
    trigger: 'Immediate on transaction success',
    enabled: true,
    daysBefore: 0,
    lastSentCount: 156,
    body: `Hi {customer_name},

Thank you for your payment! Here is your official receipt for {subscription_name}.

• Transaction Reference: {invoice_id}
• Date of Payment: {renewal_date}
• Amount Charged: {amount}
• Status: Completed & Verified

You can download your PDF invoice with corporate tax ID from your portal: {invoice_url}

Thank you for your business!
SubManager Finance Dept.`,
  },
  {
    id: 'tpl-invoice',
    type: 'invoice_reminder',
    name: 'Net-30 Invoice Due Reminder',
    subject: 'Reminder: Invoice #{invoice_id} for {subscription_name} is due soon',
    description: 'Sent 5 days before net-30 business invoices are due for corporate accounts.',
    trigger: '5 days prior to invoice due date',
    enabled: true,
    daysBefore: 5,
    lastSentCount: 14,
    body: `Hi {customer_name},

This is a courtesy reminder regarding outstanding Invoice #{invoice_id} for {subscription_name} in the amount of {amount}.

• Due Date: {due_date}
• Status: Pending Payment
• Pay via Bank Wire / bKash / Card: {action_url}

Please ignore this reminder if your accounts payable department has already processed the transfer.

Best regards,
SubManager Accounts Receivable`,
  },
];

// Initial Audit Logs for RBAC
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-17 19:42:10',
    user: 'Farhana Rahman',
    userName: 'Farhana Rahman',
    userRole: 'finance',
    action: 'Exported Financial Audit CSV',
    details: 'Generated full tax-deductible expense report with normalized BDT rates.',
    category: 'billing',
    type: 'billing',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-17 18:15:33',
    user: 'Tanvir Ahmed',
    userName: 'Tanvir Ahmed',
    userRole: 'support',
    action: 'Triggered Dunning Retry',
    details: 'Manually re-queued payment confirmation email for Netflix family tier.',
    category: 'email',
    type: 'email',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-17 15:30:00',
    user: 'Sazzad Hossain',
    userName: 'Sazzad Hossain',
    userRole: 'admin',
    action: 'Configured Live Exchange API',
    details: 'Updated base currency conversion feeds for BDT to USD/EUR/GBP/INR.',
    category: 'security',
    type: 'security',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-17 12:10:45',
    user: 'Nadia Islam',
    userName: 'Nadia Islam',
    userRole: 'sales',
    action: 'Generated Hosted Checkout Link',
    details: 'Created customer onboarding portal for Pro Business Subscription Tier.',
    category: 'user',
    type: 'user',
  },
];
