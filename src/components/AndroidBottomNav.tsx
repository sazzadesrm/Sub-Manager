import React from 'react';
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
  Sparkles
} from 'lucide-react';

interface AndroidBottomNavProps {
  className?: string;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({ className = '' }) => {
  const { activeTab, setActiveTab, alerts } = useSubscriptions();

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard size={19} />,
      badge: alerts.length > 0 ? alerts.length : undefined,
    },
    {
      id: 'subscriptions',
      label: 'Subs',
      icon: <CreditCard size={19} />,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <Wallet size={19} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <PieChart size={19} />,
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: <Users size={19} />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText size={19} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={19} />,
    },
  ];

  return (
    <nav
      id="android-bottom-nav"
      className={`bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800 px-2 py-1.5 flex items-center overflow-x-auto no-scrollbar gap-1 z-30 select-none ${className}`}
    >
      {navItems.map(item => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`android-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center min-w-[54px] flex-1 py-1 transition-all group relative focus:outline-none shrink-0"
          >
            {/* Active Pill Indicator (Material 3 Style) */}
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 relative flex items-center justify-center ${
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
              className={`text-[10px] mt-0.5 transition-colors whitespace-nowrap ${
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
    </nav>
  );
};
