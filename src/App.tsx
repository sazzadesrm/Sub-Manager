import React, { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './context/SubscriptionContext';
import { RenewalAlertBanner } from './components/RenewalAlertBanner';
import { MetricCards } from './components/MetricCards';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionTable } from './components/SubscriptionTable';
import { VisualAnalytics } from './components/VisualAnalytics';
import { CalendarView } from './components/CalendarView';
import { OptimizationAudit } from './components/OptimizationAudit';
import { SettingsView } from './components/SettingsView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { CATEGORIES } from './data/subscriptionsData';
import { SubscriptionCategory, SubscriptionStatus, AppTab } from './types';
import { formatCurrency } from './utils/calculations';
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  PieChart,
  Sparkles,
  Settings,
  Plus,
  Search,
  SlidersHorizontal,
  Table,
  LayoutGrid,
  Monitor,
  Smartphone,
  Layers,
  Moon,
  Sun,
  Download,
  ShieldCheck,
  Bell,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const {
    subscriptions,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    darkMode,
    setDarkMode,
    currency,
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
    stats,
    alerts,
    exportCSV,
    setIsModalOpen,
    setEditingSubscription,
  } = useSubscriptions();

  const [displayLayout, setDisplayLayout] = useState<'grid' | 'table'>('table');

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.notes && sub.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'trial' ? sub.isTrial || sub.status === 'trial' : sub.status === selectedStatus);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'cost') {
      return sortDirection === 'asc' ? a.cost - b.cost : b.cost - a.cost;
    }
    if (sortBy === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    // 'renewal'
    const dateA = new Date(a.nextRenewalDate).getTime();
    const dateB = new Date(b.nextRenewalDate).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      badge: alerts.length > 0 ? alerts.length : undefined,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: <CreditCard size={18} />,
      badge: subscriptions.length,
    },
    {
      id: 'calendar',
      label: 'Renewal Calendar',
      icon: <Calendar size={18} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Trends',
      icon: <PieChart size={18} />,
    },
    {
      id: 'audit',
      label: 'Smart Savings Audit',
      icon: <Sparkles size={18} />,
    },
    {
      id: 'settings',
      label: 'Settings & Data',
      icon: <Settings size={18} />,
    },
  ];

  // Render the core view for any tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <RenewalAlertBanner />
            <MetricCards />

            {/* Quick Actions & Recent Subscriptions */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                    Active Recurring Services
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Showing next upcoming renewal charges
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All ({subscriptions.length}) &rarr;
                  </button>
                </div>
              </div>

              {/* Grid of recent/upcoming cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {sortedSubscriptions.slice(0, 6).map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} compact />
                ))}
              </div>
            </div>

            {/* Quick visual preview row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VisualAnalytics />
              </div>
              <div>
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2 mb-2">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      Subscription Health
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                      Summary of billing cycles and renewal protection
                    </p>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium">Annual Projections</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{formatCurrency(stats.totalYearlySpend, currency)}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium">Free Trials Active</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{stats.trialCount} trial</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium">Next Charge In 7 Days</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(stats.upcomingNext7DaysCost, currency)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className="mt-4 w-full py-2.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    Run Smart Cost Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-5">
            {/* Header & Controls */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    All Subscriptions ({filteredSubscriptions.length})
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Filter by category, search notes, or inline edit service status
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* View layout toggle (Table vs Grid) */}
                  <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                      onClick={() => setDisplayLayout('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        displayLayout === 'table' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-400'
                      }`}
                      title="Table View"
                    >
                      <Table size={16} />
                    </button>
                    <button
                      onClick={() => setDisplayLayout('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        displayLayout === 'grid' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-400'
                      }`}
                      title="Grid Cards"
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>

                  <button
                    onClick={exportCSV}
                    className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>

                  <button
                    onClick={() => {
                      setEditingSubscription(null);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    Add Service
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search name, category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Status filter tabs */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {(['All', 'active', 'trial', 'paused'] as (SubscriptionStatus | 'All')[]).map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                        selectedStatus === status
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Category dropdown */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as SubscriptionCategory | 'All')}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Table or Grid Display */}
            {sortedSubscriptions.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-12 text-center text-neutral-400">
                <Search size={32} className="mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">No subscriptions match your filter</p>
                <p className="text-xs text-neutral-500 mt-1">Try clearing your search query or category filters.</p>
              </div>
            ) : displayLayout === 'table' ? (
              <SubscriptionTable subscriptions={sortedSubscriptions} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSubscriptions.map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
              </div>
            )}
          </div>
        );

      case 'calendar':
        return <CalendarView />;

      case 'analytics':
        return <VisualAnalytics />;

      case 'audit':
        return <OptimizationAudit />;

      case 'settings':
        return <SettingsView />;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-50/70 text-neutral-900'} transition-colors font-sans antialiased pb-16 lg:pb-0`}>
      
      {/* Top Universal Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
            S
          </div>
          <div>
            <div className="font-extrabold text-neutral-900 dark:text-white text-base tracking-tight leading-tight flex items-center gap-2">
              <span>SubManager</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Web & Android
              </span>
            </div>
          </div>
        </div>

        {/* Global Controls: View Mode Switcher, Dark Mode, Quick Add */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Switcher (Web / Android / Responsive) */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            <button
              onClick={() => setViewMode('responsive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'responsive'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
              title="Responsive Mode"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Auto</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'web'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
              title="Web Desktop Mode"
            >
              <Monitor size={13} />
              <span className="hidden sm:inline">Web</span>
            </button>
            <button
              onClick={() => setViewMode('android')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'android'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
              title="Android Phone Mockup"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Android</span>
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              setEditingSubscription(null);
              setIsModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Subscription</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      {viewMode === 'android' ? (
        /* Render wrapped inside Authentic Android Device Mockup */
        <main className="py-4">
          <AndroidFrame>
            {renderTabContent()}
          </AndroidFrame>
        </main>
      ) : (
        /* Render Standard Responsive & Desktop Layout */
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
          {/* Desktop Left Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-3 shadow-xs">
              <nav className="space-y-1">
                {navItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Summary Card in Sidebar */}
            <div className="hidden lg:block bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5 rounded-3xl shadow-sm border border-neutral-700/50">
              <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Monthly Outflow
              </div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(stats.totalMonthlySpend, currency)}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                {stats.activeCount} active services tracked
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-700/60 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Yearly</span>
                <span className="font-bold">{formatCurrency(stats.totalYearlySpend, currency)}</span>
              </div>
            </div>
          </aside>

          {/* Main View Area */}
          <main className="flex-1 min-w-0">
            {renderTabContent()}
          </main>
        </div>
      )}

      {/* Mobile Sticky Bottom Nav when in responsive mobile viewport */}
      {viewMode !== 'android' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          <AndroidBottomNav />
        </div>
      )}

      {/* Subscription Add / Edit Modal */}
      <SubscriptionModal />
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
