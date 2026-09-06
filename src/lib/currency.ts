const DEFAULT_CURRENCY = { code: 'USD', symbol: '$' };

export function getUserCurrency() {
  // In React Native, we can use the locale or store preference.
  // For now, return USD.
  return DEFAULT_CURRENCY;
}

export function formatCurrency(amount: number): string {
  const { symbol } = getUserCurrency();
  return `${symbol}${amount.toLocaleString()}`;
}
