import React, { useState, useEffect, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
  PresetSubscription,
  UsageFrequency
} from '../types';
import { CATEGORIES, CATEGORY_COLORS, POPULAR_PRESETS, CURRENCIES, getRelativeDate, COMMON_TAGS } from '../data/subscriptionsData';
import { LUCIDE_ICON_OPTIONS, CATEGORY_DEFAULT_ICONS, IconOption } from '../data/iconLibrary';
import { ServiceIcon } from './ServiceIcon';
import { formatCurrency } from '../utils/calculations';
import {
  X,
  Sparkles,
  Plus,
  Check,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  Globe,
  CreditCard,
  Search,
  CheckCircle2,
  ChevronDown,
  Activity,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  const [activeTab, setActiveTab] = useState<'custom' | 'presets'>('custom');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('Streaming');
  const [cost, setCost] = useState<string>('500');
  const [subCurrency, setSubCurrency] = useState(currency);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextRenewalDate, setNextRenewalDate] = useState(getRelativeDate(30));
  const [paymentMethod, setPaymentMethod] = useState('bKash / Card');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [isTrial, setIsTrial] = useState(false);
  const [alertDaysBefore, setAlertDaysBefore] = useState<number>(3);
  const [autoRenew, setAutoRenew] = useState(true);
  const [notes, setNotes] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [iconName, setIconName] = useState('Tv');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [usageFrequency, setUsageFrequency] = useState<UsageFrequency>('daily');

  // Icon Picker Filter State
  const [iconSearch, setIconSearch] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState<string>('All');
  const [showFullIconGrid, setShowFullIconGrid] = useState(false);

  // Reset or populate when opened
  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setCategory(editingSubscription.category);
      setCost(editingSubscription.cost.toString());
      setSubCurrency(editingSubscription.currency || currency);
      setBillingCycle(editingSubscription.billingCycle);
      setNextRenewalDate(editingSubscription.nextRenewalDate);
      setPaymentMethod(editingSubscription.paymentMethod || '');
      setStatus(editingSubscription.status);
      setIsTrial(!!editingSubscription.isTrial);
      setAlertDaysBefore(editingSubscription.alertDaysBefore || 3);
      setAutoRenew(editingSubscription.autoRenew ?? true);
      setNotes(editingSubscription.notes || '');
      setWebsiteUrl(editingSubscription.websiteUrl || '');
      setColor(editingSubscription.color || '#6366F1');
      setIconName(editingSubscription.iconName || CATEGORY_DEFAULT_ICONS[editingSubscription.category] || 'CreditCard');
      setTags(editingSubscription.tags || []);
      setUsageFrequency(editingSubscription.usageFrequency || 'daily');
      setActiveTab('custom');
    } else {
      setName('');
      setCategory('Streaming');
      setCost('500');
      setSubCurrency(currency);
      setBillingCycle('monthly');
      setNextRenewalDate(getRelativeDate(30));
      setPaymentMethod('bKash / Card');
      setStatus('active');
      setIsTrial(false);
      setAlertDaysBefore(3);
      setAutoRenew(true);
      setNotes('');
      setWebsiteUrl('');
      setColor(CATEGORY_COLORS['Streaming'] || '#E50914');
      setIconName(CATEGORY_DEFAULT_ICONS['Streaming'] || 'Tv');
      setTags(['Personal']);
      setUsageFrequency('daily');
      setActiveTab('presets');
    }
    setNewTagInput('');
    setIconSearch('');
    setSelectedIconCategory('All');
    setShowFullIconGrid(false);
  }, [editingSubscription, isModalOpen, currency]);

  // Filtered icons for the picker
  const filteredIcons = useMemo(() => {
    return LUCIDE_ICON_OPTIONS.filter(icon => {
      const matchCat =
        selectedIconCategory === 'All' ||
        icon.category === selectedIconCategory ||
        (selectedIconCategory === 'Selected Category' && icon.category === category);

      if (!matchCat) return false;

      if (!iconSearch.trim()) return true;

      const q = iconSearch.toLowerCase();
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.id.toLowerCase().includes(q) ||
        icon.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }, [selectedIconCategory, category, iconSearch]);

  if (!isModalOpen) return null;

  const currentCurrencySymbol = CURRENCIES.find(c => c.code === subCurrency)?.symbol || '৳';

  const handleApplyPreset = (preset: PresetSubscription) => {
    setName(preset.name);
    setCategory(preset.category);
    setCost(preset.defaultCost.toString());
    setBillingCycle(preset.billingCycle);
    setColor(preset.color);
    setIconName(preset.iconName);
    setWebsiteUrl(preset.websiteUrl);
    setTags(preset.tags || ['Personal']);
    setActiveTab('custom');
  };

  const handleCategoryChange = (newCategory: SubscriptionCategory) => {
    setCategory(newCategory);
    if (CATEGORY_COLORS[newCategory]) {
      setColor(CATEGORY_COLORS[newCategory]);
    }
    if (CATEGORY_DEFAULT_ICONS[newCategory]) {
      setIconName(CATEGORY_DEFAULT_ICONS[newCategory]);
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

    const subData: Omit<Subscription, 'id'> = {
      name: name.trim(),
      category,
      cost: Math.max(0, parseFloat(cost)),
      currency: subCurrency,
      billingCycle,
      nextRenewalDate,
      paymentMethod: paymentMethod.trim() || undefined,
      status: isTrial ? 'trial' : status,
      isTrial,
      alertDaysBefore: Number(alertDaysBefore),
      autoRenew,
      notes: notes.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      color,
      iconName,
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
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
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
              <ServiceIcon name={name || 'Service'} iconName={iconName} category={category} color={color} size="md" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {editingSubscription ? 'Update billing, custom tags, and renewal preferences' : 'Track a recurring service with tags, custom icon & usage frequency'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditingSubscription(null);
            }}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector for New Subscriptions */}
        {!editingSubscription && (
          <div className="flex border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 px-5 pt-3">
            <button
              onClick={() => setActiveTab('presets')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Sparkles size={14} />
              Choose Popular Preset
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Plus size={14} />
              Custom Subscription & Details
            </button>
          </div>
        )}

        {/* Tab 1: Popular Preset Grid */}
        {activeTab === 'presets' && !editingSubscription ? (
          <div className="p-5 max-h-[500px] overflow-y-auto">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              Quick 1-Click Templates
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POPULAR_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-800/50 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-left transition-all flex flex-col justify-between gap-2 group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <ServiceIcon
                      name={preset.name}
                      category={preset.category}
                      iconName={preset.iconName}
                      color={preset.color}
                      size="sm"
                    />
                    <div className="truncate font-semibold text-xs text-neutral-900 dark:text-white">
                      {preset.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>{formatCurrency(preset.defaultCost, subCurrency)}/{preset.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">Use</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Or enter custom subscription & icon details &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Custom Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[540px] overflow-y-auto">
            {/* Service Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Service / Subscription Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Figma, Spotify, AWS"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CUSTOM LUCIDE ICON SELECTOR SECTION */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Tag size={13} className="text-blue-600 dark:text-blue-400" />
                    Custom Lucide Icon Selection
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Selected icon: <span className="font-semibold text-blue-600 dark:text-blue-400">{iconName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  >
                    <ServiceIcon name={name} iconName={iconName} category={category} color={color} size="sm" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullIconGrid(!showFullIconGrid)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40"
                  >
                    {showFullIconGrid ? 'Hide Library' : 'Browse All Icons'}
                    <ChevronDown size={13} className={`transition-transform ${showFullIconGrid ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Icon Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search Lucide icons (e.g., tv, music, code, bot, cloud, card)..."
                    value={iconSearch}
                    onChange={e => {
                      setIconSearch(e.target.value);
                      if (!showFullIconGrid) setShowFullIconGrid(true);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Quick Icon Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                  {['All', 'Selected Category', 'Streaming', 'Software', 'Productivity', 'Cloud & Hosting', 'Gaming', 'Health & Fitness', 'Utilities', 'Shopping & Delivery', 'Other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedIconCategory(cat);
                        if (!showFullIconGrid) setShowFullIconGrid(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                        selectedIconCategory === cat
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection Grid */}
              <div
                className={`grid grid-cols-4 sm:grid-cols-6 gap-2 transition-all ${
                  showFullIconGrid ? 'max-h-48 overflow-y-auto pr-1' : 'max-h-24 overflow-hidden'
                }`}
              >
                {filteredIcons.map(iconOpt => {
                  const isSelected = iconName.toLowerCase() === iconOpt.id.toLowerCase();
                  return (
                    <button
                      key={iconOpt.id}
                      type="button"
                      onClick={() => setIconName(iconOpt.id)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: isSelected ? color : '#64748B' }}
                      >
                        <ServiceIcon name="" iconName={iconOpt.id} size="sm" color={isSelected ? color : '#64748B'} />
                      </div>
                      <span className="text-[10px] truncate max-w-full font-medium">{iconOpt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM TAGS SECTION */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Hash size={13} className="text-blue-600 dark:text-blue-400" />
                  Custom Tags & Labels
                </label>
                <span className="text-[11px] text-neutral-400">Filter easily in dashboard</span>
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
                        className="hover:text-rose-600 dark:hover:text-rose-400"
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
                  placeholder="Type new tag & press Enter (e.g. Work, Personal, Shared)..."
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
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  + Add
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-1 flex-wrap text-[11px]">
                <span className="text-neutral-400 mr-1">Suggestions:</span>
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-400 text-[10px] font-medium"
                  >
                    +# {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price, Currency, Billing Cycle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Cost ({subCurrency}) *
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
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Billing Cycle
                </label>
                <select
                  value={billingCycle}
                  onChange={e => setBillingCycle(e.target.value as BillingCycle)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Next Renewal Date & Alert Days Before */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
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

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Renewal Alert Timing (Push Alert)
                </label>
                <select
                  value={alertDaysBefore}
                  onChange={e => setAlertDaysBefore(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={1}>1 day before / 24h (Urgent)</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before (Recommended)</option>
                  <option value={5}>5 days before</option>
                  <option value={7}>7 days before (1 week)</option>
                  <option value={14}>14 days before</option>
                </select>
              </div>
            </div>

            {/* Usage Frequency / Activity Level (For Smart Audit) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Activity size={13} className="text-emerald-500" />
                  Usage & Activity Frequency
                </label>
                <select
                  value={usageFrequency}
                  onChange={e => setUsageFrequency(e.target.value as UsageFrequency)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="daily">Daily Active (High Priority)</option>
                  <option value="weekly">Weekly Regular</option>
                  <option value="monthly">Monthly Occasional</option>
                  <option value="rarely">Rarely / Infrequent (Smart Audit Target)</option>
                  <option value="unused">Unused / Dormant (Recommend Cancel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  placeholder="e.g. bKash, Visa Dual Currency, Apple Pay"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Status & Free Trial Toggles */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                    Free Trial Period
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Triggers 24h browser push alert before trial expires and auto-renews
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

            {/* Brand Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Brand Badge Accent Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {colorPalette.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-xl transition-transform flex items-center justify-center ${
                      color === c ? 'scale-115 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-900' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes & Usage Details for Smart Audit */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Notes & Usage Details (Audited by Smart Savings AI)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Rarely used in past 2 months; family plan; cancel if unused."
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
                className="px-4 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
              >
                {editingSubscription ? 'Save Changes' : 'Add Subscription'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
