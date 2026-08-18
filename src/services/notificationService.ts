import { Subscription } from '../types';
import { formatCurrency } from '../utils/calculations';

const NOTIFIED_STORAGE_KEY = 'submanager_notified_renewals_v1';

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isEnabled: boolean;
}

export function getNotificationSupport(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!getNotificationSupport()) return 'denied';
  try {
    return Notification.permission;
  } catch {
    return 'denied';
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!getNotificationSupport()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions & { onClickUrl?: string }
): boolean {
  if (!getNotificationSupport()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const notif = new Notification(title, {
      icon: '/icon.png',
      badge: '/icon.png',
      ...options,
    });

    if (options?.onClickUrl) {
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }
    return true;
  } catch (err) {
    console.warn('Failed to dispatch browser notification:', err);
    return false;
  }
}

/**
 * Checks all subscriptions and triggers browser notifications
 * for any subscription renewing within the next 24 hours.
 */
export function checkAndNotify24hRenewals(
  subscriptions: Subscription[],
  currency: string = 'BDT'
): { notifiedCount: number; notifiedNames: string[] } {
  if (!getNotificationSupport() || Notification.permission !== 'granted') {
    return { notifiedCount: 0, notifiedNames: [] };
  }

  let notifiedMap: Record<string, number> = {};
  try {
    const saved = localStorage.getItem(NOTIFIED_STORAGE_KEY);
    if (saved) {
      notifiedMap = JSON.parse(saved);
    }
  } catch {}

  const now = new Date();
  let notifiedCount = 0;
  const notifiedNames: string[] = [];

  subscriptions.forEach(sub => {
    if (!sub.nextRenewalDate) return;

    const renewalDate = new Date(`${sub.nextRenewalDate}T00:00:00`);
    const diffMs = renewalDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // If renewing within 24 hours (or today/tomorrow, within -6h to +26h window)
    const isWithin24Hours = diffHours >= -6 && diffHours <= 26;

    if (isWithin24Hours) {
      const trackingKey = `${sub.id}_${sub.nextRenewalDate}`;
      const lastNotifiedAt = notifiedMap[trackingKey];

      // Only notify once per renewal date cycle (or if more than 24h passed)
      if (!lastNotifiedAt || Date.now() - lastNotifiedAt > 1000 * 60 * 60 * 20) {
        const costStr = formatCurrency(sub.cost, sub.currency || currency);
        const cycleStr = sub.billingCycle;
        const isTrial = sub.isTrial || sub.status === 'trial';

        const title = isTrial
          ? `⚠️ Free Trial Ending: ${sub.name}`
          : `🔔 Renewal in 24 Hours: ${sub.name}`;

        const body = isTrial
          ? `Your ${sub.name} trial ends in 24 hours. Auto-renewal charge will be ${costStr} (${cycleStr}) unless cancelled.`
          : `Upcoming charge of ${costStr} for ${sub.name} on ${sub.nextRenewalDate}. Status: ${sub.status}.`;

        const sent = sendBrowserNotification(title, {
          body,
          tag: `renewal_${sub.id}`,
          requireInteraction: isTrial,
        });

        if (sent) {
          notifiedMap[trackingKey] = Date.now();
          notifiedCount++;
          notifiedNames.push(sub.name);
        }
      }
    }
  });

  if (notifiedCount > 0) {
    try {
      localStorage.setItem(NOTIFIED_STORAGE_KEY, JSON.stringify(notifiedMap));
    } catch {}
  }

  return { notifiedCount, notifiedNames };
}

export function triggerTestNotification(currency: string = 'BDT'): boolean {
  if (getNotificationPermission() !== 'granted') return false;

  return sendBrowserNotification('🔔 Subscription Renewal Alert (Test)', {
    body: `24-Hour Notice: Netflix Premium is renewing tomorrow for ${formatCurrency(1500, currency)}. Auto-notifications are active!`,
    tag: 'test_alert',
  });
}
