import React from 'react';
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

  const selectedCropObj = crops.find((c) => c.id === filter.commodity);
  const cropDisplayName =
    lang === 'hi'
      ? selectedCropObj?.nameHi || filter.commodity
      : selectedCropObj?.nameEn || filter.commodity;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* App Header with Brand & Language Switcher */}
      <AppHeader
        currentLang={lang}
        onLanguageChange={setLang}
        isDemoMode={true}
      />

      {/* Main Responsive Body Container */}
      <PageContainer>
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
                ? 'नवीनतम मंडी नीलामी डेटा लोड हो रहा है...'
                : 'Loading latest mandi auction data...'
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
                ? `${filter.district} में ${cropDisplayName} की कोई आवक नहीं`
                : `No arrivals for ${cropDisplayName} in ${filter.district}`
            }
            message={
              data?.notes ||
              (lang === 'hi'
                ? 'चयनित जिले की मंडी में आज इस फसल की नीलामी आवक दर्ज नहीं हुई है। निकटवर्ती जिले या दूसरी फसल का चयन करें।'
                : 'No auction arrivals were recorded for this commodity today in the selected district.')
            }
            onResetFilters={() => setFilter(DEFAULT_FILTER)}
            lang={lang}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* 1. Hero Modal Price Card */}
            <LatestPriceCard
              record={data.primaryRecord}
              lang={lang}
            />

            {/* 2. 7-Day Price Trajectory Chart */}
            <PriceTrendChart
              historicalPoints={data.historicalTrend}
              marketName={data.primaryRecord.market}
              cropName={cropDisplayName}
              lang={lang}
            />

            {/* 3. Regional Mandi Benchmark Comparison */}
            <MandiComparison
              primaryMarket={data.primaryRecord.market}
              comparisons={data.comparisons}
              lang={lang}
            />
          </div>
        )}
      </PageContainer>

      {/* Footer with Indicative Price Disclaimers & Official Attributions */}
      <AppFooter
        sourceName={data?.primaryRecord?.source}
        lang={lang}
      />
    </div>
  );
};

export default App;
