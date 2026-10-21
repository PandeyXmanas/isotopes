import { IMandiPriceService } from '../features/mandi-prices/types';
import { csvMandiPriceService } from './csvMandiPriceService';

/**
 * Service Accessor
 * Connected directly to real dataset under public/data/mandi_prices.csv
 */
export const mandiPriceService: IMandiPriceService = csvMandiPriceService;

export * from './csvMandiPriceService';
