import React from 'react';
import { calculateFreshness, getFreshnessBadgeMeta, formatDateDisplay } from '../../utils/dates';

interface DataFreshnessBadgeProps {
  arrivalDate: string;
  lang?: 'en' | 'hi';
  className?: string;
  showDate?: boolean;
}

export const DataFreshnessBadge: React.FC<DataFreshnessBadgeProps> = ({
  arrivalDate,
  lang = 'hi',
  className = '',
  showDate = false,
}) => {
  const freshness = calculateFreshness(arrivalDate);
  const meta = getFreshnessBadgeMeta(freshness, lang);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors shadow-2xs ${meta.badgeClass} ${className}`}
      title={meta.label}
    >
      <span className="relative flex h-2 w-2">
        {freshness === 'fresh' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${meta.dotClass}`}></span>
      </span>
      <span>{meta.label}</span>
      {showDate && (
        <span className="opacity-80 font-normal">
          ({formatDateDisplay(arrivalDate, lang)})
        </span>
      )}
    </span>
  );
};

export default DataFreshnessBadge;
