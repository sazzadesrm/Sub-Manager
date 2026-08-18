import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency } from '../utils/calculations';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Building2,
  FileText,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruvaDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const TruvaDashboard: React.FC<TruvaDashboardProps> = ({ onNavigateTab }) => {
  const { currency, stats, currentUser, addAuditLog } = useSubscriptions();
  const [timeframe, setTimeframe] = useState<'Yearly' | 'Quarterly' | 'Monthly'>('Yearly');
  const [retryToast, setRetryToast] = useState<string | null>(null);

  // Revenue vs Churn chart data matching the attached mockup
  const chartData = [
    { month: 'Jan', revenue: 65, churn: 3.5 },
    { month: 'Feb', revenue: 75, churn: 3.2 },
    { month: 'Mar', revenue: 72, churn: 4.8 },
    { month: 'Apr', revenue: 86, churn: 5.6 },
    { month: 'May', revenue: 95, churn: 5.4 },
    { month: 'Jun', revenue: 112, churn: 2.8 },
    { month: 'Jul', revenue: 104, churn: 2.5 },
    { month: 'Aug', revenue: 98, churn: 2.1 },
    { month: 'Sep', revenue: 118, churn: 2.6 },
    { month: 'Oct', revenue: 94, churn: 4.5 },
    { month: 'Nov', revenue: 78, churn: 3.4 },
    { month: 'Dec', revenue: 85, churn: 2.4 },
  ];

  // Failed payments data from mockup
  const [failedPayments, setFailedPayments] = useState([
    { id: 'fp-1', customer: 'Acme Corp', email: 'admin@acmecorp.com', plan: 'Enterprise', amount: 2400 },
    { id: 'fp-2', customer: 'TechFlow Inc', email: 'billing@techflow.com', plan: 'Professional', amount: 890 },
    { id: 'fp-3', customer: 'DataSync', email: 'ops@datasync.com', plan: 'Business', amount: 1200 },
    { id: 'fp-4', customer: 'Orbit Media', email: 'finance@orbitmedia.com', plan: 'Enterprise', amount: 3600 },
    { id: 'fp-5', customer: 'Vertex Analytics', email: 'contact@vertexai.com', plan: 'Professional', amount: 1200 },
  ]);

  // Recently churned data from mockup
  const recentlyChurned = [
    { customer: 'Nexus Labs', email: 'admin@nexuslabs.com', plan: 'Enterprise', mrrLost: 2400, reason: 'Too expensive' },
    { customer: 'TechFlow Inc', email: 'billing@techflow.com', plan: 'Professional', mrrLost: 890, reason: 'Missing features' },
    { customer: 'Orbit Media', email: 'finance@orbitmedia.com', plan: 'Enterprise', mrrLost: 3600, reason: 'Switched to Competitor' },
    { customer: 'Prism Studio', email: 'accounts@prismstudio.com', plan: 'Professional', mrrLost: 890, reason: 'No longer needed' },
    { customer: 'Wave Data', email: 'billing@wavedata.com', plan: 'Starter', mrrLost: 290, reason: 'Budget cuts' },
  ];

  // Recent activity data from mockup
  const recentActivities = [
    { title: 'Acme Corp Upgraded to Enterprise', time: '2 min ago', tag: 'UPGRADE', tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { title: 'HorizonTech payment failed ($16)', time: '18 min ago', tag: 'FAILED', tagColor: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300' },
    { title: 'LaunchPad started a 14 days trial', time: '1 hrs ago', tag: 'NEW', tagColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300' },
    { title: 'GreenPath AI canceled Growth plan', time: '3 hrs ago', tag: 'CANCEL', tagColor: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' },
    { title: 'Finova Renewed Enterprise plan', time: '3 hrs ago', tag: 'RENEW', tagColor: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300' },
  ];

  const handleRetryPayment = (customerName: string, amount: number) => {
    setRetryToast(`Retrying payment of $${amount.toLocaleString()} for ${customerName}...`);
    setTimeout(() => {
      setRetryToast(`✓ Payment for ${customerName} processed successfully!`);
      confetti({ particleCount: 30, spread: 50 });
      addAuditLog(`Retried payment for ${customerName} ($${amount})`, 'billing', currentUser.name);
      setTimeout(() => setRetryToast(null), 3000);
    }, 1000);
  };

  // Helper mini-sparklines SVG
  const GreenSparkline = () => (
    <svg className="w-16 h-7 text-emerald-500 overflow-visible" viewBox="0 0 60 24" fill="none">
      <path
        d="M2 18 L12 14 L22 17 L32 8 L42 12 L52 4 L58 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const RedSparkline = () => (
    <svg className="w-16 h-7 text-rose-500 overflow-visible" viewBox="0 0 60 24" fill="none">
      <path
        d="M2 8 L12 12 L22 7 L32 16 L42 13 L52 20 L58 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {retryToast && (
        <div className="fixed top-5 right-5 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-3 rounded-2xl shadow-xl border border-neutral-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
          <span>{retryToast}</span>
        </div>
      )}

      {/* Dashboard Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Welcome back, {currentUser.name.split(' ')[0] || 'John'}. Here's what's happening with Sublytics today.
          </p>
        </div>
      </div>

      {/* 4 Metric KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Recurring Revenue */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Monthly Recurring Revenue
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              $124,500
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={12} />
                12.5%
              </span>
              <GreenSparkline />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5 font-medium">
            12.5% vs last month
          </div>
        </div>

        {/* Card 2: Annual Recurring Revenue */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Annual Recurring Revenue
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              $1.49M
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={12} />
                8.2%
              </span>
              <GreenSparkline />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5 font-medium">
            8.2% vs last year
          </div>
        </div>

        {/* Card 3: Churn Rate */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Churn Rate
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              3.2%
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-rose-600 flex items-center">
                <ArrowDownRight size={12} />
                0.3%
              </span>
              <RedSparkline />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5 font-medium">
            0.3% vs last month
          </div>
        </div>

        {/* Card 4: Total Subscriptions */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Total Subscriptions
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              1,847
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={12} />
                5.7%
              </span>
              <GreenSparkline />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5 font-medium">
            5.7% vs last month
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue vs Churn Rate Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Revenue vs Churn Rate Card */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Revenue vs Churn Rate
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Monthly revenue trend overlaid with churn percentage
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={e => setTimeframe(e.target.value as any)}
                  className="appearance-none bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium py-1.5 pl-3 pr-7 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-neutral-400 pointer-events-none" />
              </div>

              <button
                onClick={() => onNavigateTab('analytics')}
                className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                title="Expand Analytics"
              >
                <ExternalLink size={15} />
              </button>
            </div>
          </div>

          {/* Recharts Dual Axis Chart */}
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />

                {/* Left Y Axis: Revenue ($k) */}
                <YAxis
                  yAxisId="left"
                  domain={[60, 130]}
                  ticks={[60, 80, 100, 120]}
                  tickFormatter={val => `$${val}K`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />

                {/* Right Y Axis: Churn (%) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 12]}
                  ticks={[0, 4, 8, 12]}
                  tickFormatter={val => `${val}%`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const rev = payload.find(p => p.dataKey === 'revenue')?.value;
                      const churn = payload.find(p => p.dataKey === 'churn')?.value;
                      return (
                        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1 border border-neutral-700/50">
                          <div className="font-bold border-b border-neutral-700 dark:border-neutral-200 pb-1">{label}</div>
                          <div className="flex items-center gap-2 text-blue-400 dark:text-blue-600 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Revenue: ${rev}k</span>
                          </div>
                          <div className="flex items-center gap-2 text-rose-400 dark:text-rose-600 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Churn%: {churn}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Monthly Revenue Area & Line */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />

                {/* Churn Rate Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="churn"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#EA580C' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Bottom Legend */}
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Monthly Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-0.5 bg-orange-600 rounded" />
              <span>Churn Rate (%)</span>
            </div>
          </div>
        </div>

        {/* Right 1/3: Recent Activity Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Recent Activity
              </h2>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All &gt;
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act, index) => (
                <div key={index} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {act.time}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border ${act.tagColor}`}>
                    {act.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('emails')}
            className="mt-6 w-full py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Manage Renewal & Activity Reminders</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Failed Payment & Recently Churned Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Failed Payment Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Failed Payment
            </h2>
            <button
              onClick={() => onNavigateTab('payment')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All &gt;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-medium">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {failedPayments.map(item => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Building2 size={13} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">{item.customer}</div>
                          <div className="text-[11px] text-neutral-400">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {item.plan}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-neutral-900 dark:text-white">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleRetryPayment(item.customer, item.amount)}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-[11px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <RotateCcw size={11} />
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recently Churned Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Recently Churned
            </h2>
            <button
              onClick={() => onNavigateTab('customer')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All &gt;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-medium">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">MRP Lost</th>
                  <th className="pb-3 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {recentlyChurned.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Building2 size={13} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">{item.customer}</div>
                          <div className="text-[11px] text-neutral-400">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {item.plan}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-rose-600 dark:text-rose-400">
                      -${item.mrrLost.toLocaleString()}
                    </td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-300 font-medium">
                      {item.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
