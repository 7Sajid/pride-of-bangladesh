'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/data/seed';
import { useAtlasStore } from '@/lib/store';

/**
 * Category filter pills — selects a category to filter orbit rings and list view.
 */
export default function CategoryOrbitSelector() {
  const { selectedCategory, selectCategory } = useAtlasStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap items-center gap-2"
    >
      {/* All button */}
      <button
        onClick={() => selectCategory(null)}
        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          fontFamily: 'var(--font-body)',
          background: selectedCategory === null ? 'var(--color-emerald-500)' : 'rgba(255,255,255,0.05)',
          color: selectedCategory === null ? '#fff' : 'var(--color-text-secondary)',
          border: `1px solid ${selectedCategory === null ? 'var(--color-emerald-400)' : 'var(--glass-border)'}`,
          boxShadow: selectedCategory === null ? 'var(--shadow-glow-emerald)' : 'none',
        }}
      >
        All Fields
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => selectCategory(isActive ? null : cat.slug)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              fontFamily: 'var(--font-body)',
              background: isActive ? `${cat.color}20` : 'rgba(255,255,255,0.05)',
              color: isActive ? cat.color : 'var(--color-text-secondary)',
              border: `1px solid ${isActive ? `${cat.color}60` : 'var(--glass-border)'}`,
              boxShadow: isActive ? `0 0 20px ${cat.color}20` : 'none',
            }}
          >
            <span className="mr-1.5">{cat.icon}</span>
            {cat.label}
          </button>
        );
      })}
    </motion.div>
  );
}
