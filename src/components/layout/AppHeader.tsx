import React from 'react';
import { Sprout, Languages, UploadCloud, LayoutDashboard } from 'lucide-react';

interface AppHeaderProps {
  currentLang: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  activeView?: 'dashboard' | 'admin';
  onViewChange?: (view: 'dashboard' | 'admin') => void;
  isDemoMode?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeView = 'dashboard',
  onViewChange,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/80 shadow-xs">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div
          onClick={() => onViewChange?.('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20 shrink-0">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-tight">
                {currentLang === 'hi' ? 'आज क्या भाव बिक रहा है?' : 'What Is It Selling For Today?'}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
              {currentLang === 'hi'
                ? 'सरकारी एगमार्कनेट दैनिक नीलामी रिपोर्ट'
                : 'Official Agmarknet Mandi Auction Intelligence'}
            </p>
          </div>
        </div>

        {/* Right controls: View Toggle & Language Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {onViewChange && (
            <button
              onClick={() => onViewChange(activeView === 'dashboard' ? 'admin' : 'dashboard')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                activeView === 'admin'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
              }`}
              title={activeView === 'admin' ? 'Back to Mandi Dashboard' : 'Upload Data'}
            >
              {activeView === 'admin' ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{currentLang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden xs:inline">{currentLang === 'hi' ? 'डेटा जोड़ें' : 'Upload'}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onLanguageChange(currentLang === 'hi' ? 'en' : 'hi')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all border border-stone-200"
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
