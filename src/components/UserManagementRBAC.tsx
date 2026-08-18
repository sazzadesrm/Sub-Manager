import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { TeamMember, UserRole } from '../types';
import {
  Users,
  Shield,
  UserPlus,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  DollarSign,
  Headphones,
  Briefcase,
  Sliders,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Activity,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UserManagementRBAC: React.FC = () => {
  const {
    teamMembers,
    currentUser,
    setCurrentUser,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    auditLogs,
    addAuditLog,
  } = useSubscriptions();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('finance');
  const [inviteDepartment, setInviteDepartment] = useState('Finance Operations');
  const [searchLogQuery, setSearchLogQuery] = useState('');

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const defaultPerms = {
      canManageSubscriptions: inviteRole === 'admin' || inviteRole === 'finance',
      canViewInvoices: true,
      canManageBillingMethods: inviteRole === 'admin' || inviteRole === 'finance',
      canManageTeam: inviteRole === 'admin',
      canRunAudits: inviteRole === 'admin' || inviteRole === 'finance',
      canSendDunning: inviteRole === 'admin' || inviteRole === 'support' || inviteRole === 'finance',
    };

    const newMember: Omit<TeamMember, 'id'> = {
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      department: inviteDepartment,
      status: 'active',
      permissions: defaultPerms,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1534528741775 + teamMembers.length}?w=100&auto=format&fit=crop&q=80`,
    };

    addTeamMember(newMember);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleToggleStatus = (member: TeamMember) => {
    const nextStatus = member.status === 'active' ? 'suspended' : 'active';
    updateTeamMember(member.id, { status: nextStatus });
    addAuditLog(`Member status changed to ${nextStatus}`, 'security', member.name);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
            <Shield size={11} /> Admin
          </span>
        );
      case 'finance':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
            <DollarSign size={11} /> Finance
          </span>
        );
      case 'support':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
            <Headphones size={11} /> Support
          </span>
        );
      case 'sales':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
            <Briefcase size={11} /> Sales
          </span>
        );
      default:
        return null;
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
    (log.details || '').toLowerCase().includes(searchLogQuery.toLowerCase())
  );

  return (
    <div id="rbac-management-section" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300 backdrop-blur-xs w-fit mb-3 border border-purple-500/30">
          <Shield size={14} className="text-purple-300" />
          <span>Role-Based Access Control & Governance</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Team Accounts & Role-Based Access (RBAC)
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl">
              Enforce granular access boundaries between Finance, Support, and Sales teams. Audit every subscription modification and billing operation in real-time.
            </p>
          </div>

          {/* Current Persona Switcher */}
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shrink-0 self-start">
            <div className="text-[11px] text-white/70 font-semibold uppercase mb-1">
              Active Logged-in Persona:
            </div>
            <select
              value={currentUser.id}
              onChange={e => {
                const target = teamMembers.find(m => m.id === e.target.value);
                if (target) setCurrentUser(target);
              }}
              className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 focus:outline-hidden"
            >
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RBAC Matrix Explainer Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <DollarSign size={18} />
            <span>Finance Team Scope</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Full control over recurring budgets, exchange rates, invoice dispatches, bank reconciliations, and expense audits.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Headphones size={18} />
            <span>Support Team Scope</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Can trigger 1-click renewal pauses, update expired customer cards, and dispatch dunning verification emails.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Briefcase size={18} />
            <span>Sales Team Scope</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Can provision new customer subscriptions, apply promotional discounts, and generate hosted checkout links.
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <Users size={18} className="text-purple-600 dark:text-purple-400" />
              Team Accounts & Assigned Permissions ({teamMembers.length})
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage organization members, custom permission gates, and active login access
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={14} />
            Invite Member / Create Account
          </button>
        </div>

        {/* Member Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-semibold">
                <th className="py-3 px-3">Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Permissions Matrix</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-neutral-500">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {getRoleBadge(member.role)}
                  </td>

                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    {member.department}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.permissions.canManageSubscriptions
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}>
                        Manage Subs
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.permissions.canManageBillingMethods
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}>
                        Billing Methods
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.permissions.canSendDunning
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}>
                        Dunning
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleStatus(member)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        member.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {member.status === 'active' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      <span className="capitalize">{member.status}</span>
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {member.role !== 'admin' && (
                      <button
                        onClick={() => deleteTeamMember(member.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Log Viewer */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Immutable Governance Audit Logs
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Live audit trail of user permissions, financial edits, and invoice state transitions
            </p>
          </div>

          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchLogQuery}
              onChange={e => setSearchLogQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  log.category === 'billing'
                    ? 'bg-emerald-500'
                    : log.category === 'security'
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
                }`} />
                <div className="min-w-0">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {log.action}
                  </span>
                  {log.details && (
                    <span className="text-neutral-500 dark:text-neutral-400 ml-1.5 truncate">
                      ({log.details})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-[11px] text-neutral-400">
                <span className="font-medium text-neutral-600 dark:text-neutral-300">by {log.user}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
                Create Account / Invite Team Member
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Jahan"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. nusrat@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white"
                  >
                    <option value="finance">Finance Team</option>
                    <option value="support">Support Team</option>
                    <option value="sales">Sales Team</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={e => setInviteDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Create & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
