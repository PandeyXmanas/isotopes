import React from 'react';
import { MarketComparisonRow } from '../../features/mandi-prices/types';
import { formatINR, formatINRPerQuintal, formatPriceDifference, formatPercentage } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/dates';
import { ArrowUpRight, ArrowDownRight, Minus, Building2, Check } from 'lucide-react';

interface MandiPriceRowProps {
  row: MarketComparisonRow;
  lang?: 'en' | 'hi';
  isBaseMarket?: boolean;
}

export const MandiPriceRow: React.FC<MandiPriceRowProps> = ({
  row,
  lang = 'hi',
  isBaseMarket = false,
}) => {
  const diffMeta = formatPriceDifference(row.priceDifference);

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isBaseMarket
          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
          : 'bg-white hover:bg-stone-50/80 border-stone-200/90'
      }`}
    >
      {/* Market Name & District */}
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-stone-900 truncate">
            {row.market}
          </span>
          {isBaseMarket && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-full">
              <Check className="w-2.5 h-2.5" />
              <span>{lang === 'hi' ? 'आपकी चयनित मंडी' : 'Selected Mandi'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-stone-400" />
            <span>{row.district}, {row.state}</span>
          </span>
          <span>•</span>
          <span className="text-[11px] text-stone-400">
            {formatDateDisplay(row.arrivalDate, lang)}
          </span>
        </div>
      </div>

      {/* Price & Spread Pill */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
        {/* Modal Price */}
        <div className="text-left sm:text-right">
          <div className="text-base sm:text-lg font-extrabold text-stone-900">
            {row.modalPrice !== null ? formatINRPerQuintal(row.modalPrice) : '—'}
          </div>
          {row.minPrice !== null && row.maxPrice !== null && (
            <div className="text-[10px] text-stone-400">
              ₹{row.minPrice} - ₹{row.maxPrice}
            </div>
          )}
        </div>

        {/* Spread badge relative to primary mandi */}
        {!isBaseMarket && row.priceDifference !== null ? (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 ${
              diffMeta.isPositive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : diffMeta.isNegative
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {diffMeta.isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
            {diffMeta.isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
            {diffMeta.isZero && <Minus className="w-3.5 h-3.5" />}
            <span>{diffMeta.text}</span>
            {row.percentageDifference !== null && !diffMeta.isZero && (
              <span className="text-[10px] opacity-80">
                ({formatPercentage(row.percentageDifference)})
              </span>
            )}
          </div>
        ) : isBaseMarket ? (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-xl">
            {lang === 'hi' ? 'आधार दर (Base)' : 'Base Rate'}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default MandiPriceRow;
