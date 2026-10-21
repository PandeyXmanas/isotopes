# What Is It Selling For Today? (आज क्या भाव बिक रहा है?)

A mobile-first mandi price transparency and decision-support web application tailored for Indian farmers.

Built for the **Agricultural Trade Hackathon**.

---

## 🌾 Project Overview

Farmers frequently lack immediate clarity on local and regional mandi modal prices before transporting harvest to market. **What Is It Selling For Today?** provides transparent, reliable price visibility to help farmers evaluate where and when to sell.

### Core Capabilities
- **Crop & Location Drill-Down**: Quick selection of crop, state, and district.
- **Prominent Modal Price Display**: Clear, rupee-denominated modal rate per quintal alongside reported auction minimum and maximum ranges.
- **Regional Market Comparison**: Benchmarking of nearby mandis with automatically calculated price differentials and percentage differences.
- **Reporting Date & Data Freshness**: Clear visual badges (`Today's Price`, `Yesterday`, `Outdated`) ensuring farmers don't make decisions on stale numbers.
- **Price Trend Charts**: 7-day modal price trajectory visualization (powered by Recharts) with graceful fallbacks when continuous historical data is absent.
- **Bilingual Interface Readiness**: English & Hindi commodity names (e.g. Wheat / गेहूँ).
- **Indicative Price Transparency**: Prominent reminders that modal prices are indicative reference rates and that net earnings must account for logistics, freight, and unloading costs.

---

## 🛠 Technology Stack

- **UI Library**: React 18
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts 2.15
- **Linting**: ESLint 9

---

## 📁 Repository Structure

```
what-is-it-selling-for-today/
├── public/
│   └── favicon.svg                  # Agricultural sprout brand icon
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Main assembled dashboard screen
│   │   └── providers.tsx            # Application providers wrapper
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx        # Brand header with demo notice & language toggle
│   │   │   ├── AppFooter.tsx        # Decision notices, disclaimers, & attributions
│   │   │   └── PageContainer.tsx    # Mobile-first constrained layout container
│   │   ├── filters/
│   │   │   ├── CropSelector.tsx     # Bilingual crop picker
│   │   │   ├── LocationSelector.tsx # Cascading State & District picker
│   │   │   └── PriceFilters.tsx     # Combined filter bar & query action
│   │   ├── prices/
│   │   │   ├── LatestPriceCard.tsx  # Hero modal price card with min/max range
│   │   │   ├── MandiComparison.tsx  # Regional market benchmarking table/list
│   │   │   ├── MandiPriceRow.tsx    # Individual mandi row with calculated diff
│   │   │   └── PriceTrendChart.tsx  # 7-day trend line chart with fallback
│   │   └── ui/
│   │       ├── DataFreshnessBadge.tsx # Semantic freshness indicators
│   │       ├── LoadingState.tsx     # Skeleton loading state
│   │       ├── ErrorState.tsx       # Error banner with retry action
│   │       └── EmptyState.tsx       # No arrivals / missing crop state
│   ├── features/
│   │   └── mandi-prices/
│   │       ├── types.ts             # Complete TypeScript domain contracts
│   │       ├── constants.ts         # Supported crops, states, and legal copy
│   │       └── selectors.ts         # Filter matching & primary record resolution
│   ├── hooks/
│   │   └── useMandiPrices.ts        # Custom reactive hook for UI state
│   ├── services/
│   │   ├── mandiPriceService.ts     # Service interface contract (IMandiPriceService)
│   │   └── mockMandiPriceService.ts # Mock implementation with latency & edge cases
│   ├── data/
│   │   └── mockMandiPrices.ts       # Realistic sample dataset with deliberate edge cases
│   ├── utils/
│   │   ├── currency.ts              # Safe INR formatting & price diff math
│   │   ├── dates.ts                 # Date formatting & freshness logic
│   │   └── priceComparison.ts       # Cross-market comparison logic
│   ├── styles/
│   │   └── index.css                # Tailwind CSS v4 configuration & tokens
│   ├── main.tsx                     # React application entrypoint
│   └── vite-env.d.ts                # Environment variable typings
├── .env.example                     # Sample environment variable config
├── .gitignore                       # Git ignore list
├── eslint.config.js                 # ESLint rules
├── index.html                       # HTML5 entry with mobile viewport & SEO tags
├── package.json                     # Dependency manifests & scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+ (tested on Node v24)
- npm 9+

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your mobile browser or emulator.

3. **Run code quality check (ESLint)**:
   ```bash
   npm run lint
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 🔌 Integration Guide for Member 2 (Data Pipeline / Backend)

The frontend is **completely decoupled** from the backend or mock data via the typed service interface in [`src/services/mandiPriceService.ts`](src/services/mandiPriceService.ts).

To connect real CSV/JSON files or an API endpoint, implement the `IMandiPriceService` contract:

### 1. Target Data Schema (`MandiPriceRecord`)

```typescript
export interface MandiPriceRecord {
  commodity: string;          // e.g. "Wheat"
  state: string;              // e.g. "Madhya Pradesh"
  district: string;           // e.g. "Sehore"
  market: string;             // e.g. "Sehore Mandi"
  arrivalDate: string;        // ISO format: "YYYY-MM-DD"
  minPrice: number | null;    // Do NOT coerce missing values to 0
  maxPrice: number | null;
  modalPrice: number | null;  // Nullable if auction is ongoing or unreported
  unit: "INR/quintal";        // Standardized unit
  source: string;             // e.g. "Agmarknet / e-NAM"
}
```

### 2. Service Interface Contract

```typescript
export interface IMandiPriceService {
  getCrops(): Promise<CropOption[]>;
  getLocations(): Promise<StateLocation[]>;
  queryPrices(filter: MandiPriceFilter): Promise<MandiPriceQueryResult>;
  getMarketComparisons(crop: string, state: string, district?: string): Promise<MarketComparisonRow[]>;
  getHistoricalTrends(commodity: string, market: string): Promise<HistoricalPriceObservation[]>;
}
```

### 3. Edge Case Handling Rules
- **Missing Modal Prices**: Pass `null`, never convert to `0`. The UI displays a clear "Modal Price Not Reported" badge.
- **Different Arrival Dates**: If comparison markets have different dates, the service/UI flags `isDirectlyComparable: false` to avoid misleading price difference calculations.
- **Missing Historical Points**: Return an empty array `[]` or `< 2` records; the UI will render a helpful "Data not yet available" notice instead of breaking the chart.

---

## ⚖️ Legal & Indicative Price Disclaimer

Reported mandi prices are indicative modal rates for fair average quality (FAQ). Final transaction prices depend on moisture content, grain quality, transport costs, and trader deductions. This application is an information and decision-support tool, not an execution or trading platform.
