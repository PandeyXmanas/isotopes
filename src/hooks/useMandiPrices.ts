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

  // Load crops and locations from real CSV records
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

          // If current filter does not match real data, dynamically align with available CSV records
          if (cropsData.length > 0 && locationsData.length > 0) {
            setFilter((prev) => {
              const hasCrop = cropsData.some(
                (c) => c.id.toLowerCase() === prev.commodity.toLowerCase()
              );
              const validState =
                locationsData.find(
                  (l) => l.state.toLowerCase() === prev.state.toLowerCase()
                ) || locationsData[0];

              const validDistrict =
                validState.districts.find(
                  (d) => d.id.toLowerCase() === prev.district.toLowerCase()
                ) || validState.districts[0];

              const targetCrop = hasCrop ? prev.commodity : cropsData[0].id;
              const targetState = validState.state;
              const targetDistrict = validDistrict ? validDistrict.id : '';

              if (
                targetCrop !== prev.commodity ||
                targetState !== prev.state ||
                targetDistrict !== prev.district
              ) {
                return {
                  commodity: targetCrop,
                  state: targetState,
                  district: targetDistrict,
                };
              }
              return prev;
            });
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load crop/location metadata from CSV:', err);
        if (mounted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'public/data/mandi_prices.csv लोड करने में समस्या आई।';
          setError(
            `${msg} (कृपया सुनिश्चित करें कि अन्य डिवाइस से public/data/mandi_prices.csv को push किया गया है)`
          );
          setIsLoading(false);
        }
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
    // Only query if filter is set
    if (filter.commodity && filter.state) {
      fetchPrices(filter);
    }
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
