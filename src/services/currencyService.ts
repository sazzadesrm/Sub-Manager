export interface ExchangeRates {
  base: string;
  date: string;
  time_last_updated?: number;
  rates: Record<string, number>;
}

// Fallback rates if offline or API unavailable
const FALLBACK_RATES: Record<string, number> = {
  BDT: 1,
  USD: 0.0083, // 1 BDT = ~0.0083 USD (~120 BDT per USD)
  EUR: 0.0077, // 1 BDT = ~0.0077 EUR (~130 BDT per EUR)
  GBP: 0.0066, // 1 BDT = ~0.0066 GBP (~152 BDT per GBP)
  INR: 0.72,   // 1 BDT = ~0.72 INR
  CAD: 0.0116, // 1 BDT = ~0.0116 CAD
  AUD: 0.0128, // 1 BDT = ~0.0128 AUD
  JPY: 1.28,   // 1 BDT = ~1.28 JPY
};

const CACHE_KEY = 'submanager_exchange_rates_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

export async function fetchLiveExchangeRates(baseCurrency: string = 'BDT'): Promise<{
  rates: Record<string, number>;
  lastUpdated: string;
  isLive: boolean;
}> {
  // Check local cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.base === baseCurrency && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return {
          rates: parsed.rates,
          lastUpdated: new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLive: true,
        };
      }
    }
  } catch (e) {
    console.warn('Could not read cached exchange rates', e);
  }

  // Attempt live fetch from open exchange rate endpoints
  try {
    const primaryUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    const response = await fetch(primaryUrl, { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              base: baseCurrency,
              rates: data.rates,
              timestamp: Date.now(),
            })
          );
        } catch {}
        return {
          rates: data.rates,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn('Primary exchange API error, trying backup endpoint...', err);
  }

  // Fallback endpoint
  try {
    const backupUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
    const res = await fetch(backupUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return {
          rates: data.rates,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn('Backup exchange API error, using calibrated default rates.', err);
  }

  return {
    rates: FALLBACK_RATES,
    lastUpdated: 'Offline calibrated rates',
    isLive: false,
  };
}

export function convertFromBDT(
  amountBDT: number,
  targetCurrency: string,
  rates: Record<string, number>
): number {
  if (targetCurrency === 'BDT') return amountBDT;
  const rate = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1;
  return amountBDT * rate;
}
