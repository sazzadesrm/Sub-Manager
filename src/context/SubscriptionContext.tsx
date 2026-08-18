import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Subscription,
  SubscriptionCategory,
  SubscriptionStatus,
  RenewalAlert,
  ViewMode,
  AppTab,
  BillingCycle,
} from '../types';
import { INITIAL_SUBSCRIPTIONS } from '../data/subscriptionsData';
import {
  normalizeToMonthly,
  normalizeToYearly,
  generateAlerts,
  getDaysUntil,
  exportSubscriptionsToCSV,
  exportSubscriptionsToJSON,
} from '../utils/calculations';
import confetti from 'canvas-confetti';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  currency: string;
  setCurrency: (code: string) => void;
  
  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: SubscriptionCategory | 'All';
  setSelectedCategory: (cat: SubscriptionCategory | 'All') => void;
  selectedStatus: SubscriptionStatus | 'All';
  setSelectedStatus: (status: SubscriptionStatus | 'All') => void;
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

  // Aggregated Stats
  stats: {
    totalMonthlySpend: number;
    totalYearlySpend: number;
    activeCount: number;
    pausedCount: number;
    trialCount: number;
    upcomingNext7DaysCount: number;
    upcomingNext7DaysCost: number;
    nextImmediateRenewal: { name: string; date: string; days: number; cost: number } | null;
    highestCostSub: Subscription | null;
    categoryTotals: { category: SubscriptionCategory; monthlyCost: number; count: number; percentage: number; color: string }[];
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'submanager_subscriptions_v1';
const SETTINGS_KEY = 'submanager_settings_v1';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('responsive');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved).darkMode ?? false;
      }
    } catch {}
    return false;
  });
  const [currency, setCurrency] = useState<string>('USD');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'cost' | 'renewal' | 'name'>('renewal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal edit/add state
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch (e) {
      console.error('Error saving subscriptions', e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ darkMode, currency }));
    } catch (e) {
      console.error('Error saving settings', e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, currency]);

  // Alerts
  const allAlerts = useMemo(() => generateAlerts(subscriptions), [subscriptions]);
  const activeAlerts = useMemo(
    () => allAlerts.filter(a => !dismissedAlertIds.includes(a.id)),
    [allAlerts, dismissedAlertIds]
  );

  const dismissAlert = (id: string) => {
    setDismissedAlertIds(prev => [...prev, id]);
  };

  // CRUD actions
  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setSubscriptions(prev => [newSub, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const updateSubscription = (id: string, updated: Partial<Subscription>) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updated } : sub))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const togglePauseSubscription = (id: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const nextStatus: SubscriptionStatus = sub.status === 'active' ? 'paused' : 'active';
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
          // Increment nextRenewalDate according to billing cycle
          const currentDate = new Date(sub.nextRenewalDate || new Date());
          if (sub.billingCycle === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (sub.billingCycle === 'quarterly') {
            currentDate.setMonth(currentDate.getMonth() + 3);
          } else if (sub.billingCycle === 'yearly') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
          } else {
            // monthly
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          const nextDateStr = currentDate.toISOString().split('T')[0];
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
  };

  const importSubscriptions = (data: Subscription[]): boolean => {
    if (Array.isArray(data) && data.length > 0 && data[0].name && data[0].cost !== undefined) {
      setSubscriptions(data);
      return true;
    }
    return false;
  };

  const exportCSV = () => {
    exportSubscriptionsToCSV(subscriptions);
  };

  const exportJSON = () => {
    exportSubscriptionsToJSON(subscriptions);
  };

  // Stats calculation
  const stats = useMemo(() => {
    let totalMonthlySpend = 0;
    let totalYearlySpend = 0;
    let activeCount = 0;
    let pausedCount = 0;
    let trialCount = 0;
    let upcomingNext7DaysCount = 0;
    let upcomingNext7DaysCost = 0;
    let nextImmediateRenewal: { name: string; date: string; days: number; cost: number } | null = null;
    let highestCostSub: Subscription | null = null;
    let highestMonthly = -1;

    const categoryMap: Record<string, { monthlyCost: number; count: number; color: string }> = {};

    subscriptions.forEach(sub => {
      const isSubActive = sub.status === 'active' || sub.status === 'trial';
      const monthly = normalizeToMonthly(sub.cost, sub.billingCycle);
      const yearly = normalizeToYearly(sub.cost, sub.billingCycle);

      if (isSubActive) {
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
      totalYearlySpend,
      activeCount,
      pausedCount,
      trialCount,
      upcomingNext7DaysCount,
      upcomingNext7DaysCost,
      nextImmediateRenewal,
      highestCostSub,
      categoryTotals,
    };
  }, [subscriptions]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        currency,
        setCurrency,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
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
