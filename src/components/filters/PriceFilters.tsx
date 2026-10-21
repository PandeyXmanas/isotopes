import React from 'react';
import { MandiPriceFilter, CropOption, StateLocation } from '../../features/mandi-prices/types';
import { CropSelector } from './CropSelector';
import { LocationSelector } from './LocationSelector';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface PriceFiltersProps {
  filter: MandiPriceFilter;
  onFilterChange: (newFilter: MandiPriceFilter) => void;
  crops: CropOption[];
  locations: StateLocation[];
  isLoading: boolean;
  onSearch?: () => void;
  lang?: 'en' | 'hi';
}

export const PriceFilters: React.FC<PriceFiltersProps> = ({
  filter,
  onFilterChange,
  crops,
  locations,
  isLoading,
  onSearch,
  lang = 'hi',
}) => {
  const handleCropChange = (cropId: string) => {
    onFilterChange({
      ...filter,
      commodity: cropId,
    });
  };

  const handleStateChange = (state: string) => {
    const nextState = locations.find((location) => location.state === state);
    const nextDistrict = nextState?.districts[0];
    onFilterChange({
      ...filter,
      state,
      district: nextDistrict?.id ?? '',
      market: nextDistrict?.markets?.[0] ?? '',
    });
  };

  const handleDistrictChange = (district: string) => {
    const nextDistrict = locations.find((location) => location.state === filter.state)?.districts.find((option) => option.id === district);
    onFilterChange({
      ...filter,
      district,
      market: nextDistrict?.markets?.[0] ?? '',
    });
  };

  const handleMarketChange = (market: string) => {
    const nextDistrict = locations.find((location) => location.state === filter.state)?.districts.find((district) => district.markets?.includes(market));
    onFilterChange({ ...filter, market, district: nextDistrict?.id ?? filter.district });
  };

  const handleReset = () => {
    const firstLocation = locations[0];
    onFilterChange({
      commodity: crops[0]?.id ?? '',
      state: firstLocation?.state ?? '',
      district: firstLocation?.districts[0]?.id ?? '',
      market: firstLocation?.districts[0]?.markets?.[0] ?? '',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-stone-800">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'hi' ? 'मंडी एवं फसल चयन' : 'Market & Commodity Search'}</span>
        </div>

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 disabled:opacity-50 transition-colors"
          title="Reset to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Crop Selector */}
        <CropSelector
          selectedCrop={filter.commodity}
          onSelectCrop={handleCropChange}
          crops={crops}
          lang={lang}
          disabled={isLoading}
        />

        {/* Cascading Location Selector */}
        <LocationSelector
          selectedState={filter.state}
          selectedDistrict={filter.district}
          selectedMarket={filter.market ?? ''}
          onStateChange={handleStateChange}
          onDistrictChange={handleDistrictChange}
          onMarketChange={handleMarketChange}
          locations={locations}
          lang={lang}
          disabled={isLoading}
        />
      </div>

      {/* Query CTA button */}
      <div className="pt-1">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>
            {isLoading
              ? lang === 'hi'
                ? 'भाव खोजे जा रहे हैं...'
                : 'Fetching Prices...'
              : lang === 'hi'
              ? 'ताजा मंडी भाव देखें (Check Rates)'
              : 'Check Latest Mandi Rates'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PriceFilters;
