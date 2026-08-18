import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  LayoutGrid,
  CreditCard,
  Wallet,
  BarChart3,
  Users,
  FileText,
  Settings,
} from 'lucide-react';

interface TruvaSidebarProps {
  sidebarCollapsed: boolean;
}

export const TruvaSidebar: React.FC<TruvaSidebarProps> = ({
  sidebarCollapsed,
}) => {
  const { activeTab, setActiveTab, subscriptions } = useSubscriptions();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} />, badge: subscriptions.length },
    { id: 'payment', label: 'Payment', icon: <Wallet size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`shrink-0 flex flex-col justify-between transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-56 lg:w-60'
      }`}
    >
      {/* Navigation List */}
      <div className="space-y-1.5 py-4">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>

              {!sidebarCollapsed && item.badge !== undefined && !isActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
