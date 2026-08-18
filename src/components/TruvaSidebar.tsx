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
  Crown
} from 'lucide-react';

interface TruvaSidebarProps {
  sidebarCollapsed: boolean;
  onOpenUpgrade: () => void;
}

export const TruvaSidebar: React.FC<TruvaSidebarProps> = ({
  sidebarCollapsed,
  onOpenUpgrade,
}) => {
  const { activeTab, setActiveTab, subscriptions } = useSubscriptions();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} />, badge: subscriptions.length },
    { id: 'payment', label: 'Payment', icon: <Wallet size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'customer', label: 'Customer', icon: <Users size={18} /> },
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

      {/* Bottom "Upgrade Pro" Card from mockup */}
      {!sidebarCollapsed ? (
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-2 mt-auto mb-4">
          <div className="font-bold text-xs text-neutral-900 dark:text-white">
            Upgrade Pro
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
            Monthly revenue trend overlaid with churn percentage
          </p>
          <button
            onClick={onOpenUpgrade}
            className="w-full mt-2 py-2 px-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <Crown size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Upgrade</span>
          </button>
        </div>
      ) : (
        <div className="p-2 mb-4 flex justify-center">
          <button
            onClick={onOpenUpgrade}
            className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            title="Upgrade Pro"
          >
            <Crown size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};
