import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Subscription,
  SubscriptionCategory,
  SubscriptionStatus,
  RenewalAlert,
  ViewMode,
  AppTab,
  BillingCycle,
  TeamMember,
  UserRole,
  AutomatedEmailTemplate,
  AuditLogEntry,
  UsageFrequency,
} from '../types';
import {
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
  COMMON_TAGS,
} from '../data/subscriptionsData';
import {
  normalizeToDaily,
  normalizeToMonthly,
  normalizeToYearly,
  generateAlerts,
  getDaysUntil,
  exportSubscriptionsToCSV,
  exportSubscriptionsToJSON,
} from '../utils/calculations';
import { fetchLiveExchangeRates, convertFromBDT } from '../services/currencyService';
import {
  getNotificationPermission,
  requestNotificationPermission,
  checkAndNotify24hRenewals,
  triggerTestNotification,
  getNotificationSupport,
} from '../services/notificationService';
import { authService, AuthUser } from '../services/authService';
import confetti from 'canvas-confetti';

export type AppTheme = 'munemind' | 'truva' | 'emerald' | 'ocean';

interface SubscriptionContextType {
  // Authentication & User State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signIn: (email: string, pass: string) => Promise<AuthUser>;
  signUp: (name: string, email: string, pass: string) => Promise<AuthUser>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<{ code: string; message: string }>;
  resetPassword: (email: string, code: string, newPass: string) => Promise<boolean>;

