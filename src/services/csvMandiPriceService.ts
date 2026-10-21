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

// Standard Hindi agricultural commodity dictionary
const COMMODITY_HI_MAP: Record<string, string> = {
  wheat: 'गेहूँ',
  soybean: 'सोयाबीन',
  soyabean: 'सोयाबीन',
  mustard: 'सरसों',
  gram: 'चना',
  'bengal gram(gram)(whole)': 'चना (देसी)',
  'black gram(urd beans)(whole)': 'उड़द दाल',
  'green gram(moong)(whole)': 'मूंग दाल',
  'lentil(masur)(whole)': 'मसूर दाल',
  'red gram/arhar/tur(whole)': 'तुअर / अरहर',
  chana: 'चना',
  onion: 'प्याज',
  cotton: 'कपास',
  maize: 'मक्का',
  'paddy(common)': 'धान (सामान्य)',
  paddy: 'धान',
  rice: 'चावल',
  potato: 'आलू',
  tomato: 'टमाटर',
  'bajra(pearl millet/cumbu)': 'बाजरा',
  'barley(jau)': 'जौ',
  'jowar(sorghum)': 'ज्वार',
  'ragi(finger millet)': 'रागी / मडुआ',
  copra: 'नारियल (खोपरा)',
  groundnut: 'मूंगफली',
  'niger seed(ramtil)': 'रामतिल',
  safflower: 'कुसुम',
  'sesamum(sesame,gingelly,til)': 'तिल',
  'sunflower/sunflower seed': 'सूरजमुखी',
  garlic: 'लहसुन',
  ginger: 'अदरक',
};

function cleanNumber(val: string | undefined): number | null {
  if (!val || val === '-' || val === '—' || val.trim() === '') return null;
  const num = parseFloat(val.replace(/,/g, '').trim());
  return isNaN(num) || num <= 0 ? null : Math.round(num * 100) / 100;
}

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
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

interface ParsedMarketRow {
  group: string;
  commodity: string;
  commodityHi: string;
  msp: number | null;
  dates: { dateStr: string; isoDate: string; price: number | null; arrivalMT: number | null }[];
}

export class CsvMandiPriceService implements IMandiPriceService {
  private parsedReportRows: ParsedMarketRow[] = [];
  private flatRecords: MandiPriceRecord[] = [];
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
      const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

      // Locate column header index (contains "commodity")
      const headerIdx = lines.findIndex((l) => l.toLowerCase().includes('commodity'));
      if (headerIdx === -1) {
        throw new Error('CSV फ़ाइल में Commodity कॉलम नहीं मिला।');
      }

      const headers = parseCSVLine(lines[headerIdx]);
      const dataLines = lines.slice(headerIdx + 1);

      // Check if this is the Agmarknet Marketwise Price & Arrival Report format
      const isMarketwiseReport = headers.some((h) => h.toLowerCase().includes('price on'));

      if (isMarketwiseReport) {
        this.parseAgmarknetReport(headers, dataLines);
      } else {
        this.parseStandardRows(headers, dataLines);
      }

