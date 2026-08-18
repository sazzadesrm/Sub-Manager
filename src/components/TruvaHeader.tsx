import React, { useState } from 'react';
import { SubManagerLogo } from './SubManagerLogo';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Layers,
  LogOut,
  User,
  Shield,
  Settings
} from 'lucide-react';

interface TruvaHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const TruvaHeader: React.FC<TruvaHeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
}) => {
  const {
    viewMode,
    setViewMode,
    darkMode,
    setDarkMode,
    searchQuery,
    setSearchQuery,
    alerts,
    currentUser,
    signOut,
    currency,
    setCurrency,
    setIsProfileModalOpen,
    setActiveTab,
  } = useSubscriptions();

  const [selectedView, setSelectedView] = useState('All Products');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const viewsList = ['All Products', 'SaaS Subscriptions', 'Cloud Infrastructure', 'Direct Consumer', 'Trials & Grace'];

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: Brand Logo & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <SubManagerLogo size={34} showText={true} />

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors hidden sm:flex items-center justify-center ml-1 cursor-pointer"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* View Mode Selector (Auto / Web / Android) */}
        <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
          <button
            onClick={() => setViewMode('responsive')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'responsive'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Responsive Layout"
          >
            <Layers size={13} />
            <span className="hidden lg:inline">Auto</span>
          </button>
          <button
            onClick={() => setViewMode('web')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'web'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Web Desktop Mode"
          >
            <Monitor size={13} />
            <span className="hidden lg:inline">Web</span>
          </button>
          <button
            onClick={() => setViewMode('android')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'android'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Android Mockup"
          >
            <Smartphone size={13} />
            <span className="hidden lg:inline">Android</span>
          </button>
        </div>

        {/* "All Products" Filter Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsViewDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <span>{selectedView}</span>
            <ChevronDown size={13} className="text-neutral-400" />
          </button>

          {isViewDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl py-1 z-40 text-xs">
              {viewsList.map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setSelectedView(v);
                    setIsViewDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                    selectedView === v
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-32 sm:w-48 lg:w-60">
          <Search size={14} className="absolute left-3 top-2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Currency Switcher (BDT Default) */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyDropdownOpen(prev => !prev)}
            className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <span>{currency}</span>
            <ChevronDown size={11} className="text-neutral-400" />
          </button>
          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl py-1 z-40 text-xs">
              {['BDT', 'USD', 'EUR', 'GBP', 'INR'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    setIsCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 font-medium cursor-pointer ${
                    currency === c ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-950' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setActiveTab('calendar')}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Notifications & Upcoming Renewals"
          >
            <Bell size={17} />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900" />
            )}
          </button>
        </div>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Account Profile with Profile Customization & Sign Out */}
        <div className="relative pl-1 border-l border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setIsUserDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer"
          >
            <div className="relative">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-neutral-900" />
            </div>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="font-bold text-neutral-900 dark:text-white text-sm truncate">
                  {currentUser?.name || 'Signed In User'}
                </div>
                <div className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                  {currentUser?.email || ''}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                  <Shield size={10} />
                  <span>{currentUser?.role || 'Owner'}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <User size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>Customize Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <Settings size={14} className="text-neutral-400" />
                  <span>System Settings</span>
                </button>

                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
