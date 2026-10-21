import {
  IMandiPriceService,
  CropOption,
  StateLocation,
  MandiPriceFilter,
  MandiPriceQueryResult,
  MarketComparisonRow,
  HistoricalPriceObservation,
  MandiPriceRecord,
} from '../features/mandi-prices/types';
import { calculateFreshness } from '../utils/dates';

// Common Hindi commodity translations for agricultural trade data
const COMMODITY_HI_MAP: Record<string, string> = {
  wheat: 'गेहूँ',
  soybean: 'सोयाबीन',
  mustard: 'सरसों',
  gram: 'चना',
  chana: 'चना',
  onion: 'प्याज',
  cotton: 'कपास',
  maize: 'मक्का',
  paddy: 'धान',
  rice: 'चावल',
  potato: 'आलू',
  tomato: 'टमाटर',
  garlic: 'लहसुन',
  ginger: 'अदरक',
  coriander: 'धनिया',
  cumin: 'जीरा',
  turmeric: 'हल्दी',
  bajra: 'बाजरा',
  jowar: 'ज्वार',
  barley: 'जौ',
  moong: 'मूंग',
  urad: 'उड़द',
  arhar: 'अरहर (तुअर)',
  groundnut: 'मूंगफली',
  apple: 'सेब',
  banana: 'केला',
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const rawHeaders = parseCSVLine(lines[0]);
  const normalizedHeaders = rawHeaders.map((h) =>
    h.trim().toLowerCase().replace(/[\s_\-./]+/g, '')
  );

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || values.every((v) => v.trim() === '')) continue;
    const row: Record<string, string> = {};
    normalizedHeaders.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

function extractField(row: Record<string, string>, possibleKeys: string[]): string {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== '') {
      return row[key];
    }
  }
  return '';
}

