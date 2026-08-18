import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  FileText,
  Download,
  Mail,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { AutomatedEmailsHub } from './AutomatedEmailsHub';
import { UserManagementRBAC } from './UserManagementRBAC';

export const ReportsView: React.FC = () => {
  const { auditLogs } = useSubscriptions();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'emails' | 'rbac'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Reports & Governance
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Audit trails, automated dunning communications, and access control policies
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Audit Log
          </button>
          <button
            onClick={() => setActiveSubTab('emails')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'emails'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Automated Emails
          </button>
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'rbac'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Team & RBAC
          </button>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              System Audit Trail & Security Events
            </h2>
            <button
              onClick={() => {
                const csv = 'data:text/csv;charset=utf-8,' + auditLogs.map(l => `${l.timestamp},${l.user},${l.action},${l.details}`).join('\n');
                const link = document.createElement('a');
                link.setAttribute('href', encodeURI(csv));
                link.setAttribute('download', 'audit_logs.csv');
                link.click();
              }}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Download size={13} />
              Export Audit CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-3 text-neutral-500 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 font-bold text-neutral-900 dark:text-white">{log.user || log.userName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {log.userRole || 'Admin'}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">{log.action}</td>
                    <td className="py-3 text-neutral-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'emails' && <AutomatedEmailsHub />}
      {activeSubTab === 'rbac' && <UserManagementRBAC />}
    </div>
  );
};
