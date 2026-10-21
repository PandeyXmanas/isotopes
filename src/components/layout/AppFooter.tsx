import React from 'react';
import { ShieldAlert, Info, ExternalLink } from 'lucide-react';
import { APP_DISCLAIMERS } from '../../features/mandi-prices/constants';

interface AppFooterProps {
  sourceName?: string;
  lang?: 'en' | 'hi';
}

export const AppFooter: React.FC<AppFooterProps> = ({
  sourceName,
  lang = 'hi',
}) => {
  const disclaimer = APP_DISCLAIMERS[lang];

  return (
    <footer className="mt-8 border-t border-stone-200/80 bg-white/50 backdrop-blur-xs py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Indicative Price Notice Box */}
        <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs text-amber-900 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{disclaimer.title}</span>
          </div>
          <p className="text-amber-900/90 text-[11px] sm:text-xs">
            {disclaimer.body}
          </p>
        </div>

        {/* Source attribution & metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>
              {disclaimer.sourceLabel}:{' '}
              <strong className="text-stone-700 font-semibold">
                {sourceName || disclaimer.defaultSource}
              </strong>
            </span>
          </div>

          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
          >
            <span>{lang === 'hi' ? 'आधिकारिक एगमार्कनेट पोर्टल' : 'Official Agmarknet Portal'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="text-center text-[10px] text-stone-400">
          Built for the Agricultural Trade Hackathon • What Is It Selling For Today?
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
