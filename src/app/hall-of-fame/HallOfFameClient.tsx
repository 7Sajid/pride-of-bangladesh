'use client';

import { motion } from 'framer-motion';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import AchieverDetailSlideOver from '@/components/ui/AchieverDetailSlideOver';
import AchieverListView from '@/components/ui/AchieverListView';
import BangladeshMapBg from '@/components/ui/BangladeshMapBg';

export default function HallOfFameClient() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <BangladeshMapBg />
      <Header />
      <SearchBar />
      <AchieverDetailSlideOver />

      <div className="relative z-10 pt-24 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Hall of{' '}
              <span style={{ color: 'var(--color-red-500)' }}>Fame</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Browse the complete directory of Bangladeshi achievers making an impact worldwide.
            </p>
          </motion.div>

          {/* List view */}
          <AchieverListView />
        </div>
      </div>

      {/* Footer */}
      <footer
        className="relative z-10 py-8 px-6 text-center"
        style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(0, 106, 78, 0.02)' }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--color-emerald-500)' }}>
          🇧🇩 Pride of BD — Celebrating Bangladeshi Excellence Worldwide
        </p>
      </footer>
    </main>
  );
}
