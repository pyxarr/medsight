import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCHES_KEY = "community-recent-searches";
const MAX_RECENT_SEARCHES = 10;

function normalizeSearch(query: string) {
  return query.trim();
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const parsed = stored ? (JSON.parse(stored) as string[]) : [];

        if (mounted) {
          setRecentSearches(Array.isArray(parsed) ? parsed : []);
        }
      } catch {
        if (mounted) {
          setRecentSearches([]);
        }
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };

    loadSearches();

    return () => {
      mounted = false;
    };
  }, []);

  const persistSearches = useCallback(async (nextSearches: string[]) => {
    setRecentSearches(nextSearches);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextSearches));
  }, []);

  const addSearch = useCallback(async (query: string) => {
    const normalized = normalizeSearch(query);
    if (!normalized) return;

    const nextSearches = [
      normalized,
      ...recentSearches.filter((item) => item !== normalized),
    ].slice(0, MAX_RECENT_SEARCHES);

    await persistSearches(nextSearches);
  }, [persistSearches, recentSearches]);

  const removeSearch = useCallback(async (query: string) => {
    const nextSearches = recentSearches.filter((item) => item !== query);
    await persistSearches(nextSearches);
  }, [persistSearches, recentSearches]);

  const clearSearches = useCallback(async () => {
    await persistSearches([]);
  }, [persistSearches]);

  return {
    recentSearches,
    isLoaded,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
