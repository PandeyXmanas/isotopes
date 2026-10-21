import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  lang?: 'en' | 'hi';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  lang = 'hi',
}) => {
  const defaultTitle = lang === 'hi' ? 'डेटा प्राप्त करने में त्रुटि' : 'Failed to Load Price Data';
  const retryLabel = lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again';

  return (
    <div className="bg-red-50/80 border border-red-200 rounded-2xl p-6 text-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-red-950 mb-1">
        {title || defaultTitle}
      </h3>

      <p className="text-xs text-red-800/90 max-w-sm mx-auto mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
