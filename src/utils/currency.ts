import { CurrencyCode } from '../types';

export const RATES_TO_RWF: Record<CurrencyCode, number> = {
  RWF: 1,
  USD: 1350,
  EUR: 1450,
};

export function convertFromRwf(amountRwf: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'RWF') return amountRwf;
  const rate = RATES_TO_RWF[targetCurrency];
  return Number((amountRwf / rate).toFixed(2));
}

export function convertToRwf(amount: number, fromCurrency: CurrencyCode): number {
  if (fromCurrency === 'RWF') return amount;
  return Math.round(amount * RATES_TO_RWF[fromCurrency]);
}

export function formatPrice(amountRwf: number, currency: CurrencyCode): string {
  const converted = convertFromRwf(amountRwf, currency);
  if (currency === 'RWF') {
    return `${Math.round(converted).toLocaleString('en-US')} RWF`;
  }
  if (currency === 'USD') {
    return `$${converted.toFixed(2)}`;
  }
  if (currency === 'EUR') {
    return `€${converted.toFixed(2)}`;
  }
  return `${amountRwf} RWF`;
}
