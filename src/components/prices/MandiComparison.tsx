import React, { useState, useMemo } from 'react';
import { MarketComparisonRow } from '../../features/mandi-prices/types';
import { MandiPriceRow } from './MandiPriceRow';
import { formatINR } from '../../utils/currency';
import { SlidersHorizontal, ArrowUpDown, TrendingUp, Info } from 'lucide-react';

interface MandiComparisonProps {
  primaryMarket: string;
  comparisons: MarketComparisonRow[];
  lang?: 'en' | 'hi';
  className?: string;
}

export const MandiComparison: React.FC<MandiComparisonProps> = ({
  primaryMarket,
  comparisons,
  lang = 'hi',
  className = '',
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | 'default'>('default');

  // Identify top market with highest rate
  const highestMarket = useMemo(() => {
    if (!comparisons || comparisons.length <= 1) return null;
    const nonBase = comparisons.filter((c) => !c.isBaseMarket && c.modalPrice !== null);
    if (nonBase.length === 0) return null;
    return nonBase.reduce((max, current) =>
      (current.modalPrice ?? 0) > (max.modalPrice ?? 0) ? current : max
    );
  }, [comparisons]);

  const sortedRows = useMemo(() => {
    if (sortOrder === 'default') return comparisons;
    const copy = [...comparisons];
    return copy.sort((a, b) => {
      // Keep base market at top regardless
      if (a.isBaseMarket) return -1;
      if (b.isBaseMarket) return 1;

      const priceA = a.modalPrice ?? 0;
      const priceB = b.modalPrice ?? 0;
      return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
    });
  }, [comparisons, sortOrder]);

  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4 ${className}`}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'hi' ? 'क्षेत्रीय बेंचमार्किंग' : 'Regional Benchmarking'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            {lang === 'hi'
              ? 'अन्य मंडियों से भाव तुलना'
              : 'Cross-Market Price Comparison'}
          </h3>
        </div>

        {/* Sort toggle button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() =>
              setSortOrder((prev) =>
                prev === 'default' ? 'desc' : prev === 'desc' ? 'asc' : 'default'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition-all border border-stone-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {sortOrder === 'desc'
                ? lang === 'hi'
                  ? 'उच्चतम भाव पहले'
                  : 'Highest Price'
                : sortOrder === 'asc'
                ? lang === 'hi'
                  ? 'न्यूनतम भाव पहले'
                  : 'Lowest Price'
                : lang === 'hi'
                ? 'क्रमबद्ध करें (Sort)'
                : 'Sort Prices'}
            </span>
          </button>
        </div>
      </div>

      {/* Decision-support highlight pill */}
      {highestMarket && highestMarket.priceDifference && highestMarket.priceDifference > 0 && (
        <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3 text-xs text-emerald-950 flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">
              {lang === 'hi' ? 'बेहतर भाव अवसर:' : 'Higher Price Opportunity:'}{' '}
            </strong>
            <span>
              {highestMarket.market} में भाव आपकी चयनित मंडी से{' '}
              <strong className="text-emerald-800 font-extrabold">
                +{formatINR(highestMarket.priceDifference)}
              </strong>{' '}
              अधिक है। परिवहन व आढ़त खर्च की गणना करके ही निर्णय लें।
            </span>
          </div>
        </div>
      )}

      {/* List of Mandi Comparison Rows */}
      <div className="space-y-2.5">
        {sortedRows.map((row) => (
          <MandiPriceRow
            key={`${row.state}-${row.district}-${row.market}`}
            row={row}
            lang={lang}
            isBaseMarket={row.isBaseMarket}
          />
        ))}
      </div>

      {/* Guidance note */}
      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-1">
        <Info className="w-3 h-3 text-stone-400 shrink-0" />
        <span>
          {lang === 'hi'
            ? 'अंतर (Spread) की गणना आपकी प्राथमिक मंडी के मॉडल भाव के सापेक्ष की गई है।'
            : 'Price difference is benchmarked against your primary selected market rate.'}
        </span>
      </div>
    </div>
  );
};

export default MandiComparison;
