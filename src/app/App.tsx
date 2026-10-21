import React, { useState } from 'react';
import { useMandiPrices } from '../hooks/useMandiPrices';
import { PageContainer } from '../components/layout/PageContainer';
import { AppHeader } from '../components/layout/AppHeader';
import { AppFooter } from '../components/layout/AppFooter';
import { PriceFilters } from '../components/filters/PriceFilters';
import { LatestPriceCard } from '../components/prices/LatestPriceCard';
import { MandiComparison } from '../components/prices/MandiComparison';
import { PriceTrendChart } from '../components/prices/PriceTrendChart';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { AddData } from '../components/admin/AddData';
import { DEFAULT_FILTER } from '../features/mandi-prices/constants';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'admin'>('dashboard');

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

  const selectedCropObj = crops.find((c) => c.id.toLowerCase() === filter.commodity.toLowerCase());
  const cropDisplayName =
    lang === 'hi'
      ? selectedCropObj?.nameHi || filter.commodity
      : selectedCropObj?.nameEn || filter.commodity;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* App Header with Brand, View Switcher & Language Switcher */}
      <AppHeader
        currentLang={lang}
        onLanguageChange={setLang}
        activeView={activeView}
        onViewChange={setActiveView}
        isDemoMode={false}
      />

      {/* Main Responsive Body Container */}
      <PageContainer>
        {activeView === 'admin' ? (
          <div className="space-y-4">
            <AddData
              onAddRecord={() => {
                refetch();
                setActiveView('dashboard');
              }}
              onImportCsv={() => {
                refetch();
                setActiveView('dashboard');
              }}
            />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
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

            {/* Content Section: Loading, Error, Empty, or Full Mandi Rate Intelligence */}
            {isLoading ? (
              <LoadingState
                message={
                  lang === 'hi'
                    ? 'सरकारी एगमार्कनेट नीलामी रिकॉर्ड लोड हो रहे हैं...'
                    : 'Loading official Agmarknet auction records...'
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
                    ? `${cropDisplayName} का रिकॉर्ड नहीं मिला`
                    : `No records for ${cropDisplayName}`
                }
                message={
                  data?.notes ||
                  (lang === 'hi'
                    ? 'चयनित फसल का इस तारीख का नीलामी डेटा उपलब्ध नहीं है।'
                    : 'No auction records found for this selection.')
                }
                onResetFilters={() => setFilter(DEFAULT_FILTER)}
                lang={lang}
              />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Government MSP Notice Banner if available */}
                {data.notes && (
                  <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-950 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold leading-relaxed">{data.notes}</span>
                  </div>
                )}

                {/* 1. Hero Modal Price Card */}
                <LatestPriceCard
                  record={data.primaryRecord}
                  lang={lang}
                />

                {/* 2. Price Trajectory Chart */}
                <PriceTrendChart
                  historicalPoints={data.historicalTrend}
                  marketName={data.primaryRecord.market}
                  cropName={cropDisplayName}
                  lang={lang}
                />

                {/* 3. Cross-Commodity & Regional Mandi Benchmark Comparison */}
                <MandiComparison
                  primaryMarket={data.primaryRecord.market}
                  comparisons={data.comparisons}
                  lang={lang}
                />
              </div>
            )}
          </div>
        )}
      </PageContainer>

      {/* Footer with Indicative Price Disclaimers & Official Attributions */}
      <AppFooter
        sourceName={data?.primaryRecord?.source || 'Agmarknet / MoA&FW Official Market Report'}
        lang={lang}
      />
    </div>
  );
};

export default App;
