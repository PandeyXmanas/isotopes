import { DataFreshnessStatus } from '../features/mandi-prices/types';

/**
 * Date formatting and freshness assessment for Mandi arrival reports
 */

export function calculateFreshness(arrivalDateStr: string): DataFreshnessStatus {
  if (!arrivalDateStr) return 'unknown';

  const arrival = new Date(arrivalDateStr);
  if (isNaN(arrival.getTime())) return 'unknown';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const arrivalDay = new Date(arrival);
  arrivalDay.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - arrivalDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'fresh';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else {
    return 'stale';
  }
}

export function formatDateDisplay(dateStr: string, lang: 'en' | 'hi' = 'hi'): string {
  if (!dateStr) return '—';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = date.getDate();
  const year = date.getFullYear();

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

  const month = lang === 'hi' ? monthsHi[date.getMonth()] : monthsEn[date.getMonth()];
  return `${day} ${month} ${year}`;
}

export function getFreshnessBadgeMeta(freshness: DataFreshnessStatus, lang: 'en' | 'hi' = 'hi') {
  switch (freshness) {
    case 'fresh':
      return {
        label: lang === 'hi' ? 'आज का भाव' : "Today's Rate",
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dotClass: 'bg-emerald-500',
      };
    case 'yesterday':
      return {
        label: lang === 'hi' ? 'कल का भाव' : 'Yesterday',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        dotClass: 'bg-sky-500',
      };
    case 'stale':
      return {
        label: lang === 'hi' ? 'पुराना रिकॉर्ड' : 'Outdated Record',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        dotClass: 'bg-amber-500',
      };
    case 'unknown':
    default:
      return {
        label: lang === 'hi' ? 'अपुष्ट तारीख' : 'Unverified Date',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
        dotClass: 'bg-stone-400',
      };
  }
}
