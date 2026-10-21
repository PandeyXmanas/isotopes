/**
 * Mandi Price Domain Data Contracts
 * Standard unit: INR per quintal (100 kg)
 */

export type DataFreshnessStatus = 'fresh' | 'yesterday' | 'stale' | 'unknown';

export interface MandiPriceRecord {
  id: string;
  commodity: string;
  commodityHi?: string;
  state: string;
  district: string;
  market: string;
  arrivalDate: string; // ISO format "YYYY-MM-DD"
  minPrice: number | null; // Nullable if auction unreported, NEVER coerce to 0
  maxPrice: number | null;
  modalPrice: number | null; // Most frequent trading auction price
  unit: 'INR/quintal';
  source: string; // e.g. "Agmarknet / e-NAM", "State Mandi Board"
  isDirectlyComparable?: boolean;
}

export interface MarketComparisonRow {
  market: string;
  district: string;
  state: string;
  modalPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  arrivalDate: string;
  priceDifference: number | null; // Spread in INR relative to primary mandi
  percentageDifference: number | null; // Percentage spread (%)
  isBaseMarket: boolean;
  freshness: DataFreshnessStatus;
}

export interface HistoricalPriceObservation {
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "15 Oct"
  modalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  volumeQuintals?: number;
}

export interface CropOption {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Cereals' | 'Oilseeds' | 'Pulses' | 'Vegetables' | 'Commercial';
}

export interface DistrictOption {
  id: string;
  nameEn: string;
  nameHi: string;
  markets?: string[];
}

export interface StateLocation {
  state: string;
  stateHi: string;
  districts: DistrictOption[];
}

export interface MandiPriceFilter {
  commodity: string;
  state: string;
  district: string;
  market?: string;
}

export interface MandiPriceQueryResult {
  primaryRecord: MandiPriceRecord | null;
  comparisons: MarketComparisonRow[];
  historicalTrend: HistoricalPriceObservation[];
  dataFreshness: DataFreshnessStatus;
  queryTimestamp: string;
  notes?: string;
}

export interface IMandiPriceService {
  getCrops(): Promise<CropOption[]>;
  getLocations(): Promise<StateLocation[]>;
  queryPrices(filter: MandiPriceFilter): Promise<MandiPriceQueryResult>;
  getHistoricalTrends(commodity: string, market: string): Promise<HistoricalPriceObservation[]>;
}
