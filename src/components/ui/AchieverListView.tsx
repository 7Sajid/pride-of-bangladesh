'use client';

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAtlasStore } from '@/lib/store';
import { mergeAchievers } from '@/lib/data/achievers';
import AchieverTiltCard from './AchieverTiltCard';
import CategoryOrbitSelector from './CategoryOrbitSelector';

/**
 * Non-3D fallback / Hall of Fame list view.
 * Filterable, sortable card grid of all achievers.
 */
export default function AchieverListView() {
  const { selectedCategory, searchQuery, customAchievers, setCustomAchievers } = useAtlasStore();

  // Optionally sync with backend custom achievers if available
  useEffect(() => {
    fetch('/api/achievers', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.achievers)) {
          if (data.achievers.length > 0) {
            // Merge existing local with server list
            const combinedMap = new Map();
            [...data.achievers, ...customAchievers].forEach((a) => {
              if (a?.id) combinedMap.set(a.id, a);
            });
            setCustomAchievers(Array.from(combinedMap.values()));
          }
        }
      })
      .catch((err) => {
        // Silently fallback to localStorage customAchievers
        console.warn('Could not sync custom achievers from API:', err);
      });
  }, []);

  const allAchievers = useMemo(() => {
    return mergeAchievers(customAchievers);
  }, [customAchievers]);

  const filteredAchievers = useMemo(() => {
    let result = allAchievers;

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery && searchQuery.length >= 2) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.title.toLowerCase().includes(lower) ||
          a.country.toLowerCase().includes(lower) ||
          a.profession.toLowerCase().includes(lower) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(lower)))
      );
    }

    return result;
  }, [allAchievers, selectedCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* Category filters */}
      <div className="mb-8">
        <CategoryOrbitSelector />
      </div>

      {/* Results count */}
      <motion.p
        key={filteredAchievers.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm mb-6 font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Showing{' '}
        <span style={{ color: 'var(--color-emerald-400)', fontWeight: 700 }}>
          {filteredAchievers.length}
        </span>{' '}
        achiever{filteredAchievers.length !== 1 ? 's' : ''}
        {selectedCategory && (
          <span>
            {' '}in <span style={{ color: 'var(--color-emerald-400)' }}>{selectedCategory}</span>
          </span>
        )}
      </motion.p>

      {/* Card grid with standardized alignment & symmetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch auto-rows-fr">
        {filteredAchievers.map((achiever, idx) => (
          <AchieverTiltCard key={achiever.id} achiever={achiever} index={idx} />
        ))}
      </div>

      {/* Empty state */}
      {filteredAchievers.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">🔍</span>
          <p
            className="text-lg font-medium mb-2"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
          >
            No achievers found
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}

