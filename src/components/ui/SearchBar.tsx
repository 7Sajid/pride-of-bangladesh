'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '@/lib/store';
import { useAchieverSearch } from '@/hooks/useAchieverSearch';
import { getCategoryBySlug } from '@/lib/data/seed';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, searchOpen, toggleSearch } =
    useAtlasStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useAchieverSearch(searchQuery);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && searchOpen) {
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSearch, searchOpen]);

  // Auto-focus when opened
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60"
            style={{ background: 'rgba(0, 106, 78, 0.08)', backdropFilter: 'blur(4px)' }}
            onClick={toggleSearch}
          />

          {/* Search modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-70 w-full max-w-lg"
          >
            <div
              className="glass-heavy rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 25px 60px rgba(0, 106, 78, 0.15), 0 8px 24px rgba(0,0,0,0.08)' }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald-500)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search achievers, countries, fields..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <kbd
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ background: 'rgba(0, 106, 78, 0.08)', color: 'var(--color-text-muted)' }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="max-h-80 overflow-y-auto py-2">
                  {results.map((result) => {
                    const cat = getCategoryBySlug(result.achiever.category);
                    return (
                      <button
                        key={result.achiever.id}
                        onClick={() => {
                          toggleSearch();
                          setSearchQuery('');
                          router.push(`/achievers/${result.achiever.slug}`);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200"
                        style={{ }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0, 106, 78, 0.05)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        {/* Avatar placeholder */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                          style={{
                            background: `${cat?.color || '#006a4e'}10`,
                            border: `1px solid ${cat?.color || '#006a4e'}30`,
                          }}
                        >
                          {result.achiever.countryFlag}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {result.achiever.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {result.achiever.title}
                          </p>
                        </div>

                        {/* Category badge */}
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: `${cat?.color || '#006a4e'}10`,
                            color: cat?.color || '#006a4e',
                            border: `1px solid ${cat?.color || '#006a4e'}20`,
                          }}
                        >
                          {cat?.label || result.achiever.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {searchQuery.length >= 2 && results.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    No achievers found for &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}

              {/* Hint */}
              {searchQuery.length < 2 && (
                <div className="px-5 py-6 text-center">
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    Start typing to search across names, countries, fields, and institutions...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
