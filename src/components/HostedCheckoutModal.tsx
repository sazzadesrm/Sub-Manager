import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency } from '../utils/calculations';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Receipt,
  X,
  Smartphone,
  Building,
  Tag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HostedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostedCheckoutModal: React.FC<HostedCheckoutModalProps> = ({ isOpen, onClose }) => {
  const { currency, addSubscription, addAuditLog } = useSubscriptions();

  const [planType, setPlanType] = useState<'pro_monthly' | 'pro_annual' | 'enterprise'>('pro_annual');
  const [customerName, setCustomerName] = useState('Tanvir Rahman');
  const [customerEmail, setCustomerEmail] = useState('tanvir@innovatebangla.com');
  const [companyName, setCompanyName] = useState('Innovate Bangla Ltd');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('921');
  const [bkashNumber, setBkashNumber] = useState('01711234567');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const planDetails = {
    pro_monthly: { name: 'SubPulse Pro (Monthly)', price: 1200, cycle: 'monthly' as const },
    pro_annual: { name: 'SubPulse Pro (Annual)', price: 11500, cycle: 'yearly' as const },
    enterprise: { name: 'SubPulse Enterprise Suite', price: 35000, cycle: 'yearly' as const },
  };

  const currentPlan = planDetails[planType];
  const subtotal = currentPlan.price;
  const discountAmount = subtotal * appliedDiscount;
  const vatAmount = (subtotal - discountAmount) * 0.05; // 5% VAT
  const totalAmount = subtotal - discountAmount + vatAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE20') {
      setAppliedDiscount(0.20);
      confetti({ particleCount: 25, spread: 45 });
    } else if (couponCode.toUpperCase() === 'DHAKA50') {
      setAppliedDiscount(0.50);
      confetti({ particleCount: 35, spread: 60 });
    } else {
      alert('Invalid coupon code. Try SAVE20 or DHAKA50');
    }
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);
      confetti({ particleCount: 70, spread: 80 });

      // Automatically register newly provisioned service
      addSubscription({
        name: currentPlan.name,
        category: 'Business & SaaS',
        cost: totalAmount,
        currency: currency,
        billingCycle: currentPlan.cycle,
        startDate: new Date().toISOString().split('T')[0],
        nextRenewalDate: currentPlan.cycle === 'yearly' ? '2027-08-17' : '2026-09-17',
        paymentMethod: paymentMethod === 'bkash' ? 'bKash Merchant' : paymentMethod === 'nagad' ? 'Nagad Direct' : 'Visa ending in 8821',
        websiteUrl: 'https://subpulse.io',
        tags: ['Corporate', 'Billing'],
        usageFrequency: 'regular',
        notes: `Hosted checkout order for ${customerName} (${companyName})`,
        color: '#6366F1',
        iconName: 'Shield',
      });

      addAuditLog(`Provisioned new subscription: ${currentPlan.name}`, 'billing', customerName);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hosted Secure Checkout</h3>
              <p className="text-xs text-neutral-400">256-Bit Encrypted Subscription Provisioning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {checkoutSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Payment Confirmed & Account Provisioned!
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Thank you, <span className="font-bold">{customerName}</span>. Your subscription to{' '}
              <span className="font-bold">{currentPlan.name}</span> has been activated and added to your dashboard.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold">SUB-2026-9812</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Billed:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalAmount, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Receipt Sent To:</span>
                <span className="font-medium">{customerEmail}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleCompleteCheckout} className="p-6 sm:p-8 space-y-6">
            {/* Plan selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Select Subscription Plan Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPlanType('pro_monthly')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    planType === 'pro_monthly'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="font-bold text-xs text-neutral-900 dark:text-white">Pro Monthly</div>
                  <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    {formatCurrency(1200, currency)}
                    <span className="text-[10px] text-neutral-400 font-normal">/mo</span>
                  </div>
                </div>

                <div
                  onClick={() => setPlanType('pro_annual')}
                  className={`p-3.5 rounded-2xl border cursor-pointer relative transition-all ${
                    planType === 'pro_annual'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold">
                    Save 20%
                  </span>
                  <div className="font-bold text-xs text-neutral-900 dark:text-white">Pro Annual</div>
                  <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    {formatCurrency(11500, currency)}
                    <span className="text-[10px] text-neutral-400 font-normal">/yr</span>
                  </div>
                </div>

                <div
                  onClick={() => setPlanType('enterprise')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    planType === 'enterprise'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="font-bold text-xs text-neutral-900 dark:text-white">Enterprise</div>
                  <div className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                    {formatCurrency(35000, currency)}
                    <span className="text-[10px] text-neutral-400 font-normal">/yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Customer / Billing Contact
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Billing Email (Invoices will be sent here)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Instrument
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <CreditCard size={14} /> Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Smartphone size={14} /> bKash Direct
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Smartphone size={14} /> Nagad Pay
                </button>
              </div>

              {/* Dynamic Payment Input Details */}
              <div className="mt-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                {paymentMethod === 'card' ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-0.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-0.5">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-0.5">CVC / CVV</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-0.5">
                      {paymentMethod === 'bkash' ? 'bKash Wallet Number' : 'Nagad Account Number'}
                    </label>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={e => setBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Promo code (SAVE20, DHAKA50)..."
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs uppercase font-mono w-full"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-xl text-xs font-semibold shrink-0"
              >
                Apply Code
              </button>
            </div>

            {/* Order Summary & Totals */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal ({currentPlan.name})</span>
                <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedDiscount * 100}%)</span>
                  <span>-{formatCurrency(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Tax / VAT (5%)</span>
                <span>+{formatCurrency(vatAmount, currency)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-sm text-neutral-900 dark:text-white">
                <span>Total Amount Due</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount, currency)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Securing Payment & Authorizing...</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Authorize & Subscribe Now ({formatCurrency(totalAmount, currency)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
