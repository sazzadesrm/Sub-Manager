import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency } from '../utils/calculations';
import {
  Info,
  ChevronDown,
  Download,
  Trash2,
  TrendingUp,
  Users,
  CreditCard,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';

interface MunemindDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const MunemindDashboard: React.FC<MunemindDashboardProps> = ({ onNavigateTab }) => {
  const { stats, subscriptions, currency, currentUser } = useSubscriptions();
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days');

  // Smooth spline data for Activations vs Net Cancellations (matching Image 1)
  const activationVsCancellationData = [
    { month: 'Jan', activations: 30, cancellations: 20 },
    { month: 'Feb', activations: 35, cancellations: 22 },
    { month: 'Mar', activations: 34, cancellations: 25 },
    { month: 'Apr', activations: 45, cancellations: 24 },
    { month: 'May', activations: 48, cancellations: 26 },
    { month: 'Jun', activations: 42, cancellations: 28 },
    { month: 'Jul', activations: 55, cancellations: 30 },
    { month: 'Aug', activations: 58, cancellations: 29 },
    { month: 'Sep', activations: 52, cancellations: 32 },
    { month: 'Oct', activations: 56, cancellations: 31 },
    { month: 'Nov', activations: 59, cancellations: 33 },
    { month: 'Dec', activations: 68, cancellations: 35 },
  ];

  // Customer Growth monthly bar data (Mar highlighted with active 76 badge)
  const customerGrowthData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 76, active: true },
    { month: 'Apr', value: 35 },
    { month: 'May', value: 85 },
  ];

  // Top 5 Expenses by Category (matching Image 1 horizontal bar format)
  const topCategories = [
    { name: 'Personal', amount: 10000, max: 10000, color: '#8B5CF6' },
    { name: 'Education', amount: 8000, max: 10000, color: '#10B981' },
    { name: 'Phone', amount: 9200, max: 10000, color: '#3B82F6' },
    { name: 'Rent or Lease', amount: 6200, max: 10000, color: '#0EA5E9' },
    { name: 'Travel', amount: 3800, max: 10000, color: '#EC4899' },
  ];

  // Invoices table dataset (matching Image 1)
  const [invoices, setInvoices] = useState([
    { id: '1', number: '8FB28438-0001', date: 'Jun 7, 3:36 PM', amount: 580, checked: false },
    { id: '2', number: '8FB28438-0002', date: 'Jun 7, 3:36 PM', amount: 580, checked: false },
    { id: '3', number: '8FB28438-0003', date: 'Jun 7, 3:36 PM', amount: 580, checked: false },
    { id: '4', number: '8FB28438-0004', date: 'Jun 7, 3:36 PM', amount: 580, checked: false },
  ]);

  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const toggleInvoiceCheck = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, checked: !inv.checked } : inv))
    );
  };

  const handleDownloadInvoice = (number: string) => {
    setDownloadToast(`Invoice ${number} downloaded successfully.`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // Speedometer calculation (71.30% matching Image 1)
  const churnRatePercentage = 71.3;
  // Speedometer needle angle: 0% is -90deg (left), 100% is +90deg (right)
  const needleRotation = -90 + (churnRatePercentage / 100) * 180;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar with Title and Dropdown Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Subscription Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Active workspace metrics for {currentUser?.name || 'Workspace Account'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dropdown 1: All Products */}
          <div className="relative">
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 pl-3.5 pr-8 py-2 rounded-xl focus:outline-none shadow-2xs cursor-pointer hover:border-neutral-300"
            >
              <option value="All Products">All Products</option>
              <option value="SaaS Subscriptions">SaaS Subscriptions</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Telecom & Utilities">Telecom & Utilities</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Dropdown 2: Timeframe */}
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={e => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 pl-3.5 pr-8 py-2 rounded-xl focus:outline-none shadow-2xs cursor-pointer hover:border-neutral-300"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {downloadToast && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Main Grid: Left Column (Charts & Invoices) and Right Column (Churn Gauge, Net Revenue, Recent Subs, Used Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 8 Columns on Desktop */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Activations vs Net Cancellations */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  Activations vs Net Cancellations
                </h2>
                <Info size={14} className="text-neutral-400 cursor-help" />
              </div>

              {/* Legend with purple and blue dots */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-neutral-700 dark:text-neutral-300">Activations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-neutral-700 dark:text-neutral-300">Net Cancellations</span>
                </div>
              </div>
            </div>

            {/* Line Curve Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activationVsCancellationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 80]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <Line
                    type="natural"
                    dataKey="activations"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#8B5CF6' }}
                  />
                  <Line
                    type="natural"
                    dataKey="cancellations"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Middle Row: Customer Growth (Left) + Top 5 Expenses by Category (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Growth Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Customer Growth</h3>
                <Info size={13} className="text-neutral-400" />
              </div>

              {/* Bar visualization with active March pill (76) */}
              <div className="h-44 w-full relative">
                {/* Floating badge for active month Mar */}
                <div className="absolute top-2 left-[50%] -translate-x-1/2 bg-[#0F172A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10">
                  76
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerGrowthData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
                      {customerGrowthData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.active ? '#8B5CF6' : '#F1F5F9'}
                          className={entry.active ? 'dark:fill-[#8B5CF6]' : 'dark:fill-neutral-800'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Expenses by Category Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Top 5 Expenses by Category</h3>
                <Info size={13} className="text-neutral-400" />
              </div>

              {/* Horizontal category expense bars */}
              <div className="space-y-3">
                {topCategories.map(cat => (
                  <div key={cat.name} className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-right font-medium text-neutral-600 dark:text-neutral-400 truncate text-[11px]">
                      {cat.name}
                    </span>
                    <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(cat.amount / cat.max) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* X-Axis ticks */}
                <div className="flex justify-between pl-24 text-[9px] text-neutral-400 pt-1 font-mono">
                  <span>0k</span>
                  <span>2k</span>
                  <span>4k</span>
                  <span>6k</span>
                  <span>8k</span>
                  <span>10k</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Card: Invoices Table (matching Image 1) */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Invoices ({invoices.length})
              </h3>
              <button
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
                title="Options"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 text-[11px] font-semibold">
                    <th className="py-2.5 px-3 w-8">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-0" />
                    </th>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={inv.checked}
                          onChange={() => toggleInvoiceCheck(inv.id)}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        {inv.number}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                        {inv.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                        ${inv.amount}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2 text-neutral-400">
                          <button
                            onClick={() => handleDownloadInvoice(inv.number)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 Columns on Desktop */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Churn Rate Gauge Meter (Speedometer style matching Image 1) */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Churn Rate</h3>
                <Info size={13} className="text-neutral-400" />
              </div>
            </div>

            {/* Semi-circle Gauge SVG */}
            <div className="relative w-48 h-28 my-2 flex items-end justify-center">
              <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Background Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="20"
                  strokeLinecap="round"
                  className="dark:stroke-neutral-800"
                />

                {/* Value Gradient Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="20"
                  strokeDasharray="251.3"
                  strokeDashoffset={251.3 * (1 - churnRatePercentage / 100)}
                  strokeLinecap="round"
                />

                {/* Gauge needle & center pivot circle */}
                <circle cx="100" cy="100" r="8" fill="#0EA5E9" />
                <circle cx="100" cy="100" r="3" fill="#FFFFFF" />

                {/* Animated Needle Indicator */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="38"
                  stroke="#0EA5E9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${needleRotation} 100 100)`}
                  style={{ transition: 'transform 1s ease-out' }}
                />
              </svg>
            </div>

            {/* Range markers and percentage display */}
            <div className="w-full flex justify-between text-[11px] font-bold text-neutral-400 px-4">
              <span>0</span>
              <span>100</span>
            </div>

            <div className="text-xl font-black text-neutral-900 dark:text-white mt-1">
              {churnRatePercentage.toFixed(2)}%
            </div>
          </div>

          {/* Card 2: Net Revenue Card with mini bar chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-400">Net Revenue</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
                  {stats.totalMonthlySpend > 0 ? formatCurrency(stats.totalMonthlySpend, currency) : '$15,000'}
                </div>
              </div>

              {/* Mini purple vertical bar chart */}
              <div className="flex items-end gap-1 h-10">
                <div className="w-1.5 h-4 bg-indigo-300 dark:bg-indigo-700 rounded-full" />
                <div className="w-1.5 h-6 bg-indigo-400 dark:bg-indigo-600 rounded-full" />
                <div className="w-1.5 h-8 bg-indigo-500 dark:bg-indigo-500 rounded-full" />
                <div className="w-1.5 h-10 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                <div className="w-1.5 h-7 bg-indigo-400 dark:bg-indigo-600 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 font-medium">Customers</span>
                <div className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  190
                </div>
              </div>
              <div>
                <span className="text-neutral-400 font-medium">Subscriptions</span>
                <div className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  {subscriptions.length > 0 ? subscriptions.length : 126}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Subscriptions list (matching Image 1) */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
              Recent Subscriptions
            </h3>

            <div className="space-y-3.5">
              {[
                {
                  name: 'Dennis Diaz',
                  date: 'Feb 24, 12:00 pm',
                  amount: '$14.99',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=faces',
                },
                {
                  name: 'Maksud alam',
                  date: 'Feb 28, 3:00 pm',
                  amount: '$8.99',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=faces',
                },
                {
                  name: 'William lowe',
                  date: 'Apr 08, 12:45 pm',
                  amount: '$12.99',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop&crop=faces',
                },
                {
                  name: 'Nathan',
                  date: 'Jun 17, 7:20 pm',
                  amount: '$19.99',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces',
                },
              ].map(sub => (
                <div key={sub.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={sub.avatar}
                      alt={sub.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900 dark:text-white truncate">
                        {sub.name}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {sub.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {sub.amount}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      /month
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Used Space Pastel Gradient Card (matching Image 1) */}
          <div className="rounded-3xl p-5 border border-purple-200/50 dark:border-neutral-800 bg-gradient-to-r from-amber-100/70 via-teal-100/60 to-purple-200/70 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 shadow-2xs">
            <h4 className="text-sm font-black text-neutral-900 dark:text-white">
              Used space
            </h4>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1">
              Your team has used 80% of your available space. Need more?
            </p>

            {/* Progress bar */}
            <div className="w-full bg-neutral-300/60 dark:bg-neutral-800 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full w-[80%]" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
