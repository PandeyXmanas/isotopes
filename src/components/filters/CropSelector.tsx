import React from 'react';
import { CropOption } from '../../features/mandi-prices/types';
import { Wheat, ChevronDown } from 'lucide-react';

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (cropId: string) => void;
  crops: CropOption[];
  lang?: 'en' | 'hi';
  disabled?: boolean;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onSelectCrop,
  crops,
  lang = 'hi',
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="crop-select"
        className="block text-xs font-bold text-stone-700 flex items-center gap-1.5"
      >
        <Wheat className="w-3.5 h-3.5 text-emerald-700" />
        <span>{lang === 'hi' ? 'फसल चुनें (Crop)' : 'Select Commodity'}</span>
      </label>

      <div className="relative">
        <select
          id="crop-select"
          value={selectedCrop}
          onChange={(e) => onSelectCrop(e.target.value)}
          disabled={disabled}
          className="w-full h-11 pl-3.5 pr-10 text-sm font-semibold text-stone-900 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 transition-all shadow-2xs appearance-none cursor-pointer"
        >
          {crops.map((c) => (
            <option key={c.id} value={c.id}>
              {lang === 'hi' ? `${c.nameHi} (${c.nameEn})` : `${c.nameEn} (${c.nameHi})`}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default CropSelector;
