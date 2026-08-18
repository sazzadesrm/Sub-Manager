import React from 'react';
import { SubManagerLogo } from './SubManagerLogo';
import { useSubscriptions } from '../context/SubscriptionContext';
import { AppTab } from '../types';
import {
  LayoutGrid,
  MessageSquare,
  CreditCard,
  BookUser,
  Layers,
  ShoppingBag,
  FileText,
  Send,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Palette
} from 'lucide-react';

interface MunemindSidebarProps {
  collapsed?: boolean;
}

export const MunemindSidebar: React.FC<MunemindSidebarProps> = ({ collapsed = false }) => {
  const {
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    theme,
    setTheme,
    signOut,
    currentUser
  } = useSubscriptions();

  const menuItems: {
    id: AppTab;
    label: string;
    icon: React.ReactNode;
    hasSubmenu?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { id: 'customer', label: 'Discuss', icon: <MessageSquare size={18} />, hasSubmenu: true },
    { id: 'subscriptions', label: 'Subscription', icon: <CreditCard size={18} /> },
    { id: 'customer', label: 'Contact', icon: <BookUser size={18} /> },
    { id: 'analytics', label: 'CRM', icon: <Layers size={18} />, hasSubmenu: true },
    { id: 'payment', label: 'Sales', icon: <ShoppingBag size={18} />, hasSubmenu: true },
    { id: 'reports', label: 'Invoice', icon: <FileText size={18} /> },
    { id: 'emails', label: 'Email Marketing', icon: <Send size={18} />, hasSubmenu: true },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`bg-[#0B1120] text-slate-300 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 border border-slate-800 shadow-xl shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Search */}
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800/80">
          <SubManagerLogo size={32} showText={!collapsed} textColor="text-white" />
        </div>

        {/* Search input in sidebar */}
        {!collapsed && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.hasSubmenu && (
                  <ChevronDown size={14} className="text-slate-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Theme Selector & Light/Dark Switch & User Info */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        {/* Theme preset selector */}
        {!collapsed && (
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-300">Theme</span>
            </div>

            <select
              value={theme}
              onChange={e => setTheme(e.target.value as any)}
              className="bg-slate-800 text-white text-[11px] font-semibold rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="munemind">Munemind (Attachment 1)</option>
              <option value="truva">Truva Modern</option>
              <option value="emerald">Emerald Forest</option>
              <option value="ocean">Ocean Breeze</option>
            </select>
          </div>
        )}

        {/* "Light / Drak" Toggle Switch (Matching Image 1 bottom control) */}
        {!collapsed ? (
          <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400">
            <span>Light</span>
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                darkMode ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
              title="Toggle Dark Mode"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center">
                {darkMode ? <Moon size={10} className="text-indigo-600" /> : <Sun size={10} className="text-amber-500" />}
              </div>
            </button>
            <span>Drak</span>
          </div>
        ) : (
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            title="Toggle Light/Dark"
          >
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        )}

        {/* User Account & Sign Out */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}

            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || ''}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={signOut}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
