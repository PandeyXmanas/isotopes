import React from 'react';
import { PackageOpen, CornerDownLeft } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onResetFilters?: () => void;
  lang?: 'en' | 'hi';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  onResetFilters,
  lang = 'hi',
}) => {
  const defaultTitle =
    lang === 'hi' ? 'कोई आवक रिकॉर्ड नहीं मिला' : 'No Market Arrivals Found';
  const defaultMessage =
    lang === 'hi'
      ? 'चयनित फसल की इस जिले में आज कोई आवक या नीलामी दर्ज नहीं की गई है। कृपया दूसरी फसल या निकटवर्ती जिला चुनें।'
      : 'No arrivals or auction transactions were reported for this commodity in the selected market. Try another crop or adjacent district.';
  const resetLabel =
    lang === 'hi' ? 'डिफ़ॉल्ट फ़िल्टर रीसेट करें' : 'Reset to Default Filters';

  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 text-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
        <PackageOpen className="w-6 h-6" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-amber-950 mb-1">
        {title || defaultTitle}
      </h3>

      <p className="text-xs text-amber-900/80 max-w-sm mx-auto mb-4 leading-relaxed">
        {message || defaultMessage}
      </p>

      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-200 active:scale-95 transition-all"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
