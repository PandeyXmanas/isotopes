/**
 * Safe Indian Rupee (INR) currency and spread formatters
 */

export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatINRPerQuintal(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  return `${formatINR(value)}/क्विंटल`;
}

export interface FormattedDifference {
  text: string;
  isPositive: boolean;
  isNegative: boolean;
  isZero: boolean;
  prefix: string;
}

export function formatPriceDifference(diff: number | null): FormattedDifference {
  if (diff === null || isNaN(diff)) {
    return {
      text: '—',
      isPositive: false,
      isNegative: false,
      isZero: false,
      prefix: '',
    };
  }

  if (diff > 0) {
    return {
      text: `+${formatINR(diff)}`,
      isPositive: true,
      isNegative: false,
      isZero: false,
      prefix: '+',
    };
  }

  if (diff < 0) {
    return {
      text: `-${formatINR(Math.abs(diff))}`,
      isPositive: false,
      isNegative: true,
      isZero: false,
      prefix: '-',
    };
  }

  return {
    text: '₹0 (समान / Same)',
    isPositive: false,
    isNegative: false,
    isZero: true,
    prefix: '',
  };
}

export function formatPercentage(percent: number | null): string {
  if (percent === null || isNaN(percent)) {
    return '';
  }
  const prefix = percent > 0 ? '+' : '';
  return `${prefix}${percent.toFixed(1)}%`;
}
