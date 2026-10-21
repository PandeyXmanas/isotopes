import { IMandiPriceService } from '../features/mandi-prices/types';
import { csvMandiPriceService } from './csvMandiPriceService';

/**
 * Service Accessor
 * Connected to the compact Agmarknet mandi sample in src/data/local_mandi_prices.csv.
 */
export const mandiPriceService: IMandiPriceService = csvMandiPriceService;

export * from './csvMandiPriceService';
