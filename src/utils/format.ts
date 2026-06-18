export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(Math.round(value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(value);
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}
