import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HistoricalPriceObservation } from '../../features/mandi-prices/types';
import { formatINR } from '../../utils/currency';
import { LineChart as LineChartIcon, Info } from 'lucide-react';

interface PriceTrendChartProps {
  historicalPoints: HistoricalPriceObservation[];
  marketName: string;
  cropName: string;
  lang?: 'en' | 'hi';
  className?: string;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  historicalPoints,
  marketName,
  cropName,
  lang = 'hi',
  className = '',
}) => {
  const hasSufficientData = historicalPoints && historicalPoints.length >= 2;

  // Compute min and max for Y-Axis domain bounds
  const prices = historicalPoints.map((p) => p.modalPrice);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const yPadding = 50;
  const yDomain = [Math.max(0, minPrice - yPadding), maxPrice + yPadding];

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4 ${className}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <LineChartIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'hi' ? 'भाव रुझान (7-Day Trajectory)' : '7-Day Price Trajectory'}</span>
          </div>
          <h3 className="text-base font-bold text-stone-900">
            {marketName} • {cropName}
          </h3>
        </div>

        {hasSufficientData && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
            7 {lang === 'hi' ? 'दिवसीय रुझान' : 'Days'}
          </span>
        )}
      </div>

      {!hasSufficientData ? (
        /* Graceful Fallback */
        <div className="py-8 px-4 rounded-2xl bg-stone-50 border border-dashed border-stone-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-stone-200/80 text-stone-500 flex items-center justify-center mx-auto">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700">
            {lang === 'hi'
              ? 'इस मंडी के लिए पर्याप्त 7-दिवसीय ऐतिहासिक रिकॉर्ड उपलब्ध नहीं हैं।'
              : 'Insufficient 7-day historical records available for this market.'}
          </p>
          <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
            {lang === 'hi'
              ? 'जैसे ही अतिरिक्त दैनिक नीलामी डेटा प्राप्त होगा, रुझान ग्राफ सक्रिय हो जाएगा।'
              : 'The trend line will activate automatically as continuous daily auction logs accumulate.'}
          </p>
        </div>
      ) : (
        /* Recharts SVG Line Chart */
        <div className="space-y-3">
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalPoints}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  stroke="#a8a29e"
                  fontSize={11}
                  fontWeight={500}
                />
                <YAxis
                  domain={yDomain}
                  tickLine={false}
                  stroke="#a8a29e"
                  fontSize={11}
                  fontWeight={500}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `${formatINR(Number(value))}/क्विंटल`,
                    lang === 'hi' ? 'मॉडल भाव' : 'Modal Price',
                  ]}
                  labelFormatter={(label) =>
                    lang === 'hi' ? `दिनांक: ${label}` : `Date: ${label}`
                  }
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e7e5e4',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#15803d"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#15803d', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
            <span>
              {lang === 'hi' ? 'न्यूनतम:' : 'Low:'} <strong>{formatINR(minPrice)}</strong>
            </span>
            <span className="font-medium text-stone-500">
              {lang === 'hi' ? 'प्रति क्विंटल मॉडल दर' : 'Modal rate per quintal'}
            </span>
            <span>
              {lang === 'hi' ? 'अधिकतम:' : 'High:'} <strong>{formatINR(maxPrice)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTrendChart;
