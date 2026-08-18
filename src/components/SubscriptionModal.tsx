import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
  UsageFrequency
} from '../types';
import { CATEGORIES, CATEGORY_COLORS, CURRENCIES, getRelativeDate, COMMON_TAGS } from '../data/subscriptionsData';
import { CATEGORY_DEFAULT_ICONS } from '../data/iconLibrary';
import { ServiceIcon } from './ServiceIcon';
import {
  X,
  Plus,
  Check,
  Calendar,
  DollarSign,
  CreditCard,
  Activity,
  Hash,
  ShoppingBag,
  Sparkles,
  Infinity as InfinityIcon
} from 'lucide-react';
import { motion } from 'motion/react';

export const SubscriptionModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    editingSubscription,
    setEditingSubscription,
    addSubscription,
    updateSubscription,
    currency,
  } = useSubscriptions();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('Streaming');
  const [cost, setCost] = useState<string>('500');
  const [subCurrency, setSubCurrency] = useState(currency);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nextRenewalDate, setNextRenewalDate] = useState(getRelativeDate(30));
  const [paymentMethod, setPaymentMethod] = useState('bKash / Card');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [isTrial, setIsTrial] = useState(false);
  const [alertDaysBefore, setAlertDaysBefore] = useState<number>(3);
  const [autoRenew, setAutoRenew] = useState(true);
  const [notes, setNotes] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [usageFrequency, setUsageFrequency] = useState<UsageFrequency>('daily');

  // Reset or populate when opened
  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setCategory(editingSubscription.category);
      setCost(editingSubscription.cost.toString());
      setSubCurrency(editingSubscription.currency || currency);
      setBillingCycle(editingSubscription.billingCycle);
      setPurchaseDate(editingSubscription.purchaseDate || editingSubscription.startDate || new Date().toISOString().split('T')[0]);
      setNextRenewalDate(editingSubscription.nextRenewalDate || getRelativeDate(30));
      setPaymentMethod(editingSubscription.paymentMethod || '');
      setStatus(editingSubscription.status);
      setIsTrial(!!editingSubscription.isTrial);
      setAlertDaysBefore(editingSubscription.alertDaysBefore || 3);
      setAutoRenew(editingSubscription.autoRenew ?? true);
      setNotes(editingSubscription.notes || '');
      setWebsiteUrl(editingSubscription.websiteUrl || '');
      setColor(editingSubscription.color || CATEGORY_COLORS[editingSubscription.category] || '#6366F1');
      setTags(editingSubscription.tags || []);
      setUsageFrequency(editingSubscription.usageFrequency || 'daily');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setName('');
      setCategory('Streaming');
      setCost('500');
      setSubCurrency(currency);
      setBillingCycle('monthly');
      setPurchaseDate(todayStr);
      setNextRenewalDate(getRelativeDate(30));
      setPaymentMethod('bKash / Card');
      setStatus('active');
      setIsTrial(false);
      setAlertDaysBefore(3);
      setAutoRenew(true);
      setNotes('');
      setWebsiteUrl('');
      setColor(CATEGORY_COLORS['Streaming'] || '#E50914');
      setTags(['Personal']);
      setUsageFrequency('daily');
    }
    setNewTagInput('');
  }, [editingSubscription, isModalOpen, currency]);

  if (!isModalOpen) return null;

  const currentCurrencySymbol = CURRENCIES.find(c => c.code === subCurrency)?.symbol || '৳';

  const handleCategoryChange = (newCategory: SubscriptionCategory) => {
    setCategory(newCategory);
    if (CATEGORY_COLORS[newCategory]) {
      setColor(CATEGORY_COLORS[newCategory]);
    }
  };

  const handleAddTag = (tagToAdd: string) => {
    const cleanTag = tagToAdd.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags(prev => [...prev, cleanTag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(Number(cost))) return;

    const defaultIcon = CATEGORY_DEFAULT_ICONS[category] || 'CreditCard';
    const isLifetime = billingCycle === 'lifetime';

    const subData: Omit<Subscription, 'id'> = {
      name: name.trim(),
      category,
      cost: Math.max(0, parseFloat(cost)),
      currency: subCurrency,
      billingCycle,
      purchaseDate,
      startDate: purchaseDate,
      nextRenewalDate: isLifetime ? '' : nextRenewalDate,
      paymentMethod: paymentMethod.trim() || undefined,
      status: isLifetime ? 'active' : (isTrial ? 'trial' : status),
      isTrial: isLifetime ? false : isTrial,
      alertDaysBefore: isLifetime ? 0 : Number(alertDaysBefore),
      autoRenew: isLifetime ? false : autoRenew,
      notes: notes.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      color,
      iconName: defaultIcon,
      tags: tags.length > 0 ? tags : undefined,
      usageFrequency,
    };

    if (editingSubscription) {
      updateSubscription(editingSubscription.id, subData);
    } else {
      addSubscription(subData);
    }

    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  const colorPalette = [
    '#E50914', '#1DB954', '#10A37F', '#6366F1', '#A259FF', '#0EA5E9',
    '#F59E0B', '#10B981', '#EC4899', '#FF9900', '#24292E', '#4285F4',
    '#059669', '#0284C7', '#7C3AED', '#DB2777'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.15 }}
        id="subscription-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs transition-all ring-2 ring-neutral-200 dark:ring-neutral-700"
              style={{ backgroundColor: color }}
            >
              <ServiceIcon name={name || 'Service'} category={category} color={color} size="md" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {editingSubscription ? 'Update contract details, purchase date & billing plan' : 'Register a new subscription, license or lifetime purchase'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditingSubscription(null);
            }}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[580px] overflow-y-auto">
          {/* Service Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Service / Subscription Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Netflix, ChatGPT Plus, Figma, Lifetime App"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value as SubscriptionCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Currency, Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {billingCycle === 'lifetime' ? 'One-time Cost' : 'Cost'} ({subCurrency}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold">{currentCurrencySymbol}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Currency
              </label>
              <select
                value={subCurrency}
                onChange={e => setSubCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Billing Cycle *
              </label>
              <select
                value={billingCycle}
                onChange={e => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime (Unlimited Time)</option>
              </select>
            </div>
          </div>

          {/* Purchase Date & Next Renewal Date or Lifetime Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <ShoppingBag size={13} className="text-blue-500" />
                Purchase Date (Start Date) *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {billingCycle === 'lifetime' ? (
              <div className="flex flex-col justify-center p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-bold text-xs">
                  <InfinityIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Unlimited Lifetime Access
                </div>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5 leading-snug">
                  No renewal or expiration date selection is needed. Duration is permanently unlimited.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-500" />
                  Next Renewal Date *
                </label>
                <input
                  type="date"
                  required
                  value={nextRenewalDate}
                  onChange={e => setNextRenewalDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
          </div>

          {/* Usage & Activity Frequency + Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Activity size={13} className="text-emerald-500" />
                Usage & Activity Frequency
              </label>
              <select
                value={usageFrequency}
                onChange={e => setUsageFrequency(e.target.value as UsageFrequency)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="daily">Daily Active (High Priority)</option>
                <option value="weekly">Weekly Regular</option>
                <option value="monthly">Monthly Occasional</option>
                <option value="rarely">Rarely / Infrequent (Smart Audit Target)</option>
                <option value="unused">Unused / Dormant (Recommend Cancel)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <CreditCard size={13} className="text-neutral-400" />
                Payment Method
              </label>
              <input
                type="text"
                placeholder="e.g. bKash, Visa Card, PayPal, Apple Pay"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Hash size={13} className="text-blue-600 dark:text-blue-400" />
                Custom Tags & Labels
              </label>
              <span className="text-[11px] text-neutral-400">Filter easily in table & analytics</span>
            </div>

            {/* Active Tags Chips */}
            <div className="flex items-center gap-1.5 flex-wrap min-h-[28px]">
              {tags.length === 0 ? (
                <span className="text-[11px] text-neutral-400 italic">No tags assigned yet</span>
              ) : (
                tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Tag Input & Quick Suggestions */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type new tag & press Enter (e.g. Work, Personal, Team)..."
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="flex items-center gap-1 flex-wrap text-[11px]">
              <span className="text-neutral-400 mr-1">Quick Tags:</span>
              {COMMON_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-400 text-[10px] font-medium cursor-pointer"
                >
                  +# {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Free Trial Toggles (Only for recurring subscriptions) */}
          {billingCycle !== 'lifetime' && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                    Free Trial Period
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Triggers renewal alert before trial expires and auto-renews
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrial}
                    onChange={e => setIsTrial(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                    Auto-Renew Enabled
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Service will automatically charge upon renewal date
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={e => setAutoRenew(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Brand Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Card & Badge Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPalette.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-transform flex items-center justify-center cursor-pointer ${
                    color === c ? 'scale-115 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-900' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Notes & Contract Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lifetime single license; unlimited access; purchased via AppSumo."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSubscription(null);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              {editingSubscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
