import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { AutomatedEmailTemplate } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  CreditCard,
  Settings,
  Eye,
  Edit3,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  RefreshCw,
  Inbox
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AutomatedEmailsHub: React.FC = () => {
  const { emailTemplates, updateEmailTemplate, currency, subscriptions } = useSubscriptions();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(emailTemplates[0]?.id || 'tpl-renewal');
  const [testEmailAddress, setTestEmailAddress] = useState('billing-team@acmecorp.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedTemplate = emailTemplates.find(t => t.id === selectedTemplateId) || emailTemplates[0];

  const [editSubject, setEditSubject] = useState(selectedTemplate?.subject || '');
  const [editBody, setEditBody] = useState(selectedTemplate?.body || '');
  const [editDaysBefore, setEditDaysBefore] = useState(selectedTemplate?.daysBefore || 2);

  const handleSelectTemplate = (tpl: AutomatedEmailTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditSubject(tpl.subject);
    setEditBody(tpl.body);
    setEditDaysBefore(tpl.daysBefore || 2);
    setIsEditing(false);
    setTestSentSuccess(false);
  };

  const handleToggleEnable = (id: string, currentEnabled: boolean) => {
    updateEmailTemplate(id, { enabled: !currentEnabled });
  };

  const handleSaveTemplate = () => {
    updateEmailTemplate(selectedTemplate.id, {
      subject: editSubject,
      body: editBody,
      daysBefore: editDaysBefore,
    });
    setIsEditing(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleSendTestEmail = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 4000);
    }, 800);
  };

  // Sample variable replacements for live preview
  const sampleSub = subscriptions[0] || {
    name: 'Figma Enterprise',
    cost: 1500,
    nextRenewalDate: '2026-08-25',
    currency: 'BDT',
    billingCycle: 'monthly',
  };

  const previewBody = (editBody || selectedTemplate.body)
    .replace(/{customer_name}/g, 'Arif Chowdhury')
    .replace(/{subscription_name}/g, sampleSub.name)
    .replace(/{amount}/g, formatCurrency(sampleSub.cost, sampleSub.currency || currency))
    .replace(/{renewal_date}/g, sampleSub.nextRenewalDate)
    .replace(/{billing_cycle}/g, sampleSub.billingCycle)
    .replace(/{payment_method}/g, 'Mastercard ending in 4242')
    .replace(/{due_date}/g, '2026-09-10')
    .replace(/{invoice_id}/g, 'INV-2026-8941')
    .replace(/{action_url}/g, 'https://app.subpulse.io/billing/verify')
    .replace(/{invoice_url}/g, 'https://app.subpulse.io/invoices/INV-2026-8941.pdf')
    .replace(/{pause_url}/g, 'https://app.subpulse.io/subs/pause-oneclick');

  const previewSubject = (editSubject || selectedTemplate.subject)
    .replace(/{subscription_name}/g, sampleSub.name)
    .replace(/{invoice_id}/g, 'INV-2026-8941')
    .replace(/{amount}/g, formatCurrency(sampleSub.cost, sampleSub.currency || currency));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'renewal_notice':
        return <Clock size={16} className="text-blue-500" />;
      case 'dunning_failed_payment':
        return <AlertTriangle size={16} className="text-rose-500" />;
      case 'payment_confirmation':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'invoice_reminder':
        return <FileText size={16} className="text-amber-500" />;
      default:
        return <Mail size={16} className="text-neutral-500" />;
    }
  };

  return (
    <div id="automated-emails-hub" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-300 backdrop-blur-xs w-fit mb-3 border border-blue-500/30">
          <Mail size={14} className="text-blue-300" />
          <span>Billing Communication Automation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Automated Email & Lifecycle Communications
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl">
          Configure proactive dunning sequences, upcoming renewal notifications, payment receipts, and net-30 invoice reminders to minimize churn and payment failures.
        </p>
      </div>

      {/* Main Grid: Template List & Live Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Cards (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm uppercase tracking-wider">
              Trigger Sequences ({emailTemplates.length})
            </h3>
            <span className="text-xs text-neutral-400">Auto-dispatched</span>
          </div>

          <div className="space-y-2.5">
            {emailTemplates.map(tpl => {
              const isSelected = tpl.id === selectedTemplate.id;

              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-xs'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                        {getTypeIcon(tpl.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-900 dark:text-white text-sm truncate">
                          {tpl.name}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                          {tpl.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
                            Trigger: {tpl.trigger}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEnable(tpl.id, tpl.enabled);
                      }}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                      title={tpl.enabled ? 'Disable' : 'Enable'}
                    >
                      {tpl.enabled ? (
                        <ToggleRight size={24} className="text-emerald-500" />
                      ) : (
                        <ToggleLeft size={24} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Template Editor & Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  {isEditing ? <Edit3 size={18} /> : <Eye size={18} />}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                    {isEditing ? 'Editing Template' : 'Live Email Preview'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Template: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedTemplate.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={13} />
                  {isEditing ? 'View Preview' : 'Edit Copy'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveTemplate}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    Save Template
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              /* Edit Form Mode */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Subject Line (Supports dynamic variables)
                  </label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {selectedTemplate.type === 'renewal_notice' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Dispatch Schedule (Days before auto-renewal date)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={editDaysBefore}
                      onChange={e => setEditDaysBefore(Number(e.target.value))}
                      className="w-28 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Body Content (Markdown supported)
                  </label>
                  <textarea
                    rows={10}
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-xs text-neutral-500 space-y-1">
                  <div className="font-semibold text-neutral-700 dark:text-neutral-300">Available merge tags:</div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{customer_name}"}</code>
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{subscription_name}"}</code>
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{amount}"}</code>
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{renewal_date}"}</code>
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{invoice_id}"}</code>
                    <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-blue-600 dark:text-blue-400">{"{action_url}"}</code>
                  </div>
                </div>
              </div>
            ) : (
              /* Rich Email Preview Card */
              <div className="space-y-4">
                {/* Simulated Email Client Shell */}
                <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-700 overflow-hidden shadow-xs bg-neutral-50 dark:bg-neutral-950">
                  {/* Email header bar */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-500 dark:text-neutral-400">From:</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-medium">SubPulse Billing &lt;notifications@subpulse.io&gt;</span>
                      </div>
                      <span className="text-[11px]">Today, 10:45 AM</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="font-semibold text-neutral-500 dark:text-neutral-400">To:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">Arif Chowdhury &lt;arif@example.com&gt;</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="font-semibold text-neutral-500 dark:text-neutral-400">Subject:</span>
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">{previewSubject}</span>
                    </div>
                  </div>

                  {/* Email message body rendered */}
                  <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {previewBody}
                  </div>

                  {/* Footer note in preview */}
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 text-center">
                    SubPulse Automated Billing Dispatcher • 1-click unsubscribe & preference management enabled
                  </div>
                </div>

                {/* Send Test Dispatch Simulator */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Send size={16} className="text-blue-500 shrink-0" />
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={e => setTestEmailAddress(e.target.value)}
                      placeholder="Send sample test to email..."
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs w-full sm:w-64"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {testSentSuccess && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Test email sent!
                      </span>
                    )}
                    <button
                      onClick={handleSendTestEmail}
                      disabled={isSendingTest}
                      className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {isSendingTest ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                      {isSendingTest ? 'Sending...' : 'Send Test Dispatch'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
