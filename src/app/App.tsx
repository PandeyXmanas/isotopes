import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-md w-full text-center border border-stone-200">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full mb-4">
          🌾
        </div>
        <h1 className="text-xl font-bold text-stone-900 mb-1">
          आज क्या भाव बिक रहा है?
        </h1>
        <p className="text-sm text-stone-500 mb-4">
          What Is It Selling For Today? — Mandi Price Transparency
        </p>
        <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg font-medium border border-emerald-200">
          ✓ Milestone 1 Active: Build & Runtime Foundation Initialized
        </div>
      </div>
    </div>
  );
};

export default App;
