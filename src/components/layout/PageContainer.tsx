import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      <main className={`flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
