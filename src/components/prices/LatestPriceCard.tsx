import React from 'react';
import { MandiPriceRecord } from '../../features/mandi-prices/types';
import { DataFreshnessBadge } from '../ui/DataFreshnessBadge';
import { formatINRPerQuintal, formatINR } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/dates';
import { Building2, Calendar, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface LatestPriceCardProps {
  record: MandiPriceRecord;
  lang?: 'en' | 'hi';
  className?: string;
}

export const LatestPriceCard: React.FC<LatestPriceCardProps> = ({
  record,
  lang = 'hi',
  className = '',
}) => {
  const isUnreported = record.modalPrice === null;

  // Calculate percentage position of modal price between min and max
  let percentageAcrossRange = 50;
  if (!isUnreported && record.minPrice !== null && record.maxPrice !== null && record.maxPrice > record.minPrice) {
    percentageAcrossRange = Math.min(
      100,
      Math.max(0, ((record.modalPrice! - record.minPrice) / (record.maxPrice - record.minPrice)) * 100)
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm relative overflow-hidden space-y-4 sm:space-y-5 transition-all ${className}`}
    >
      {/* Top subtle decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

      {/* Header: Market & Freshness */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{record.district}, {record.state}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {record.market}
          </h2>
        </div>

        <DataFreshnessBadge
          arrivalDate={record.arrivalDate}
          lang={lang}
          className="shrink-0"
        />
      </div>

      {/* Primary Modal Rate Display */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 to-stone-50/90 border border-emerald-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-900">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {lang === 'hi'
                ? 'मॉडल भाव (सर्वाधिक बिकवाली दर)'
                : 'Modal Auction Price (FAQ Benchmark)'}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
            <span>{record.commodityHi || record.commodity}</span>
          </span>
        </div>

        {isUnreported ? (
          <div className="py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200/70 flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              {lang === 'hi'
                ? 'नीलामी प्रक्रियाधीन • मॉडल भाव अभी दर्ज नहीं हुआ है'
                : 'Auction in progress • Modal price not yet reported'}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {formatINRPerQuintal(record.modalPrice)}
            </span>
          </div>
        )}

        {/* Min - Max Auction Spread Range Track */}
        {record.minPrice !== null && record.maxPrice !== null && (
          <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <span className="text-stone-500">
                {lang === 'hi' ? 'न्यूनतम दर' : 'Min Rate'}:{' '}
                <strong className="text-stone-800 font-extrabold">{formatINR(record.minPrice)}</strong>
              </span>
              <span className="text-stone-500">
                {lang === 'hi' ? 'अधिकतम दर' : 'Max Rate'}:{' '}
                <strong className="text-stone-800 font-extrabold">{formatINR(record.maxPrice)}</strong>
              </span>
            </div>

            {/* Visual Bar Track */}
            <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${percentageAcrossRange}%` }}
              />
            </div>
            <div className="text-[10px] text-stone-400 text-center font-medium">
              {lang === 'hi'
                ? 'नीलामी भाव सीमा (न्यूनतम से अधिकतम)'
                : 'Reported auction range for standard grade'}
            </div>
          </div>
        )}
      </div>

      {/* Date & Source Metadata Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2 pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>
            {lang === 'hi' ? 'रिपोर्टिंग तारीख:' : 'Reporting Date:'}{' '}
            <strong className="text-stone-700 font-semibold">
              {formatDateDisplay(record.arrivalDate, lang)}
            </strong>
          </span>
        </div>

        <div className="text-[11px] text-stone-400 sm:text-right">
          {lang === 'hi' ? 'स्रोत:' : 'Source:'} {record.source}
        </div>
      </div>
    </div>
  );
};

export default LatestPriceCard;
