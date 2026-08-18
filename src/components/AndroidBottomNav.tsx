import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { AppTab } from '../types';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  PieChart,
  Users,
  FileText,
  Settings,
  User,
  LogOut,
  Shield,
  X
} from 'lucide-react';

interface AndroidBottomNavProps {
  className?: string;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({ className = '' }) => {
  const { activeTab, setActiveTab, alerts, currentUser, signOut, setIsProfileModalOpen } = useSubscriptions();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard size={18} />,
      badge: alerts.length > 0 ? alerts.length : undefined,
    },
    {
      id: 'subscriptions',
      label: 'Subs',
      icon: <CreditCard size={18} />,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <Wallet size={18} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <PieChart size={18} />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText size={18} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <>
      <nav
        id="android-bottom-nav"
        className={`bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800 px-1 py-1.5 flex items-center overflow-x-auto no-scrollbar gap-0.5 z-30 select-none ${className}`}
      >
        {navItems.map(item => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`android-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center min-w-[48px] flex-1 py-1 transition-all group relative focus:outline-none shrink-0 cursor-pointer"
            >
              {/* Active Pill Indicator (Material 3 Style) */}
              <div
                className={`px-2.5 py-1 rounded-full transition-all duration-200 relative flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                }`}
              >
                {item.icon}

                {/* Notification badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] mt-0.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'font-bold text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Account Tab button */}
        <button
          onClick={() => setIsAccountModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[48px] flex-1 py-1 transition-all group relative focus:outline-none shrink-0 cursor-pointer"
          title="Account Profile"
        >
          <div className="px-2.5 py-1 rounded-full text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200">
            <User size={18} />
          </div>
          <span className="text-[9px] mt-0.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            Account
          </span>
        </button>
      </nav>

      {/* Account Dropdown Modal Sheet */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-sm p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                User Account
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center gap-3">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {currentUser?.email || ''}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-bold uppercase">
                  <Shield size={9} />
                  <span>{currentUser?.role || 'Owner'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <User size={15} />
                <span>Customize Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  signOut();
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={15} />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
