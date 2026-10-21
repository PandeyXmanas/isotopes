import React from 'react';
import { useMandiPrices } from '../hooks/useMandiPrices';
import { PageContainer } from '../components/layout/PageContainer';
import { AppHeader } from '../components/layout/AppHeader';
import { AppFooter } from '../components/layout/AppFooter';
import { PriceFilters } from '../components/filters/PriceFilters';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { DataFreshnessBadge } from '../components/ui/DataFreshnessBadge';
import { formatINRPerQuintal } from '../utils/currency';
import { formatDateDisplay } from '../utils/dates';
import { DEFAULT_FILTER } from '../features/mandi-prices/constants';

export const App: React.FC = () => {
  const {
    filter,
    setFilter,
    data,
    isLoading,
    error,
    crops,
    locations,
    refetch,
    lang,
    setLang,
  } = useMandiPrices();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* App Header with Brand & Language Toggle */}
      <AppHeader
        currentLang={lang}
        onLanguageChange={setLang}
        isDemoMode={true}
      />

      {/* Main Responsive Body Container */}
      <PageContainer>
        {/* Milestone Indicator */}
        <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-xl font-medium border border-emerald-200/90 flex items-center justify-between">
          <span>✓ Milestone 3 Active: Shell, UI States & Cascading Filters</span>
          <span className="text-[11px] font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
            {lang === 'hi' ? 'सक्रिय' : 'Live'}
          </span>
        </div>

        {/* Filter Card */}
        <PriceFilters
          filter={filter}
          onFilterChange={setFilter}
          crops={crops}
          locations={locations}
          isLoading={isLoading}
          onSearch={refetch}
          lang={lang}
        />

        {/* Content Section: Loading, Error, Empty, or Hero Rate Preview */}
        {isLoading ? (
          <LoadingState
            message={
              lang === 'hi'
                ? 'मंडी नीलामी डेटा लोड हो रहा है...'
                : 'Loading mandi auction records...'
            }
          />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={refetch}
            lang={lang}
          />
        ) : !data?.primaryRecord ? (
          <EmptyState
            title={
              lang === 'hi'
                ? `${filter.district} में ${filter.commodity} की कोई आवक नहीं`
                : `No arrivals for ${filter.commodity} in ${filter.district}`
            }
            message={
              data?.notes ||
              (lang === 'hi'
                ? 'चयनित जिले की मंडी में आज इस फसल की आवक दर्ज नहीं हुई है। निकटवर्ती जिले या दूसरी फसल चुनें।'
                : 'No auction arrivals were reported for this crop today in the selected district.')
            }
            onResetFilters={() => setFilter(DEFAULT_FILTER)}
            lang={lang}
          />
        ) : (
          /* Interim Price Display (Upgraded in Milestone 4) */
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  {lang === 'hi' ? 'प्राथमिक मंडी' : 'Primary Market'}
                </span>
                <h2 className="text-base font-bold text-stone-900">
                  {data.primaryRecord.market}
                </h2>
              </div>
              <DataFreshnessBadge
                arrivalDate={data.primaryRecord.arrivalDate}
                lang={lang}
              />
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
              <div className="text-xs font-semibold text-stone-500 mb-1">
                {lang === 'hi' ? 'मॉडल भाव (Modal Auction Rate)' : 'Modal Auction Price'}
              </div>
              <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {formatINRPerQuintal(data.primaryRecord.modalPrice)}
              </div>
              <div className="text-xs text-stone-500 mt-2 flex flex-wrap justify-between gap-2 pt-2 border-t border-stone-200/70">
                <span>न्यूनतम / Min: ₹{data.primaryRecord.minPrice ?? '—'}</span>
                <span>अधिकतम / Max: ₹{data.primaryRecord.maxPrice ?? '—'}</span>
                <span>तारीख / Date: {formatDateDisplay(data.primaryRecord.arrivalDate, lang)}</span>
              </div>
            </div>

            {data.comparisons.length > 0 && (
              <div className="text-xs text-stone-600 flex justify-between items-center pt-1">
                <span>
                  {lang === 'hi'
                    ? `तुलनात्मक मंडियां उपलब्ध:`
                    : 'Benchmark mandis available:'}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {data.comparisons.length} {lang === 'hi' ? 'मंडियां' : 'Markets'}
                </span>
              </div>
            )}
          </div>
        )}
      </PageContainer>

      {/* Footer with Indicative Price Disclaimer & Attributions */}
      <AppFooter
        sourceName={data?.primaryRecord?.source}
        lang={lang}
      />
    </div>
  );
};

export default App;
