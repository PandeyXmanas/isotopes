import { useState, useEffect, useCallback } from 'react';
import {
  MandiPriceFilter,
  MandiPriceQueryResult,
  CropOption,
  StateLocation,
} from '../features/mandi-prices/types';
import { DEFAULT_FILTER } from '../features/mandi-prices/constants';
import { mandiPriceService } from '../services/mandiPriceService';

export interface UseMandiPricesReturn {
  filter: MandiPriceFilter;
  setFilter: React.Dispatch<React.SetStateAction<MandiPriceFilter>>;
  updateFilter: (partial: Partial<MandiPriceFilter>) => void;
  data: MandiPriceQueryResult | null;
  isLoading: boolean;
  error: string | null;
  crops: CropOption[];
  locations: StateLocation[];
  refetch: () => Promise<void>;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
}

export function useMandiPrices(): UseMandiPricesReturn {
  const [filter, setFilter] = useState<MandiPriceFilter>(DEFAULT_FILTER);
  const [data, setData] = useState<MandiPriceQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [crops, setCrops] = useState<CropOption[]>([]);
  const [locations, setLocations] = useState<StateLocation[]>([]);
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  // Load static crops and locations metadata once
  useEffect(() => {
    let mounted = true;

    async function loadMetadata() {
      try {
        const [cropsData, locationsData] = await Promise.all([
          mandiPriceService.getCrops(),
          mandiPriceService.getLocations(),
        ]);
        if (mounted) {
          setCrops(cropsData);
          setLocations(locationsData);
        }
      } catch (err) {
        console.error('Failed to load crop/location metadata:', err);
      }
    }

    loadMetadata();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch prices whenever the active filter changes
  const fetchPrices = useCallback(
    async (currentFilter: MandiPriceFilter) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mandiPriceService.queryPrices(currentFilter);
        setData(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'मंडी भाव प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।';
        setError(message);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPrices(filter);
  }, [filter, fetchPrices]);

  const updateFilter = useCallback((partial: Partial<MandiPriceFilter>) => {
    setFilter((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const refetch = useCallback(async () => {
    await fetchPrices(filter);
  }, [fetchPrices, filter]);

  return {
    filter,
    setFilter,
    updateFilter,
    data,
    isLoading,
    error,
    crops,
    locations,
    refetch,
    lang,
    setLang,
  };
}
