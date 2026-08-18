import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, normalizeToMonthly, normalizeToYearly } from '../utils/calculations';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ServiceIcon } from './ServiceIcon';
import { TrendingUp, PieChart as PieIcon, BarChart3, AlertCircle, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';

export const VisualAnalytics: React.FC = () => {
  const { subscriptions, stats, currency, darkMode } = useSubscriptions();

  const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');

  // Category data for Pie Chart
  const categoryData = stats.categoryTotals.map(item => ({
    name: item.category,
    value: Number(item.monthlyCost.toFixed(2)),
    count: item.count,
    color: item.color || '#6366F1',
    percentage: item.percentage,
  }));

  // Top 5 Subscriptions by monthly cost
  const topSubscriptions = [...activeSubs]
    .map(s => ({
      ...s,
      monthly: normalizeToMonthly(s.cost, s.billingCycle),
    }))
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 5);

  // Billing cycle distribution
  const cycleCounts: Record<string, { count: number; totalMonthly: number }> = {
    monthly: { count: 0, totalMonthly: 0 },
    yearly: { count: 0, totalMonthly: 0 },
    quarterly: { count: 0, totalMonthly: 0 },
    weekly: { count: 0, totalMonthly: 0 },
  };

  activeSubs.forEach(s => {
    const cycle = s.billingCycle || 'monthly';
    if (!cycleCounts[cycle]) {
      cycleCounts[cycle] = { count: 0, totalMonthly: 0 };
    }
    cycleCounts[cycle].count += 1;
    cycleCounts[cycle].totalMonthly += normalizeToMonthly(s.cost, s.billingCycle);
  });

  const cycleData = Object.entries(cycleCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([cycle, data]) => ({
      name: cycle.charAt(0).toUpperCase() + cycle.slice(1),
      count: data.count,
      totalMonthly: Number(data.totalMonthly.toFixed(2)),
    }));

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md text-xs">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{data.name || data.payload?.month}</p>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1">
            Spend: <span className="font-bold">{formatCurrency(data.value, currency)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-section" className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-3">
            <TrendingUp size={14} />
            <span>Smart Spending Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Visual Spending Breakdown
          </h2>
          <p className="text-white/80 text-sm sm:text-base mt-2">
            You are actively tracking <span className="font-bold text-white">{activeSubs.length} services</span> totaling{' '}
            <span className="font-bold text-white">{formatCurrency(stats.totalMonthlySpend, currency)}/month</span> ({formatCurrency(stats.totalYearlySpend, currency)}/year).
          </p>
        </div>
      </div>


      {/* Grid of secondary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Donut + Progress) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <PieIcon size={18} className="text-blue-500" />
                Expenses by Category
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Monthly distribution across service types
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-500">
              {stats.categoryTotals.length} Categories
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={customTooltip} />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-neutral-400">No active subscription data to display</div>
            )}
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {stats.categoryTotals.map(item => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {item.category}
                    </span>
                    <span className="text-neutral-400">({item.count})</span>
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.monthlyCost, currency)}
                    <span className="text-neutral-400 font-normal ml-1">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Cycle breakdown */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-500" />
                  Billing Cycles & Commitment Split
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Normalized monthly cost breakdown by payment rhythm
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {cycleData.map(c => (
                <div
                  key={c.name}
                  className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-1"
                >
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {c.name} Frequency
                  </div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white">
                    {c.count} service{c.count > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(c.totalMonthly, currency)}/mo normalized
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Most Expensive Subscriptions */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
            Top 5 Highest Expenses
          </h3>
          <span className="text-xs text-neutral-500 font-medium">Ranked by monthly impact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSubscriptions.map((sub, idx) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-neutral-400 w-4 text-center">
                  #{idx + 1}
                </span>
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
                    {sub.category}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-neutral-900 dark:text-white text-sm">
                  {formatCurrency(sub.monthly, currency)}
                  <span className="text-xs font-normal text-neutral-400">/mo</span>
                </div>
                <div className="text-[11px] text-neutral-400 capitalize">
                  {sub.billingCycle} ({formatCurrency(sub.cost, currency)})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
