import React from 'react';
import { useMandiPrices } from '../hooks/useMandiPrices';
import { formatINRPerQuintal } from '../utils/currency';
import { formatDateDisplay, getFreshnessBadgeMeta } from '../utils/dates';

export const App: React.FC = () => {
  const {
    filter,
    updateFilter,
    data,
    isLoading,
    error,
    crops,
    locations,
    lang,
    setLang,
  } = useMandiPrices();

  const freshnessMeta = data ? getFreshnessBadgeMeta(data.dataFreshness, lang) : null;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg w-full border border-stone-200">
        {/* Header & Lang Toggle */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-lg font-bold text-stone-900 leading-tight">
                आज क्या भाव बिक रहा है?
              </h1>
              <p className="text-xs text-stone-500">
                What Is It Selling For Today?
              </p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300"
          >
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
        </div>

        {/* Milestone 2 status pill */}
        <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg font-medium border border-emerald-200 flex items-center justify-between">
          <span>✓ Milestone 2 Active: Domain Types & Reactive Hook Verified</span>
          {isLoading && <span className="animate-pulse font-bold">लोड हो रहा है...</span>}
        </div>

        {/* Quick filter tester */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
            {lang === 'hi' ? 'फसल चुनें (त्वरित टेस्ट)' : 'Select Commodity'}
          </label>
          <div className="flex flex-wrap gap-2">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => updateFilter({ commodity: c.id })}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter.commodity === c.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {lang === 'hi' ? c.nameHi : c.nameEn}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-stone-600">
            <span className="font-semibold">स्थान / Location:</span>
            <span>{filter.district}, {filter.state}</span>
          </div>
        </div>

        {/* Price hero preview from hook */}
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        ) : data?.primaryRecord ? (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">
                {data.primaryRecord.market}
              </span>
              {freshnessMeta && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${freshnessMeta.badgeClass}`}>
                  {freshnessMeta.label}
                </span>
              )}
            </div>

            <div className="text-3xl font-extrabold text-stone-900 mb-1">
              {formatINRPerQuintal(data.primaryRecord.modalPrice)}
            </div>

            <div className="text-xs text-stone-500 flex justify-between pt-2 border-t border-stone-200">
              <span>न्यूनतम / Min: ₹{data.primaryRecord.minPrice}</span>
              <span>अधिकतम / Max: ₹{data.primaryRecord.maxPrice}</span>
              <span>तारीख: {formatDateDisplay(data.primaryRecord.arrivalDate, lang)}</span>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-stone-400 text-right">
              स्रोतः {data.primaryRecord.source}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-200">
            {data?.notes || 'चयनित फसल की इस मंडी में आवक दर्ज नहीं है।'}
          </div>
        )}

        {/* Regional Mandis Count */}
        {data && data.comparisons.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 flex justify-between items-center">
            <span>समान राज्य की तुलनात्मक मंडियां:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {data.comparisons.length} मंडियां उपलब्ध
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
