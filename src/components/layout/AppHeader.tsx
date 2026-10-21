import React from 'react';
import { Sprout, Languages, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  currentLang: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  isDemoMode?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDemoMode = true,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/80 shadow-xs">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-tight">
                {currentLang === 'hi' ? 'आज क्या भाव बिक रहा है?' : 'What Is It Selling For Today?'}
              </h1>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              {currentLang === 'hi'
                ? 'मंडी भाव एवं किसान निर्णय-सहयोग'
                : 'Mandi Price Transparency & Farmer Decision Support'}
            </p>
          </div>
        </div>

        {/* Right controls: Demo badge & Language Switcher */}
        <div className="flex items-center space-x-2">
          {isDemoMode && (
            <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Demo</span>
            </span>
          )}

          <button
            onClick={() => onLanguageChange(currentLang === 'hi' ? 'en' : 'hi')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all border border-stone-200"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5 text-stone-500" />
            <span>{currentLang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
