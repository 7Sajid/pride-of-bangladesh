'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Achiever, SearchResult } from '@/types/achiever';
import { ACHIEVERS } from '@/lib/data/seed';
import { useAtlasStore } from '@/lib/store';

/**
 * Client-side fuzzy search across achiever names, countries, professions, tags, institutions.
 */
export function useAchieverSearch(query: string): SearchResult[] {
  const customAchievers = useAtlasStore((state) => state.customAchievers);
  const allAchievers = useMemo(() => [...ACHIEVERS, ...customAchievers], [customAchievers]);
  const [results, setResults] = useState<SearchResult[]>([]);

  const search = useCallback((q: string): SearchResult[] => {
    if (!q || q.length < 2) return [];

    const lower = q.toLowerCase();
    const scored: SearchResult[] = [];

    for (const achiever of allAchievers) {
      if (!achiever) continue;

      let bestScore = 0;
      let matchField = '';

      // Name match (highest weight)
      if (achiever.name?.toLowerCase().includes(lower)) {
        bestScore = 100;
        matchField = 'name';
      }
      // Profession match
      if (achiever.profession?.toLowerCase().includes(lower) && bestScore < 80) {
        bestScore = 80;
        matchField = 'profession';
      }
      // Country match
      if (achiever.country?.toLowerCase().includes(lower) && bestScore < 70) {
        bestScore = 70;
        matchField = 'country';
      }
      // Title match
      if (achiever.title?.toLowerCase().includes(lower) && bestScore < 60) {
        bestScore = 60;
        matchField = 'title';
      }
      // Tag match
      for (const tag of achiever.tags || []) {
        if (tag?.toLowerCase().includes(lower) && bestScore < 50) {
          bestScore = 50;
          matchField = `tag: ${tag}`;
        }
      }
      // Institution match
      for (const inst of achiever.institutions || []) {
        if (inst.name?.toLowerCase().includes(lower) && bestScore < 55) {
          bestScore = 55;
          matchField = `institution: ${inst.name}`;
        }
      }

      if (bestScore > 0) {
        scored.push({ achiever, matchField, score: bestScore });
      }
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [allAchievers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(search(query));
    }, 150); // debounce

    return () => clearTimeout(timer);
  }, [query, search]);

  return results;
}
