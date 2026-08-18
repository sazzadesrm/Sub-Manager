import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { AndroidBottomNav } from './AndroidBottomNav';
import { Plus, Wifi, Battery, Signal, Bell, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { setIsModalOpen, setEditingSubscription, darkMode, setDarkMode, alerts } = useSubscriptions();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="flex justify-center items-center py-4 px-2">
      <div className="relative w-full max-w-[412px] h-[860px] max-h-[92vh] bg-neutral-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-neutral-800 flex flex-col overflow-hidden">
        {/* Device Outer Shell */}
        <div className="relative w-full h-full bg-neutral-50 dark:bg-neutral-950 rounded-[36px] overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800">
          
          {/* Android Status Bar */}
          <div className="h-7 px-6 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-xs flex items-center justify-between text-neutral-800 dark:text-neutral-200 text-xs font-semibold select-none z-20 shrink-0">
            <span>{currentTime}</span>

            {/* Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 dark:bg-black ring-1 ring-neutral-800 mx-auto" />

            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={13} className="text-neutral-800 dark:text-neutral-200" />
            </div>
          </div>

          {/* Android Top App Bar (Material Design 3) */}
          <div className="px-4 py-2.5 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-xs border-b border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                S
              </div>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                SubManager
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDarkMode(prev => !prev)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-full transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          {/* Scrollable Android Screen Content */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 relative">
            {children}
          </div>

          {/* Floating Action Button (FAB - Material Design 3) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="android-fab-add"
            onClick={() => {
              setEditingSubscription(null);
              setIsModalOpen(true);
            }}
            className="absolute right-5 bottom-20 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/40 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            aria-label="Add Subscription"
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.button>

          {/* Bottom Navigation */}
          <AndroidBottomNav className="shrink-0" />
        </div>
      </div>
    </div>
  );
};
