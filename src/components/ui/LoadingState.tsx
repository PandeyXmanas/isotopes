import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'नवीनतम मंडी भाव लोड हो रहे हैं...',
}) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Skeleton Hero Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-stone-200 rounded w-1/3"></div>
          <div className="h-6 bg-stone-200 rounded-full w-24"></div>
        </div>

        <div className="h-10 bg-stone-200 rounded-lg w-1/2"></div>

        <div className="space-y-2 pt-2">
          <div className="h-2 bg-stone-100 rounded-full w-full"></div>
          <div className="flex justify-between text-xs">
            <div className="h-3 bg-stone-200 rounded w-20"></div>
            <div className="h-3 bg-stone-200 rounded w-20"></div>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
          <div className="h-3 bg-stone-200 rounded w-32"></div>
          <div className="h-3 bg-stone-200 rounded w-24"></div>
        </div>
      </div>

      {/* Skeleton Comparison Rows */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="h-4 bg-stone-200 rounded w-1/4 mb-3"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-b-0">
            <div className="space-y-1.5 w-1/2">
              <div className="h-3.5 bg-stone-200 rounded w-3/4"></div>
              <div className="h-2.5 bg-stone-100 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-stone-200 rounded w-20"></div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-stone-400 font-medium py-1">
        {message}
      </div>
    </div>
  );
};

export default LoadingState;