      this.isLoaded = true;
    } catch (err) {
      this.isLoaded = false;
      this.loadPromise = null;
      throw err;
    }
  }

  /**
   * Parses official Agmarknet Marketwise Price & Arrival Report
   * Columns: Commodity Group, Commodity, MSP, Price on 19 Oct, Price on 18 Oct..., Arrival on 19 Oct...
   */
  private parseAgmarknetReport(headers: string[], lines: string[]): void {
    // Identify price & arrival date columns
    const priceDateCols: { header: string; dateStr: string; isoDate: string; colIdx: number }[] = [];
    const arrivalDateCols: { header: string; dateStr: string; colIdx: number }[] = [];
    let groupIdx = 0;
    let commodityIdx = 1;
    let mspIdx = -1;

    headers.forEach((h, idx) => {
      const lower = h.toLowerCase();
      if (lower.includes('commodity group') || lower === 'group') {
        groupIdx = idx;
      } else if (lower === 'commodity' || lower === 'crop') {
        commodityIdx = idx;
      } else if (lower.includes('msp')) {
        mspIdx = idx;
      } else if (lower.includes('price on')) {
        // e.g. "Price on 19 Oct, 2026"
        const dateMatch = h.match(/Price on\s+(.+)$/i);
        const rawDate = dateMatch ? dateMatch[1].trim() : h;
        priceDateCols.push({
          header: h,
          dateStr: rawDate,
          isoDate: this.normalizeDateStringToISO(rawDate),
          colIdx: idx,
        });
      } else if (lower.includes('arrival on')) {
        const dateMatch = h.match(/Arrival on\s+(.+)$/i);
        const rawDate = dateMatch ? dateMatch[1].trim() : h;
        arrivalDateCols.push({
          header: h,
          dateStr: rawDate,
          colIdx: idx,
        });
      }
    });

    this.parsedReportRows = [];

    lines.forEach((line) => {
      const cols = parseCSVLine(line);
      if (cols.length < 2 || !cols[commodityIdx]) return;

      const group = cols[groupIdx] || 'All Commodities';
      const commodity = cols[commodityIdx];
      const commLower = commodity.toLowerCase();
      const commodityHi = COMMODITY_HI_MAP[commLower] || commodity;
      const msp = mspIdx !== -1 ? cleanNumber(cols[mspIdx]) : null;

      const datesData = priceDateCols.map((pCol) => {
        const price = cleanNumber(cols[pCol.colIdx]);
        // Find matching arrival column by dateStr
        const arrCol = arrivalDateCols.find((a) => a.dateStr === pCol.dateStr);
        const arrivalMT = arrCol ? cleanNumber(cols[arrCol.colIdx]) : null;

        return {
          dateStr: pCol.dateStr,
          isoDate: pCol.isoDate,
          price,
          arrivalMT,
        };
      });

      this.parsedReportRows.push({
        group,
        commodity,
        commodityHi,
        msp,
        dates: datesData,
      });
    });
  }

  private parseStandardRows(headers: string[], lines: string[]): void {
    const normHeaders = headers.map((h) => h.toLowerCase().replace(/[\s_\-./]+/g, ''));
    this.flatRecords = lines.map((line, idx) => {
      const cols = parseCSVLine(line);
      const row: Record<string, string> = {};
      normHeaders.forEach((h, i) => {
        row[h] = cols[i] || '';
      });

      const commodity = row['commodity'] || row['crop'] || 'General';
      const state = row['state'] || 'National';
      const district = row['district'] || 'Summary';
      const market = row['market'] || row['mandi'] || `${district} Mandi`;
      const arrivalDate = row['arrivaldate'] || row['date'] || new Date().toISOString().split('T')[0];
      const minPrice = cleanNumber(row['minprice'] || row['min']);
      const maxPrice = cleanNumber(row['maxprice'] || row['max']);
      const modalPrice = cleanNumber(row['modalprice'] || row['modal']);

      const commLower = commodity.toLowerCase();
      const commodityHi = COMMODITY_HI_MAP[commLower] || commodity;

      return {
        id: `csv-${idx}-${commodity}`,
        commodity,
        commodityHi,
        state,
        district,
        market,
        arrivalDate,
        minPrice,
        maxPrice,
        modalPrice,
        unit: 'INR/quintal' as const,
        source: row['source'] || 'Agmarknet Real Records',
      };
    });
  }

  private normalizeDateStringToISO(dateStr: string): string {
    // E.g. "19 Oct, 2026" or "19-10-2026" or "2026-10-19"
    try {
      const clean = dateStr.replace(',', '').trim();
      const parts = clean.split(/\s+/);
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const monthNames: Record<string, string> = {
          jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
          jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
        };
        const month = monthNames[parts[1].toLowerCase().slice(0, 3)] || '10';
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  }

  async getCrops(): Promise<CropOption[]> {
    await this.ensureDataLoaded();

    if (this.parsedReportRows.length > 0) {
      return this.parsedReportRows.map((r) => {
        let cat: CropOption['category'] = 'Cereals';
        const gLower = r.group.toLowerCase();
        if (gLower.includes('oil')) cat = 'Oilseeds';
        else if (gLower.includes('pulse')) cat = 'Pulses';
        else if (gLower.includes('vegetable')) cat = 'Vegetables';
        else if (gLower.includes('fibre') || gLower.includes('commercial')) cat = 'Commercial';

        return {
          id: r.commodity,
          nameEn: r.commodity,
          nameHi: r.commodityHi,
          category: cat,
        };
      });
    }

    const unique = Array.from(new Set(this.flatRecords.map((r) => r.commodity)));
    return unique.map((c) => ({
      id: c,
      nameEn: c,
      nameHi: COMMODITY_HI_MAP[c.toLowerCase()] || c,
      category: 'Cereals',
    }));
  }

  async getLocations(): Promise<StateLocation[]> {
    await this.ensureDataLoaded();

    if (this.parsedReportRows.length > 0) {
      // Group unique commodity groups as state/regional benchmarks
      const groups = Array.from(new Set(this.parsedReportRows.map((r) => r.group)));

      return [
        {
          state: 'All-India Mandis',
          stateHi: 'अखिल भारतीय मंडियां',
          districts: groups.map((g) => ({
            id: g,
            nameEn: `${g} Sector`,
            nameHi: `${g} खंड`,
          })),
        },
      ];
    }

    const stateMap = new Map<string, Set<string>>();
    this.flatRecords.forEach((r) => {
      if (!stateMap.has(r.state)) stateMap.set(r.state, new Set());
      stateMap.get(r.state)!.add(r.district);
    });

    const list: StateLocation[] = [];
    stateMap.forEach((distSet, state) => {
      list.push({
        state,
        stateHi: state,
        districts: Array.from(distSet).map((d) => ({ id: d, nameEn: d, nameHi: d })),
      });
    });
    return list;
  }

  async queryPrices(filter: MandiPriceFilter): Promise<MandiPriceQueryResult> {
    await this.ensureDataLoaded();

    if (this.parsedReportRows.length > 0) {
      // Find matching commodity
      const matched =
        this.parsedReportRows.find(
          (r) => r.commodity.toLowerCase() === filter.commodity.toLowerCase()
        ) || this.parsedReportRows[0];

      if (!matched) {
        return {
          primaryRecord: null,
          comparisons: [],
          historicalTrend: [],
          dataFreshness: 'unknown',
          queryTimestamp: new Date().toISOString(),
        };
      }

      // Latest date entry
      const latestDate = matched.dates[0] || {
        dateStr: '19 Oct, 2026',
        isoDate: '2026-10-19',
        price: null,
        arrivalMT: null,
      };

      // Prices across 3 days
      const allPrices = matched.dates.map((d) => d.price).filter((p): p is number => p !== null);
      const minPrice = matched.msp || (allPrices.length ? Math.min(...allPrices) : null);
      const maxPrice = allPrices.length ? Math.max(...allPrices) : null;

      const primaryRecord: MandiPriceRecord = {
        id: `report-${matched.commodity}`,
        commodity: matched.commodity,
        commodityHi: matched.commodityHi,
        state: 'All-India Major Mandis',
        district: matched.group,
        market: `Agmarknet National Benchmark (${matched.group})`,
        arrivalDate: latestDate.isoDate,
        minPrice,
        maxPrice,
        modalPrice: latestDate.price,
        unit: 'INR/quintal',
        source: 'Agmarknet / MoA&FW Official Market Report',
      };

      // Cross-commodity regional comparisons (benchmarking within same commodity group)
      const groupPeers = this.parsedReportRows.filter((r) => r.group === matched.group);
      const basePrice = latestDate.price;

      const comparisons: MarketComparisonRow[] = groupPeers.map((peer) => {
        const isBase = peer.commodity === matched.commodity;
        const peerLatest = peer.dates[0];
        const peerPrice = peerLatest ? peerLatest.price : null;

        let priceDiff: number | null = null;
        let percentDiff: number | null = null;

        if (basePrice !== null && peerPrice !== null) {
          priceDiff = Math.round((peerPrice - basePrice) * 100) / 100;
          percentDiff = basePrice > 0 ? (priceDiff / basePrice) * 100 : 0;
        }

        return {
          market: `${peer.commodity} (${peer.commodityHi})`,
          district: `${peer.dates[0]?.arrivalMT ? peer.dates[0].arrivalMT.toLocaleString() + ' MT आवक' : peer.group}`,
          state: peer.msp ? `MSP: ₹${peer.msp.toLocaleString()}` : 'MSP Not Applicable',
          modalPrice: peerPrice,
          minPrice: peer.msp,
          maxPrice: peerPrice,
          arrivalDate: peerLatest ? peerLatest.isoDate : latestDate.isoDate,
          priceDifference: priceDiff,
          percentageDifference: percentDiff,
          isBaseMarket: isBase,
          freshness: calculateFreshness(peerLatest ? peerLatest.isoDate : latestDate.isoDate),
        };
      });

      // Sort: base commodity first, then highest price
      comparisons.sort((a, b) => {
        if (a.isBaseMarket) return -1;
        if (b.isBaseMarket) return 1;
        return (b.modalPrice ?? 0) - (a.modalPrice ?? 0);
      });

      // Historical trends across all reported dates (sorted chronologically)
      const historicalTrend: HistoricalPriceObservation[] = [...matched.dates]
        .reverse()
        .filter((d) => d.price !== null)
        .map((d) => ({
          date: d.isoDate,
          displayDate: d.dateStr.replace(/,\s*\d{4}/, ''),
          modalPrice: d.price!,
          volumeQuintals: d.arrivalMT ? d.arrivalMT * 10 : undefined,
        }));

      return {
        primaryRecord,
        comparisons,
        historicalTrend,
        dataFreshness: calculateFreshness(latestDate.isoDate),
        queryTimestamp: new Date().toISOString(),
        notes: matched.msp
          ? `भारत सरकार न्यूनतम समर्थन मूल्य (MSP 2026-27): ₹${matched.msp.toLocaleString()}/क्विंटल`
          : undefined,
      };
    }

    // Flat records fallback
    return {
      primaryRecord: null,
      comparisons: [],
      historicalTrend: [],
      dataFreshness: 'unknown',
      queryTimestamp: new Date().toISOString(),
    };
  }

  async getHistoricalTrends(
    commodity: string,
    market: string
  ): Promise<HistoricalPriceObservation[]> {
    const result = await this.queryPrices({
      commodity,
      state: '',
      district: '',
    });
    return result.historicalTrend;
  }
}

export const csvMandiPriceService = new CsvMandiPriceService('/data/mandi_prices.csv');