function parseNumeric(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

function normalizeDate(rawDate: string): string {
  if (!rawDate) return new Date().toISOString().split('T')[0];
  // Check if DD/MM/YYYY or DD-MM-YYYY
  const parts = rawDate.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return rawDate;
}

export class CsvMandiPriceService implements IMandiPriceService {
  private records: MandiPriceRecord[] = [];
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;
  private csvPath = '/data/mandi_prices.csv';

  constructor(csvPath = '/data/mandi_prices.csv') {
    this.csvPath = csvPath;
  }

  private async ensureDataLoaded(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.fetchAndParse();
    return this.loadPromise;
  }

  private async fetchAndParse(): Promise<void> {
    try {
      const response = await fetch(this.csvPath);
      if (!response.ok) {
        throw new Error(
          `CSV फ़ाइल प्राप्त नहीं हो सकी (${response.status} ${response.statusText}): ${this.csvPath}`
        );
      }

      const csvText = await response.text();
      const rawRows = parseCSV(csvText);

      this.records = rawRows.map((row, idx) => {
        const state = extractField(row, ['state', 'statename', 'rajya']) || 'Unknown State';
        const district = extractField(row, ['district', 'districtname', 'zilla']) || 'General';
        const market =
          extractField(row, ['market', 'marketname', 'mandi', 'mandiname', 'marketcenter']) ||
          `${district} Mandi`;
        const commodity =
          extractField(row, ['commodity', 'commodityname', 'crop', 'fasal']) || 'General Produce';
        const rawDate = extractField(row, [
          'arrivaldate',
          'arrival_date',
          'date',
          'reportingdate',
          'reportdate',
        ]);
        const arrivalDate = normalizeDate(rawDate);

        const minPrice = parseNumeric(
          extractField(row, ['minprice', 'min_price', 'minimumprice', 'min'])
        );
        const maxPrice = parseNumeric(
          extractField(row, ['maxprice', 'max_price', 'maximumprice', 'max'])
        );
        const modalPrice = parseNumeric(
          extractField(row, ['modalprice', 'modal_price', 'modal', 'modalrate'])
        );

        const unit = 'INR/quintal' as const;
        const source =
          extractField(row, ['source', 'agency', 'datasource']) || 'Agmarknet / Live Mandi Records';

        const commLower = commodity.toLowerCase();
        const commodityHi = COMMODITY_HI_MAP[commLower] || commodity;

        return {
          id: `csv-${idx}-${commodity}-${district}`,
          commodity,
          commodityHi,
          state,
          district,
          market,
          arrivalDate,
          minPrice,
          maxPrice,
          modalPrice,
          unit,
          source,
        };
      });

      this.isLoaded = true;
    } catch (err) {
      this.isLoaded = false;
      this.loadPromise = null;
      throw err;
    }
  }

  async getCrops(): Promise<CropOption[]> {
    await this.ensureDataLoaded();

    const uniqueCrops = Array.from(new Set(this.records.map((r) => r.commodity))).filter(Boolean);

    return uniqueCrops.map((crop) => {
      const commLower = crop.toLowerCase();
      const nameHi = COMMODITY_HI_MAP[commLower] || crop;
      return {
        id: crop,
        nameEn: crop,
        nameHi,
        category: 'Cereals',
      };
    });
  }

  async getLocations(): Promise<StateLocation[]> {
    await this.ensureDataLoaded();

    const stateMap = new Map<string, Set<string>>();

    this.records.forEach((r) => {
      if (!stateMap.has(r.state)) {
        stateMap.set(r.state, new Set<string>());
      }
      if (r.district) {
        stateMap.get(r.state)!.add(r.district);
      }
    });

    const locations: StateLocation[] = [];

    stateMap.forEach((districtsSet, state) => {
      const districts = Array.from(districtsSet)
        .sort()
        .map((d) => ({
          id: d,
          nameEn: d,
          nameHi: d,
        }));

      locations.push({
        state,
        stateHi: state,
        districts,
      });
    });

    return locations.sort((a, b) => a.state.localeCompare(b.state));
  }

  async queryPrices(filter: MandiPriceFilter): Promise<MandiPriceQueryResult> {
    await this.ensureDataLoaded();

    // 1. Find primary match for commodity, state, district
    const matchingRecords = this.records.filter(
      (r) =>
        r.commodity.toLowerCase() === filter.commodity.toLowerCase() &&
        r.state.toLowerCase() === filter.state.toLowerCase() &&
        r.district.toLowerCase() === filter.district.toLowerCase()
    );

    // Pick the most recent record if multiple exist
    matchingRecords.sort(
      (a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime()
    );

    const primaryRecord = matchingRecords.length > 0 ? matchingRecords[0] : null;

    // 2. Find regional comparisons for the same commodity in the same state
    const sameStateRecords = this.records.filter(
      (r) =>
        r.commodity.toLowerCase() === filter.commodity.toLowerCase() &&
        r.state.toLowerCase() === filter.state.toLowerCase()
    );

    // Group by unique market name (pick most recent entry per market)
    const marketMap = new Map<string, MandiPriceRecord>();
    sameStateRecords.forEach((r) => {
      if (
        !marketMap.has(r.market) ||
        new Date(r.arrivalDate).getTime() > new Date(marketMap.get(r.market)!.arrivalDate).getTime()
      ) {
        marketMap.set(r.market, r);
      }
    });

    const basePrice = primaryRecord?.modalPrice ?? null;

    const comparisons: MarketComparisonRow[] = Array.from(marketMap.values()).map((r) => {
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

    comparisons.sort((a, b) => {
      if (a.isBaseMarket) return -1;
      if (b.isBaseMarket) return 1;
      const priceA = a.modalPrice ?? -1;
      const priceB = b.modalPrice ?? -1;
      return priceB - priceA;
    });

    // 3. Historical trend for the primary commodity & market
    let historicalTrend: HistoricalPriceObservation[] = [];
    if (primaryRecord) {
      historicalTrend = await this.getHistoricalTrends(
        primaryRecord.commodity,
        primaryRecord.market
      );
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
          ? `चयनित जिले (${filter.district}) में ${filter.commodity} की कोई आवक रिकॉर्ड नहीं मिली।`
          : undefined,
    };
  }

  async getHistoricalTrends(
    commodity: string,
    market: string
  ): Promise<HistoricalPriceObservation[]> {
    await this.ensureDataLoaded();

    const matches = this.records.filter(
      (r) =>
        r.commodity.toLowerCase() === commodity.toLowerCase() &&
        r.market.toLowerCase() === market.toLowerCase() &&
        r.modalPrice !== null
    );

    // Sort chronologically ascending
    matches.sort(
      (a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
    );

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return matches.map((m) => {
      const d = new Date(m.arrivalDate);
      const displayDate = !isNaN(d.getTime())
        ? `${d.getDate()} ${months[d.getMonth()]}`
        : m.arrivalDate;

      return {
        date: m.arrivalDate,
        displayDate,
        modalPrice: m.modalPrice!,
        minPrice: m.minPrice ?? undefined,
        maxPrice: m.maxPrice ?? undefined,
      };
    });
  }
}

export const csvMandiPriceService = new CsvMandiPriceService('/data/mandi_prices.csv');
