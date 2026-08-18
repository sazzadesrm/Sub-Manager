import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  Users,
  Search,
  Building2,
  Mail,
  ShieldAlert,
  ArrowUpRight,
  UserCheck,
  Filter,
  Plus
} from 'lucide-react';

export const CustomerView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Enterprise' | 'Professional' | 'Business' | 'Starter'>('All');

  const customers = [
    { id: 'CUST-101', name: 'Acme Corp', contact: 'admin@acmecorp.com', plan: 'Enterprise', mrr: 2400, status: 'Active', renewal: '2026-09-12', health: 'At Risk' },
    { id: 'CUST-102', name: 'Finova Global', contact: 'billing@finova.io', plan: 'Enterprise', mrr: 3600, status: 'Active', renewal: '2026-09-24', health: 'Healthy' },
    { id: 'CUST-103', name: 'TechFlow Inc', contact: 'billing@techflow.com', plan: 'Professional', mrr: 890, status: 'Grace Period', renewal: '2026-08-20', health: 'Critical' },
    { id: 'CUST-104', name: 'LaunchPad Systems', contact: 'accounts@launchpad.dev', plan: 'Business', mrr: 1200, status: 'Trial (14d)', renewal: '2026-08-30', health: 'Healthy' },
    { id: 'CUST-105', name: 'DataSync Cloud', contact: 'ops@datasync.com', plan: 'Business', mrr: 1200, status: 'Active', renewal: '2026-09-04', health: 'Healthy' },
    { id: 'CUST-106', name: 'Nexus Labs', contact: 'admin@nexuslabs.com', plan: 'Enterprise', mrr: 2400, status: 'Churned', renewal: '2026-08-10', health: 'Churned' },
    { id: 'CUST-107', name: 'Prism Studio', contact: 'accounts@prismstudio.com', plan: 'Professional', mrr: 890, status: 'Churned', renewal: '2026-08-05', health: 'Churned' },
  ];

  const filtered = customers.filter(c => {
    const matchesTier = tierFilter === 'All' || c.plan === tierFilter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Customer Directory & Accounts
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage customer accounts, contract health, enterprise renewal dates, and churn risk
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Total Accounts</span>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">1,847</div>
          <span className="text-[10px] text-emerald-600 font-bold">+5.7% new subscriptions</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Enterprise Tier</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">42%</div>
          <span className="text-[10px] text-neutral-400">of total contracted revenue</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Churn Rate</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">3.2%</div>
          <span className="text-[10px] text-neutral-400">Target below 4.0%</span>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 font-medium">Net Retention Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">114%</div>
          <span className="text-[10px] text-neutral-400">Expansion & Upsells</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search customer name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['All', 'Enterprise', 'Professional', 'Business', 'Starter'].map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  tierFilter === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Plan Tier</th>
                <th className="pb-3 font-semibold">Monthly MRR</th>
                <th className="pb-3 font-semibold">Account Status</th>
                <th className="pb-3 font-semibold">Renewal Date</th>
                <th className="pb-3 font-semibold text-right">Account Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Building2 size={13} />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">{c.name}</div>
                        <div className="text-[11px] text-neutral-400">{c.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {c.plan}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-neutral-900 dark:text-white">${c.mrr.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      c.status.includes('Trial') ? 'bg-blue-50 text-blue-600' :
                      c.status === 'Grace Period' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400 font-mono">{c.renewal}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.health === 'Healthy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      c.health === 'At Risk' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {c.health}
                    </span>
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
