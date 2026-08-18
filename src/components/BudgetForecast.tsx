import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, normalizeToMonthly, normalizeToYearly } from '../utils/calculations';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  LineChart as LineChartIcon,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const BudgetForecast: React.FC = () => {
  const { subscriptions, stats, currency, darkMode } = useSubscriptions();

  const [forecastHorizon, setForecastHorizon] = useState<6 | 12>(12);
  const [growthScenario, setGrowthScenario] = useState<'baseline' | 'inflation' | 'optimized'>('baseline');

  const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
  const baseMonthlySpend = stats.totalMonthlySpend;

  // Monthly names generator
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Generate 6 and 12 months projection data
  const forecastData = useMemo(() => {
    const data = [];
    const count = forecastHorizon;

    let cumulativeBaseline = 0;
    let cumulativeInflation = 0;
    let cumulativeOptimized = 0;

    for (let i = 1; i <= count; i++) {
      const targetMonthIndex = (currentMonthIndex + i) % 12;
      const targetYear = currentYear + Math.floor((currentMonthIndex + i) / 12);
      const label = `${months[targetMonthIndex]} ${targetYear}`;

      // Simulate billing cycles hitting in this specific month
      // e.g. quarterly hit every 3 months, yearly in month 6/12
      let monthActualBaseline = 0;
      activeSubs.forEach(sub => {
        if (sub.billingCycle === 'monthly') {
          monthActualBaseline += sub.cost;
        } else if (sub.billingCycle === 'weekly') {
          monthActualBaseline += sub.cost * 4.33;
        } else if (sub.billingCycle === 'quarterly') {
          // Hits every 3 months
          monthActualBaseline += (i % 3 === 0) ? sub.cost : 0;
        } else if (sub.billingCycle === 'yearly') {
          // Hits once a year (spread or milestone)
          monthActualBaseline += (i % 12 === 0) ? sub.cost : 0;
        }
      });

      // Smoothed baseline monthly equivalent
      const baselineSpend = baseMonthlySpend;
      
      // Inflation (+5% annual SaaS price hike modeled exponentially)
      const inflationRate = 1 + (0.05 * (i / 12));
      const inflationSpend = Math.round(baselineSpend * inflationRate);

      // Optimized (-18% via annual consolidation & cancelling zombie tools)
      const optimizationRate = Math.max(0.75, 1 - (0.18 * (i / 6)));
      const optimizedSpend = Math.round(baselineSpend * optimizationRate);

      cumulativeBaseline += baselineSpend;
      cumulativeInflation += inflationSpend;
      cumulativeOptimized += optimizedSpend;

      data.push({
        month: label,
        monthNumber: `Month ${i}`,
        Baseline: Math.round(baselineSpend),
        'With Price Hike (+5%)': inflationSpend,
        'Smart Optimized (-18%)': optimizedSpend,
        cumulativeBaseline: Math.round(cumulativeBaseline),
        cumulativeOptimized: Math.round(cumulativeOptimized),
      });
    }

    return data;
  }, [baseMonthlySpend, forecastHorizon, activeSubs, currentMonthIndex, currentYear]);

  const totalForecastSpend = forecastData.reduce((a, b) => a + b.Baseline, 0);
  const totalOptimizedSpend = forecastData.reduce((a, b) => a + b['Smart Optimized (-18%)'], 0);
  const projectedSavings = totalForecastSpend - totalOptimizedSpend;

  return (
    <div id="budget-forecast-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-300 backdrop-blur-xs w-fit mb-3 border border-blue-500/30">
          <Sparkles size={14} className="text-amber-300" />
          <span>Predictive Spend Modeling</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Budget Forecasting & Runway Projection
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl">
              Simulate your recurring costs over the next 6 and 12 months based on billing rhythms, expected SaaS inflation, and cost optimization levers.
            </p>
          </div>

          {/* Horizon Toggle */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 self-start shrink-0">
            <button
              onClick={() => setForecastHorizon(6)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                forecastHorizon === 6
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setForecastHorizon(12)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                forecastHorizon === 12
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              12 Months (Annual)
            </button>
          </div>
        </div>

        {/* Projected Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">
              Projected {forecastHorizon}-Month Spend
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1">
              {formatCurrency(totalForecastSpend, currency)}
            </div>
            <div className="text-[11px] text-white/70 mt-0.5">
              Based on {activeSubs.length} active recurring plans
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">
              Optimized Trajectory
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-1">
              {formatCurrency(totalOptimizedSpend, currency)}
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">
              With annual billing & zombie pruning
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30">
            <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">
              Estimated {forecastHorizon}-Month Savings
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1">
              +{formatCurrency(projectedSavings, currency)}
            </div>
            <div className="text-[11px] text-emerald-200 mt-0.5">
              Recoverable capital retained
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <LineChartIcon size={18} className="text-blue-600 dark:text-blue-400" />
              {forecastHorizon}-Month Cost Projection (Baseline vs Scenarios)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive projection comparing standard baseline, 5% SaaS inflation, and smart cost reduction
            </p>
          </div>

          {/* Scenario Selectors */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold">
            <button
              onClick={() => setGrowthScenario('baseline')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                growthScenario === 'baseline'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              All Scenarios
            </button>
            <button
              onClick={() => setGrowthScenario('optimized')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                growthScenario === 'optimized'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Optimized Path
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262626' : '#f3f4f6'} />
              <XAxis
                dataKey="month"
                stroke={darkMode ? '#737373' : '#9ca3af'}
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke={darkMode ? '#737373' : '#9ca3af'}
                fontSize={11}
                tickLine={false}
                tickFormatter={val => `${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#171717' : '#ffffff',
                  borderColor: darkMode ? '#262626' : '#e5e7eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: darkMode ? '#ffffff' : '#000000',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: any) => [`${formatCurrency(val, currency)}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

              <Line
                type="monotone"
                dataKey="Baseline"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#3B82F6' }}
                activeDot={{ r: 6 }}
              />

              {growthScenario !== 'optimized' && (
                <Line
                  type="monotone"
                  dataKey="With Price Hike (+5%)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#F59E0B' }}
                />
              )}

              <Line
                type="monotone"
                dataKey="Smart Optimized (-18%)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#10B981' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-neutral-900 dark:text-white text-base">
          Month-by-Month Projected Cashflow Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3">Baseline Recurring</th>
                <th className="py-2.5 px-3">With Inflation (+5%)</th>
                <th className="py-2.5 px-3">Optimized Target</th>
                <th className="py-2.5 px-3 text-right">Cumulative Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {forecastData.map(row => {
                const diff = row.Baseline - row['Smart Optimized (-18%)'];
                return (
                  <tr key={row.month} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                      {row.month}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300">
                      {formatCurrency(row.Baseline, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                      {formatCurrency(row['With Price Hike (+5%)'], currency)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row['Smart Optimized (-18%)'], currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(diff, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
