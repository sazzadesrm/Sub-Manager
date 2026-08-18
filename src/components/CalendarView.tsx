import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types';
import { ServiceIcon } from './ServiceIcon';
import { formatCurrency, getDaysUntil, formatDaysRemaining } from '../utils/calculations';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { subscriptions, currency, markSubscriptionPaid } = useSubscriptions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.toISOString().split('T')[0]);
  };

  // Map subscriptions to date keys "YYYY-MM-DD"
  const subscriptionsByDate: Record<string, Subscription[]> = {};
  subscriptions
    .filter(s => s.status === 'active' || s.status === 'trial')
    .forEach(sub => {
      const dateKey = sub.nextRenewalDate;
      if (!subscriptionsByDate[dateKey]) {
        subscriptionsByDate[dateKey] = [];
      }
      subscriptionsByDate[dateKey].push(sub);
    });

  // Calculate total outflow this month
  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  let thisMonthTotal = 0;
  let thisMonthCount = 0;

  Object.entries(subscriptionsByDate).forEach(([dateStr, subs]) => {
    if (dateStr.startsWith(currentMonthStr)) {
      subs.forEach(s => {
        thisMonthTotal += s.cost;
        thisMonthCount += 1;
      });
    }
  });

  // Calendar cells
  const calendarCells = [];

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({
      dayNum,
      isCurrentMonth: false,
      dateStr,
      subs: subscriptionsByDate[dateStr] || [],
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNum: d,
      isCurrentMonth: true,
      dateStr,
      subs: subscriptionsByDate[dateStr] || [],
    });
  }

  // Next month padding days to complete 35 or 42 grid
  const remainingCells = 35 - calendarCells.length >= 0 ? 35 - calendarCells.length : 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNum: d,
      isCurrentMonth: false,
      dateStr,
      subs: subscriptionsByDate[dateStr] || [],
    });
  }

  const selectedSubs = selectedDay ? subscriptionsByDate[selectedDay] || [] : [];
  const selectedDayTotal = selectedSubs.reduce((acc, s) => acc + s.cost, 0);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div id="calendar-view-container" className="space-y-6">
      {/* Calendar Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 sm:p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {thisMonthCount} renewal{thisMonthCount !== 1 ? 's' : ''} scheduled •{' '}
              <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                {formatCurrency(thisMonthTotal, currency)}
              </span>{' '}
              total outflow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid and Selected Details Side-by-Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The 7-Day Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-5 shadow-xs">
          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((cell, idx) => {
              const isSelected = selectedDay === cell.dateStr;
              const isToday = cell.dateStr === todayStr;
              const hasSubs = cell.subs.length > 0;
              const dayCost = cell.subs.reduce((a, b) => a + b.cost, 0);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(cell.dateStr)}
                  className={`min-h-[64px] sm:min-h-[78px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : isToday
                      ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30'
                      : 'border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50'
                  } ${!cell.isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-[11px]'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {hasSubs && (
                      <span className="text-[10px] font-bold text-neutral-900 dark:text-white hidden sm:inline">
                        {formatCurrency(dayCost, currency)}
                      </span>
                    )}
                  </div>

                  {/* Badges/Dots for subscriptions */}
                  <div className="mt-1 space-y-1">
                    {cell.subs.slice(0, 2).map(sub => (
                      <div
                        key={sub.id}
                        className="text-[10px] truncate px-1.5 py-0.5 rounded-md font-semibold text-white shadow-xs flex items-center gap-1"
                        style={{ backgroundColor: sub.color }}
                      >
                        <span className="truncate">{sub.name}</span>
                      </div>
                    ))}
                    {cell.subs.length > 2 && (
                      <div className="text-[9px] font-bold text-neutral-500 text-center">
                        +{cell.subs.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Schedule for
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                {selectedDay ? new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date'}
              </h3>
              {selectedSubs.length > 0 && (
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Total outflow:{' '}
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(selectedDayTotal, currency)}
                  </span>
                </div>
              )}
            </div>

            {selectedSubs.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-xs">
                <CalendarIcon size={32} className="mx-auto mb-2 opacity-40" />
                <p>No subscriptions renewing on this day.</p>
                <p className="mt-1 text-[11px]">Click on any highlighted calendar cell to inspect scheduled charges.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {selectedSubs.map(sub => {
                  const daysUntil = getDaysUntil(sub.nextRenewalDate);
                  const { text: daysText } = formatDaysRemaining(daysUntil);

                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <ServiceIcon
                            name={sub.name}
                            category={sub.category}
                            iconName={sub.iconName}
                            color={sub.color}
                            size="sm"
                          />
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                              {sub.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                              {sub.category} • {sub.billingCycle}
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-bold text-neutral-900 dark:text-white text-sm">
                          {formatCurrency(sub.cost, sub.currency || currency)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 text-xs">
                        <span className="text-neutral-500 text-[11px]">{daysText}</span>
                        <button
                          onClick={() => markSubscriptionPaid(sub.id)}
                          className="px-2.5 py-1 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 rounded-lg font-medium text-[11px] flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                        >
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          Mark Paid (+1 cycle)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>📅 Auto-updates based on billing cycle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
