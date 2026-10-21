import {
  IMandiPriceService,
  CropOption,
  StateLocation,
  MandiPriceFilter,
  MandiPriceQueryResult,
  MarketComparisonRow,
  HistoricalPriceObservation,
} from '../features/mandi-prices/types';
import { SUPPORTED_CROPS, SUPPORTED_LOCATIONS } from '../features/mandi-prices/constants';
import { MOCK_MANDI_RECORDS, MOCK_HISTORICAL_TRAJECTORIES } from '../data/mockMandiPrices';
import { calculateFreshness } from '../utils/dates';

export class MockMandiPriceService implements IMandiPriceService {
  private simulatedLatencyMs = 250;

  async getCrops(): Promise<CropOption[]> {
    await this.delay(50);
    return [...SUPPORTED_CROPS];
  }

  async getLocations(): Promise<StateLocation[]> {
    await this.delay(50);
    return [...SUPPORTED_LOCATIONS];
  }

  async queryPrices(filter: MandiPriceFilter): Promise<MandiPriceQueryResult> {
    await this.delay(this.simulatedLatencyMs);

    // 1. Find primary match in selected district
    const primaryRecord =
      MOCK_MANDI_RECORDS.find(
        (r) =>
          r.commodity.toLowerCase() === filter.commodity.toLowerCase() &&
          r.state.toLowerCase() === filter.state.toLowerCase() &&
          r.district.toLowerCase() === filter.district.toLowerCase()
      ) || null;

    // 2. Find regional comparison records for same commodity in same state
    const sameStateRecords = MOCK_MANDI_RECORDS.filter(
      (r) =>
        r.commodity.toLowerCase() === filter.commodity.toLowerCase() &&
        r.state.toLowerCase() === filter.state.toLowerCase()
    );

    const basePrice = primaryRecord?.modalPrice ?? null;

    const comparisons: MarketComparisonRow[] = sameStateRecords.map((r) => {
      const isBase = primaryRecord ? r.id === primaryRecord.id : false;
      let priceDiff: number | null = null;
      let percentDiff: number | null = null;

      if (basePrice !== null && r.modalPrice !== null) {
        priceDiff = r.modalPrice - basePrice;
        percentDiff = basePrice > 0 ? (priceDiff / basePrice) * 100 : 0;
      }

      return {
        market: r.market,
        district: r.district,
        state: r.state,
        modalPrice: r.modalPrice,
        minPrice: r.minPrice,
        maxPrice: r.maxPrice,
        arrivalDate: r.arrivalDate,
        priceDifference: priceDiff,
        percentageDifference: percentDiff,
        isBaseMarket: isBase,
        freshness: calculateFreshness(r.arrivalDate),
      };
    });

    // Sort comparisons: primary first, then highest modal price to lowest
    comparisons.sort((a, b) => {
      if (a.isBaseMarket) return -1;
      if (b.isBaseMarket) return 1;
      const priceA = a.modalPrice ?? -1;
      const priceB = b.modalPrice ?? -1;
      return priceB - priceA;
    });

    // 3. Fetch historical trend for primary market if exists
    let historicalTrend: HistoricalPriceObservation[] = [];
    if (primaryRecord) {
      historicalTrend = await this.getHistoricalTrends(primaryRecord.commodity, primaryRecord.market);
    }

    const dataFreshness = primaryRecord
      ? calculateFreshness(primaryRecord.arrivalDate)
      : 'unknown';

    return {
      primaryRecord,
      comparisons,
      historicalTrend,
      dataFreshness,
      queryTimestamp: new Date().toISOString(),
      notes:
        primaryRecord === null
          ? 'चयनित जिले में आज कोई आवक दर्ज नहीं हुई है। निकटवर्ती मंडियों के भाव देखें।'
          : undefined,
    };
  }

  async getHistoricalTrends(
    commodity: string,
    market: string
  ): Promise<HistoricalPriceObservation[]> {
    const key = `${commodity}:${market}`;
    const directMatch = MOCK_HISTORICAL_TRAJECTORIES[key];
    if (directMatch) {
      return [...directMatch];
    }

    // Fallback: If partial match
    const foundKey = Object.keys(MOCK_HISTORICAL_TRAJECTORIES).find(
      (k) => k.startsWith(`${commodity}:`)
    );
    if (foundKey) {
      return [...MOCK_HISTORICAL_TRAJECTORIES[foundKey]];
    }

    return [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockMandiPriceService = new MockMandiPriceService();
