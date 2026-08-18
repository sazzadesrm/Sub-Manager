import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency } from '../utils/calculations';
import {
  CreditCard,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentView: React.FC = () => {
  const { currency, addAuditLog } = useSubscriptions();
  const [filterStatus, setFilterStatus] = useState<'all' | 'successful' | 'failed' | 'refunded'>('all');
  const [search, setSearch] = useState('');

  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', customer: 'Acme Corp', email: 'admin@acmecorp.com', date: '2026-08-17 19:40', amount: 2400, plan: 'Enterprise', status: 'failed', method: 'Visa ending 4242' },
    { id: 'TXN-9020', customer: 'Finova Global', email: 'billing@finova.io', date: '2026-08-17 18:22', amount: 3600, plan: 'Enterprise', status: 'successful', method: 'bKash Merchant' },
    { id: 'TXN-9019', customer: 'TechFlow Inc', email: 'billing@techflow.com', date: '2026-08-17 17:15', amount: 890, plan: 'Professional', status: 'failed', method: 'Mastercard 8812' },
    { id: 'TXN-9018', customer: 'LaunchPad Systems', email: 'accounts@launchpad.dev', date: '2026-08-17 16:04', amount: 1200, plan: 'Business', status: 'successful', method: 'Nagad Pay' },
    { id: 'TXN-9017', customer: 'DataSync Cloud', email: 'ops@datasync.com', date: '2026-08-17 14:50', amount: 1200, plan: 'Business', status: 'failed', method: 'Visa ending 9011' },
    { id: 'TXN-9016', customer: 'Prism Studio', email: 'finance@prism.com', date: '2026-08-17 12:30', amount: 890, plan: 'Professional', status: 'successful', method: 'Corporate Wire' },
    { id: 'TXN-9015', customer: 'Wave Data', email: 'billing@wavedata.com', date: '2026-08-17 10:10', amount: 290, plan: 'Starter', status: 'refunded', method: 'Visa ending 1122' },
  ]);

  const filtered = transactions.filter(t => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRetry = (id: string, customer: string, amount: number) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'successful' } : t));
    addAuditLog(`Re-processed payment ${id} for ${customer} ($${amount})`, 'billing', 'Admin');
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Payments & Collections
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitor real-time subscription charge authorizations, dunning retries, and merchant gateway logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent = 'data:text/csv;charset=utf-8,' + transactions.map(t => `${t.id},${t.customer},${t.amount},${t.status}`).join('\n');
              const link = document.createElement('a');
              link.setAttribute('href', encodeURI(csvContent));
              link.setAttribute('download', 'payments_ledger.csv');
              link.click();
            }}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Summary KPI mini-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Successful Volume (Today)</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">$5,690</div>
          <span className="text-[10px] text-neutral-400">3 transactions settled</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Failed Payment In Grace</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">$4,490</div>
          <span className="text-[10px] text-neutral-400">3 accounts under dunning notice</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Average Revenue Per User</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">$1,480</div>
          <span className="text-[10px] text-neutral-400">Across active subscription tiers</span>
        </div>
      </div>

      {/* Table & Filter Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by customer, invoice ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'successful', 'failed', 'refunded'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  filterStatus === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                <th className="pb-3 font-semibold">Transaction ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Plan Tier</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 font-mono font-bold text-neutral-700 dark:text-neutral-300">{t.id}</td>
                  <td className="py-3">
                    <div className="font-bold text-neutral-900 dark:text-white">{t.customer}</div>
                    <div className="text-[11px] text-neutral-400">{t.email}</div>
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400">{t.method}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-neutral-900 dark:text-white">${t.amount.toLocaleString()}</td>
                  <td className="py-3">
                    {t.status === 'successful' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        PAID
                      </span>
                    )}
                    {t.status === 'failed' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        FAILED
                      </span>
                    )}
                    {t.status === 'refunded' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                        REFUNDED
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {t.status === 'failed' ? (
                      <button
                        onClick={() => handleRetry(t.id, t.customer, t.amount)}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <RotateCcw size={11} /> Retry
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
