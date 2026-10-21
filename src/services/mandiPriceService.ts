import { IMandiPriceService } from '../features/mandi-prices/types';
import { mockMandiPriceService } from './mockMandiPriceService';

/**
 * Service Accessor
 * Member 2 can replace `mockMandiPriceService` with `ApiMandiPriceService`
 * to connect live Agmarknet / e-NAM feeds.
 */
export const mandiPriceService: IMandiPriceService = mockMandiPriceService;

export * from './mockMandiPriceService';
