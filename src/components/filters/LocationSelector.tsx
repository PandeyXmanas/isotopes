import React from 'react';
import { StateLocation } from '../../features/mandi-prices/types';
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  selectedMarket: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  onMarketChange: (market: string) => void;
  locations: StateLocation[];
  lang?: 'en' | 'hi';
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedDistrict,
  selectedMarket,
  onStateChange,
  onDistrictChange,
  onMarketChange,
  locations,
  lang = 'hi',
  disabled = false,
}) => {
  const currentStateObj = locations.find((l) => l.state === selectedState) || locations[0];
  const availableDistricts = currentStateObj ? currentStateObj.districts : [];
  const availableMarkets = availableDistricts.flatMap((district) =>
    (district.markets ?? []).map((market) => ({ market, district: district.id }))
  );

  const handleStateSelect = (newState: string) => {
    onStateChange(newState);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* State Dropdown */}
      <div className="space-y-1.5">
        <label
          htmlFor="state-select"
          className="block text-xs font-bold text-stone-700 flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>{lang === 'hi' ? 'राज्य (State)' : 'State'}</span>
        </label>
        <div className="relative">
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
            disabled={disabled}
            className="w-full h-11 pl-3.5 pr-10 text-sm font-semibold text-stone-900 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 transition-all shadow-2xs appearance-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc.state} value={loc.state}>
                {lang === 'hi' ? `${loc.stateHi} (${loc.state})` : loc.state}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* District Dropdown */}
      <div className="space-y-1.5">
        <label
          htmlFor="district-select"
          className="block text-xs font-bold text-stone-700 flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-stone-400" />
          <span>{lang === 'hi' ? 'जिला (District)' : 'District'}</span>
        </label>
        <div className="relative">
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={disabled || availableDistricts.length === 0}
            className="w-full h-11 pl-3.5 pr-10 text-sm font-semibold text-stone-900 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 transition-all shadow-2xs appearance-none cursor-pointer"
          >
            {availableDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {lang === 'hi' ? `${d.nameHi} (${d.nameEn})` : d.nameEn}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Market / Mandi Dropdown */}
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="market-select" className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>{lang === 'hi' ? 'मंडी (Market)' : 'Mandi / Market'}</span>
        </label>
        <div className="relative">
          <select
            id="market-select"
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            disabled={disabled || availableMarkets.length === 0}
            className="w-full h-11 pl-3.5 pr-10 text-sm font-semibold text-stone-900 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 transition-all shadow-2xs appearance-none cursor-pointer"
          >
            {availableMarkets.map(({ market, district }) => <option key={`${district}-${market}`} value={market}>{market} · {district}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
