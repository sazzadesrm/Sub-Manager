import React, { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './context/SubscriptionContext';
import { TruvaHeader } from './components/TruvaHeader';
import { TruvaSidebar } from './components/TruvaSidebar';
import { TruvaDashboard } from './components/TruvaDashboard';
import { MunemindDashboard } from './components/MunemindDashboard';
import { MunemindSidebar } from './components/MunemindSidebar';
import { AuthScreen } from './components/AuthScreen';
import { SubscriptionTable } from './components/SubscriptionTable';
import { SubscriptionCard } from './components/SubscriptionCard';
import { PaymentView } from './components/PaymentView';
import { VisualAnalytics } from './components/VisualAnalytics';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { CalendarView } from './components/CalendarView';
import { BudgetForecast } from './components/BudgetForecast';
import { OptimizationAudit } from './components/OptimizationAudit';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { ProfileCustomizationModal } from './components/ProfileCustomizationModal';
import { CATEGORIES } from './data/subscriptionsData';
import { SubscriptionCategory, SubscriptionStatus } from './types';
import {
  Plus,
  Search,
  Table,
  LayoutGrid,
  Download,
  Filter,
  Sparkles
} from 'lucide-react';

function AppContent() {
  const {
    isAuthenticated,
    isAuthLoading,
    currentUser,
    subscriptions,
    activeTab,
    setActiveTab,
    viewMode,
    darkMode,
    theme,
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
    exportCSV,
    setIsModalOpen,
    setEditingSubscription,
  } = useSubscriptions();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayLayout, setDisplayLayout] = useState<'table' | 'grid'>('table');

  // If user is not authenticated, display the Auth Screen
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.notes && sub.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.tags && sub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'trial' ? sub.isTrial || sub.status === 'trial' : sub.status === selectedStatus);
    const matchesTag =
      selectedTag === 'All' ||
      (sub.tags && sub.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesStatus && matchesTag;
  });

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'cost') {
      return sortDirection === 'asc' ? a.cost - b.cost : b.cost - a.cost;
    }
    if (sortBy === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    const dateA = new Date(a.nextRenewalDate).getTime();
    const dateB = new Date(b.nextRenewalDate).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (theme === 'munemind') {
          return <MunemindDashboard onNavigateTab={tab => setActiveTab(tab as any)} />;
        }
        return (
          <TruvaDashboard
            onNavigateTab={tab => setActiveTab(tab)}
          />
        );

      case 'subscriptions':
        return (
          <div className="space-y-5">
            {/* Subscriptions Header & Filters Bar */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                    Subscriptions ({filteredSubscriptions.length})
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Manage contracts, daily costs, renewal schedules, and custom tag classifications
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Table vs Grid toggle */}
                  <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                      onClick={() => setDisplayLayout('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        displayLayout === 'table' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-400'
                      }`}
                      title="Table View"
                    >
                      <Table size={15} />
                    </button>
                    <button
                      onClick={() => setDisplayLayout('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        displayLayout === 'grid' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs' : 'text-neutral-400'
                      }`}
                      title="Grid Cards"
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>

                  <button
                    onClick={exportCSV}
                    className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>

                  <button
                    onClick={() => {
                      setEditingSubscription(null);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add Subscription
                  </button>
                </div>
              </div>

              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search name, notes, #tag..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {(['All', 'active', 'trial', 'paused'] as (SubscriptionStatus | 'All')[]).map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                        selectedStatus === status
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as SubscriptionCategory | 'All')}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List or Grid */}
            {sortedSubscriptions.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-12 text-center text-neutral-400">
                <Search size={32} className="mx-auto mb-2 opacity-40" />
                <p className="font-bold text-neutral-700 dark:text-neutral-300 text-sm">
                  {subscriptions.length === 0 ? 'No subscriptions added yet' : 'No subscriptions match your filter'}
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  {subscriptions.length === 0
                    ? 'Click "Add Subscription" to register your first active tool, contract, or recurring service.'
                    : 'Try resetting your search query or selected category.'}
                </p>
                {subscriptions.length === 0 && (
                  <button
                    onClick={() => {
                      setEditingSubscription(null);
                      setIsModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Add First Subscription
                  </button>
                )}
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

      case 'payment':
        return <PaymentView />;

      case 'analytics':
        return (
          <div className="space-y-6">
            <VisualAnalytics />
            <BudgetForecast />
          </div>
        );

      case 'reports':
        return <ReportsView />;

      case 'settings':
        return <SettingsView />;

      case 'calendar':
        return <CalendarView />;

      case 'forecast':
        return <BudgetForecast />;

      case 'audit':
        return <OptimizationAudit />;

      default:
        if (theme === 'munemind') {
          return <MunemindDashboard onNavigateTab={tab => setActiveTab(tab as any)} />;
        }
        return (
          <TruvaDashboard
            onNavigateTab={tab => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-[#F8FAFC] text-neutral-900'} transition-colors font-sans antialiased`}>
      {/* Top Navbar */}
      <TruvaHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Main Container */}
      {viewMode === 'android' ? (
        <main className="py-6">
          <AndroidFrame>
            {renderActiveView()}
          </AndroidFrame>
        </main>
      ) : (
        <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 flex gap-6 min-h-[calc(100vh-65px)]">
          {/* Left Sidebar according to theme preset */}
          <div className="hidden md:flex">
            {theme === 'munemind' ? (
              <MunemindSidebar collapsed={sidebarCollapsed} />
            ) : (
              <TruvaSidebar
                sidebarCollapsed={sidebarCollapsed}
              />
            )}
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 pb-16 md:pb-6">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation for handheld devices */}
      {viewMode !== 'android' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <AndroidBottomNav />
        </div>
      )}

      {/* Subscription Modal for Add / Edit */}
      <SubscriptionModal />

      {/* Profile & Account Customization Modal */}
      <ProfileCustomizationModal />
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