  // Subscriptions dataset (Isolated per user)
  subscriptions: Subscription[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  currency: string;
  setCurrency: (code: string) => void;
  
  // Real-time Exchange Rates
  exchangeRates: Record<string, number>;
  ratesLastUpdated: string;
  isRatesLoading: boolean;
  refreshExchangeRates: () => Promise<void>;
  convertSpend: (amountBDT: number, targetCurrency: string) => number;

  // Browser Push Notifications
  notificationPermission: NotificationPermission;
  isNotificationSupported: boolean;
  requestNotifications: () => Promise<NotificationPermission>;
  sendTestNotification: () => boolean;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: SubscriptionCategory | 'All';
  setSelectedCategory: (cat: SubscriptionCategory | 'All') => void;
  selectedStatus: SubscriptionStatus | 'All';
  setSelectedStatus: (status: SubscriptionStatus | 'All') => void;
  selectedTag: string | 'All';
  setSelectedTag: (tag: string | 'All') => void;
  availableTags: string[];
  sortBy: 'cost' | 'renewal' | 'name';
  setSortBy: (sort: 'cost' | 'renewal' | 'name') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (dir: 'asc' | 'desc') => void;

  // Alerts
  alerts: RenewalAlert[];
  dismissedAlertIds: string[];
  dismissAlert: (id: string) => void;

  // CRUD Operations
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  togglePauseSubscription: (id: string) => void;
  markSubscriptionPaid: (id: string) => void;
  resetToSampleData: () => void;
  importSubscriptions: (data: Subscription[]) => boolean;
  exportCSV: () => void;
  exportJSON: () => void;

  // Selected subscription for detail/edit modal
  editingSubscription: Subscription | null;
  setEditingSubscription: (sub: Subscription | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  // RBAC & Team
  teamMembers: TeamMember[];
  inviteTeamMember: (name: string, email: string, role: UserRole) => void;
  updateTeamMemberRole: (id: string, newRole: UserRole) => void;
  removeTeamMember: (id: string) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string, type: AuditLogEntry['type']) => void;

  // Automated Emails
  emailTemplates: AutomatedEmailTemplate[];
  updateEmailTemplate: (id: string, updated: Partial<AutomatedEmailTemplate>) => void;
  sendEmailSimulation: (templateId: string, customRecipient?: string) => boolean;

  // Aggregated Stats
  stats: {
    totalMonthlySpend: number;
    totalDailySpend: number;
    totalYearlySpend: number;
    activeCount: number;
    pausedCount: number;
    trialCount: number;
    upcomingNext7DaysCount: number;
    upcomingNext7DaysCost: number;
    nextImmediateRenewal: { name: string; date: string; days: number; cost: number } | null;
    highestCostSub: Subscription | null;
    categoryTotals: { category: SubscriptionCategory; monthlyCost: number; count: number; percentage: number; color: string }[];
    lowUsageCount: number;
    potentialWasteSavings: number;
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const GLOBAL_SETTINGS_KEY = 'submanager_global_settings_v3';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Settings State
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_SETTINGS_KEY);
      if (saved) return JSON.parse(saved).theme || 'munemind';
    } catch {}
    return 'munemind';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_SETTINGS_KEY);
      if (saved) return JSON.parse(saved).darkMode ?? false;
    } catch {}
    return false;
  });
  const [currency, setCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_SETTINGS_KEY);
      if (saved) return JSON.parse(saved).currency ?? 'BDT';
    } catch {}
    return 'BDT';
  });

  // User-isolated Subscriptions State
  const getUserSubsStorageKey = (userId: string) => `submanager_user_${userId}_subs_v3`;
  const getUserTeamStorageKey = (userId: string) => `submanager_user_${userId}_team_v3`;
  const getUserLogsStorageKey = (userId: string) => `submanager_user_${userId}_logs_v3`;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    try {
      const userKey = `submanager_user_${user.id}_subs_v3`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        return JSON.parse(saved);
      }
      // Demo accounts seed initial dataset on first visit
      if (user.email === 'sazzadmbstu@gmail.com' || user.email === 'john@sublytics.io') {
        localStorage.setItem(userKey, JSON.stringify(INITIAL_SUBSCRIPTIONS));
        return INITIAL_SUBSCRIPTIONS;
      }
    } catch {}
    return [];
  });

  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // RBAC & Team state (User scoped)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    try {
      const key = `submanager_user_${user.id}_team_v3`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEAM_MEMBERS;
  });

  // Automated Email Templates
  const [emailTemplates, setEmailTemplates] = useState<AutomatedEmailTemplate[]>(INITIAL_EMAIL_TEMPLATES);

  // Audit Logs (User scoped)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    try {
      const key = `submanager_user_${user.id}_logs_v3`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  // Exchange Rates State
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    BDT: 1,
    USD: 0.0083,
    EUR: 0.0077,
    GBP: 0.0066,
    INR: 0.72,
    CAD: 0.0116,
    AUD: 0.0128,
    JPY: 1.28,
  });
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>('Live sync');
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(false);

  // Notification State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return getNotificationPermission();
  });
  const isNotificationSupported = getNotificationSupport();

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<'cost' | 'renewal' | 'name'>('renewal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal edit/add state
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load user data whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setSubscriptions([]);
      setTeamMembers([]);
      setAuditLogs([]);
      return;
    }

    try {
      const subsKey = getUserSubsStorageKey(currentUser.id);
      const teamKey = getUserTeamStorageKey(currentUser.id);
      const logsKey = getUserLogsStorageKey(currentUser.id);

      const savedSubs = localStorage.getItem(subsKey);
      if (savedSubs) {
        setSubscriptions(JSON.parse(savedSubs));
      } else if (currentUser.email === 'sazzadmbstu@gmail.com' || currentUser.email === 'john@sublytics.io') {
        // Pre-fill demo data for demo users
        localStorage.setItem(subsKey, JSON.stringify(INITIAL_SUBSCRIPTIONS));
        setSubscriptions(INITIAL_SUBSCRIPTIONS);
      } else {
        // New users ALWAYS start completely empty
        localStorage.setItem(subsKey, JSON.stringify([]));
        setSubscriptions([]);
      }

      const savedTeam = localStorage.getItem(teamKey);
      setTeamMembers(savedTeam ? JSON.parse(savedTeam) : INITIAL_TEAM_MEMBERS);

      const savedLogs = localStorage.getItem(logsKey);
      setAuditLogs(savedLogs ? JSON.parse(savedLogs) : INITIAL_AUDIT_LOGS);
    } catch (e) {
      console.error('Error loading user-scoped data', e);
    }
  }, [currentUser?.id]);

  // Persist subscriptions scoped to current user ID
  useEffect(() => {
    if (!currentUser) return;
    try {
      const subsKey = getUserSubsStorageKey(currentUser.id);
      localStorage.setItem(subsKey, JSON.stringify(subscriptions));
    } catch (e) {
      console.error('Error saving subscriptions', e);
    }
  }, [subscriptions, currentUser?.id]);

  // Persist team & logs scoped to current user ID
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(getUserTeamStorageKey(currentUser.id), JSON.stringify(teamMembers));
    } catch {}
  }, [teamMembers, currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(getUserLogsStorageKey(currentUser.id), JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs, currentUser?.id]);

  // Persist global settings (theme, darkMode, currency)
  useEffect(() => {
    try {
      localStorage.setItem(
        GLOBAL_SETTINGS_KEY,
        JSON.stringify({ darkMode, currency, theme })
      );
    } catch (e) {
      console.error('Error saving settings', e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, currency, theme]);

  // Auth Operations
  const signIn = async (emailInput: string, passInput: string): Promise<AuthUser> => {
    setIsAuthLoading(true);
    try {
      const user = await authService.signIn(emailInput, passInput);
      setCurrentUser(user);
      return user;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signUp = async (nameInput: string, emailInput: string, passInput: string): Promise<AuthUser> => {
    setIsAuthLoading(true);
    try {
      const user = await authService.signUp(nameInput, emailInput, passInput);
      // New user begins in completely empty state
      setSubscriptions([]);
      setCurrentUser(user);
      return user;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOut = () => {
    authService.signOut();
    setCurrentUser(null);
    setSubscriptions([]);
    setAuditLogs([]);
    setActiveTab('dashboard');
  };

  const forgotPassword = async (emailInput: string) => {
    return authService.requestPasswordReset(emailInput);
  };

  const resetPassword = async (emailInput: string, codeInput: string, newPassInput: string) => {
    return authService.completePasswordReset(emailInput, codeInput, newPassInput);
  };

  // Extract all distinct tags from subscriptions
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>(COMMON_TAGS);
    subscriptions.forEach(sub => {
      sub.tags?.forEach(tag => tagSet.add(tag.trim()));
    });
    return Array.from(tagSet).filter(Boolean);
  }, [subscriptions]);

  // Fetch live exchange rates
  const refreshExchangeRates = useCallback(async () => {
    setIsRatesLoading(true);
    try {
      const result = await fetchLiveExchangeRates('BDT');
      setExchangeRates(result.rates);
      setRatesLastUpdated(result.lastUpdated);
    } catch (err) {
      console.warn('Failed to load exchange rates', err);
    } finally {
      setIsRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExchangeRates();
    const interval = setInterval(refreshExchangeRates, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [refreshExchangeRates]);

  // Push notifications checking
  useEffect(() => {
    if (notificationPermission === 'granted' && subscriptions.length > 0) {
      checkAndNotify24hRenewals(subscriptions, currency);
    }
    const timer = setInterval(() => {
      if (getNotificationPermission() === 'granted' && subscriptions.length > 0) {
        checkAndNotify24hRenewals(subscriptions, currency);
      }
    }, 1000 * 60 * 15);

    return () => clearInterval(timer);
  }, [subscriptions, currency, notificationPermission]);

  const requestNotifications = async (): Promise<NotificationPermission> => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      triggerTestNotification(currency);
      checkAndNotify24hRenewals(subscriptions, currency);
    }
    return res;
  };

  const sendTestNotification = (): boolean => {
    return triggerTestNotification(currency);
  };

  const convertSpend = (amountBDT: number, targetCurrency: string): number => {
    return convertFromBDT(amountBDT, targetCurrency, exchangeRates);
  };

  // Alerts
  const allAlerts = useMemo(() => generateAlerts(subscriptions), [subscriptions]);
  const activeAlerts = useMemo(
    () => allAlerts.filter(a => !dismissedAlertIds.includes(a.id)),
    [allAlerts, dismissedAlertIds]
  );

  const dismissAlert = (id: string) => {
    setDismissedAlertIds(prev => [...prev, id]);
  };

  const addAuditLog = (action: string, details: string, type: AuditLogEntry['type']) => {
    if (!currentUser) return;
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser.name,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      type,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // CRUD actions
  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setSubscriptions(prev => [newSub, ...prev]);
    addAuditLog('Created Subscription', `Added ${newSub.name} (${newSub.cost} ${newSub.currency})`, 'subscription');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const updateSubscription = (id: string, updated: Partial<Subscription>) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const updatedSub = { ...sub, ...updated };
          addAuditLog('Updated Subscription', `Modified details for ${updatedSub.name}`, 'subscription');
          return updatedSub;
        }
        return sub;
      })
    );
  };

  const deleteSubscription = (id: string) => {
    const target = subscriptions.find(s => s.id === id);
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    if (target) {
      addAuditLog('Deleted Subscription', `Removed ${target.name}`, 'subscription');
    }
  };

  const togglePauseSubscription = (id: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const nextStatus: SubscriptionStatus = sub.status === 'active' ? 'paused' : 'active';
          addAuditLog(
            nextStatus === 'paused' ? 'Paused Subscription' : 'Resumed Subscription',
            `${sub.name} is now ${nextStatus}`,
            'subscription'
          );
          return { ...sub, status: nextStatus };
        }
        return sub;
      })
    );
  };

  const markSubscriptionPaid = (id: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const currentDate = new Date(sub.nextRenewalDate || new Date());
          if (sub.billingCycle === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (sub.billingCycle === 'quarterly') {
            currentDate.setMonth(currentDate.getMonth() + 3);
          } else if (sub.billingCycle === 'yearly') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          const nextDateStr = currentDate.toISOString().split('T')[0];
          addAuditLog('Recorded Renewal Payment', `Advanced renewal cycle for ${sub.name} to ${nextDateStr}`, 'billing');
          return { ...sub, nextRenewalDate: nextDateStr, status: 'active', isTrial: false };
        }
        return sub;
      })
    );
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
  };

  const resetToSampleData = () => {
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setDismissedAlertIds([]);
    addAuditLog('Reset Workspace', 'Restored sample subscriptions dataset', 'security');
  };

  const importSubscriptions = (data: Subscription[]): boolean => {
    if (Array.isArray(data) && data.length > 0 && data[0].name && data[0].cost !== undefined) {
      setSubscriptions(data);
      addAuditLog('Imported Backup', `Imported ${data.length} subscription records`, 'subscription');
      return true;
    }
    return false;
  };

  const exportCSV = () => {
    exportSubscriptionsToCSV(subscriptions);
    addAuditLog('Exported CSV Statement', 'Downloaded subscriptions spreadsheet', 'billing');
  };

  const exportJSON = () => {
    exportSubscriptionsToJSON(subscriptions);
    addAuditLog('Exported JSON Backup', 'Generated full application snapshot', 'security');
  };

  // Team & RBAC operations
  const inviteTeamMember = (name: string, email: string, role: UserRole) => {
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces`,
      status: 'active',
      lastActive: 'Invited just now',
      permissions: {
        canManageBilling: role === 'owner' || role === 'finance',
        canExportReports: role === 'owner' || role === 'finance' || role === 'support',
        canEditSubscriptions: role === 'owner' || role === 'finance',
        canAccessCheckout: role === 'owner' || role === 'sales',
        canSendEmails: role === 'owner' || role === 'finance' || role === 'support',
        canManageUsers: role === 'owner',
      },
    };
    setTeamMembers(prev => [...prev, newMember]);
    addAuditLog('Invited Team Member', `Added ${name} with ${role.toUpperCase()} role`, 'user');
    confetti({ particleCount: 30, spread: 50 });
  };

  const updateTeamMemberRole = (id: string, newRole: UserRole) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          addAuditLog('Updated Member Role', `Changed ${m.name}'s role to ${newRole.toUpperCase()}`, 'user');
          return {
            ...m,
            role: newRole,
            permissions: {
              canManageBilling: newRole === 'owner' || newRole === 'finance',
              canExportReports: newRole === 'owner' || newRole === 'finance' || newRole === 'support',
              canEditSubscriptions: newRole === 'owner' || newRole === 'finance',
              canAccessCheckout: newRole === 'owner' || newRole === 'sales',
              canSendEmails: newRole === 'owner' || newRole === 'finance' || newRole === 'support',
              canManageUsers: newRole === 'owner',
            },
          };
        }
        return m;
      })
    );
  };

  const removeTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    if (member && member.role !== 'owner') {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      addAuditLog('Removed Team Member', `Revoked access for ${member.name}`, 'user');
    }
  };

  // Automated Email management
  const updateEmailTemplate = (id: string, updated: Partial<AutomatedEmailTemplate>) => {
    setEmailTemplates(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updated } : t))
    );
    addAuditLog('Updated Email Template', `Modified template #${id}`, 'email');
  };

  const sendEmailSimulation = (templateId: string, customRecipient?: string): boolean => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (!template) return false;

    setEmailTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, lastSentCount: (t.lastSentCount || 0) + 1 } : t))
    );
    addAuditLog(
      'Dispatched Automated Email',
      `Sent "${template.name}" to ${customRecipient || 'customer@example.com'}`,
      'email'
    );
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    return true;
  };

  // Stats calculation
  const stats = useMemo(() => {
    let totalMonthlySpend = 0;
    let totalDailySpend = 0;
    let totalYearlySpend = 0;
    let activeCount = 0;
    let pausedCount = 0;
    let trialCount = 0;
    let upcomingNext7DaysCount = 0;
    let upcomingNext7DaysCost = 0;
    let nextImmediateRenewal: { name: string; date: string; days: number; cost: number } | null = null;
    let highestCostSub: Subscription | null = null;
    let highestMonthly = -1;
    let lowUsageCount = 0;
    let potentialWasteSavings = 0;

    const categoryMap: Record<string, { monthlyCost: number; count: number; color: string }> = {};

    subscriptions.forEach(sub => {
      const isSubActive = sub.status === 'active' || sub.status === 'trial';
      const daily = normalizeToDaily(sub.cost, sub.billingCycle);
      const monthly = normalizeToMonthly(sub.cost, sub.billingCycle);
      const yearly = normalizeToYearly(sub.cost, sub.billingCycle);

      // Low usage detection
      const notesLower = (sub.notes || '').toLowerCase();
      const isLowUsageByNotes =
        notesLower.includes('rarely') ||
        notesLower.includes('unused') ||
        notesLower.includes('dormant') ||
        notesLower.includes('infrequent') ||
        notesLower.includes('cancel');

      const isLowUsage = sub.usageFrequency === 'rarely' || sub.usageFrequency === 'unused' || isLowUsageByNotes;
      if (isLowUsage && isSubActive) {
        lowUsageCount += 1;
        potentialWasteSavings += monthly * 12;
      }

      if (isSubActive) {
        totalDailySpend += daily;
        totalMonthlySpend += monthly;
        totalYearlySpend += yearly;
        activeCount += 1;

        if (monthly > highestMonthly) {
          highestMonthly = monthly;
          highestCostSub = sub;
        }

        // Category breakdown
        if (!categoryMap[sub.category]) {
          categoryMap[sub.category] = { monthlyCost: 0, count: 0, color: sub.color };
        }
        categoryMap[sub.category].monthlyCost += monthly;
        categoryMap[sub.category].count += 1;

        // Days calculation
        const days = getDaysUntil(sub.nextRenewalDate);
        if (days >= 0 && days <= 7) {
          upcomingNext7DaysCount += 1;
          upcomingNext7DaysCost += sub.cost;
        }

        if (days >= 0) {
          if (!nextImmediateRenewal || days < nextImmediateRenewal.days) {
            nextImmediateRenewal = {
              name: sub.name,
              date: sub.nextRenewalDate,
              days,
              cost: sub.cost,
            };
          }
        }
      }

      if (sub.status === 'paused') pausedCount += 1;
      if (sub.status === 'trial') trialCount += 1;
    });

    const categoryTotals = Object.entries(categoryMap).map(([cat, data]) => ({
      category: cat as SubscriptionCategory,
      monthlyCost: data.monthlyCost,
      count: data.count,
      percentage: totalMonthlySpend > 0 ? Math.round((data.monthlyCost / totalMonthlySpend) * 100) : 0,
      color: data.color,
    })).sort((a, b) => b.monthlyCost - a.monthlyCost);

    return {
      totalMonthlySpend,
      totalDailySpend,
      totalYearlySpend,
      activeCount,
      pausedCount,
      trialCount,
      upcomingNext7DaysCount,
      upcomingNext7DaysCost,
      nextImmediateRenewal,
      highestCostSub,
      categoryTotals,
      lowUsageCount,
      potentialWasteSavings,
    };
  }, [subscriptions]);

  return (
    <SubscriptionContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthLoading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        subscriptions,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        theme,
        setTheme,
        currency,
        setCurrency,
        exchangeRates,
        ratesLastUpdated,
        isRatesLoading,
        refreshExchangeRates,
        convertSpend,
        notificationPermission,
        isNotificationSupported,
        requestNotifications,
        sendTestNotification,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        selectedTag,
        setSelectedTag,
        availableTags,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        alerts: activeAlerts,
        dismissedAlertIds,
        dismissAlert,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePauseSubscription,
        markSubscriptionPaid,
        resetToSampleData,
        importSubscriptions,
        exportCSV,
        exportJSON,
        editingSubscription,
        setEditingSubscription,
        isModalOpen,
        setIsModalOpen,
        teamMembers,
        inviteTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
        auditLogs,
        addAuditLog,
        emailTemplates,
        updateEmailTemplate,
        sendEmailSimulation,
        stats,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};
