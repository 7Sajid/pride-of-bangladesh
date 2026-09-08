'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '@/lib/store';
import { getCategoryBySlug, getConnectionsForAchiever } from '@/lib/data/seed';
import { findAchiever } from '@/lib/data/achievers';
import Link from 'next/link';
import PassportPhoto from './PassportPhoto';

/**
 * Slide-over detail panel for a selected achiever.
 */
export default function AchieverDetailSlideOver() {
  const { selectedAchieverId, detailOpen, closeDetail, customAchievers } = useAtlasStore();
  const achiever = selectedAchieverId ? findAchiever(selectedAchieverId, customAchievers) : null;
  const category = achiever ? getCategoryBySlug(achiever.category) : null;
  const connections = selectedAchieverId ? getConnectionsForAchiever(selectedAchieverId) : [];

  return (
    <AnimatePresence>
      {detailOpen && achiever && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55"
            style={{ background: 'rgba(0, 106, 78, 0.08)', backdropFilter: 'blur(2px)' }}
            onClick={closeDetail}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-56 overflow-y-auto"
            style={{
              background: '#ffffff',
              borderLeft: '1px solid var(--glass-border)',
              boxShadow: '-10px 0 40px rgba(0, 106, 78, 0.1)',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,106,78,0.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 pt-16">
              {/* Category badge */}
              <span
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium mb-4"
                style={{
                  background: `${category?.color || '#006a4e'}10`,
                  color: category?.color || '#006a4e',
                  border: `1px solid ${category?.color || '#006a4e'}20`,
                }}
              >
                {category?.icon} {category?.label}
              </span>

              {/* Photo + Name Row */}
              <div className="flex items-start gap-4 mb-4">
                <PassportPhoto
                  photoUrl={achiever.photoUrl}
                  name={achiever.name}
                  categoryColor={category?.color}
                  categoryIcon={category?.icon}
                  className="w-24 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{achiever.countryFlag}</span>
                  </div>
                  <h2
                    className="text-xl font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    {achiever.name}
                  </h2>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--color-emerald-500)' }}>
                    {achiever.title}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>📍 {achiever.country}</span>
                <span>💼 {achiever.profession}</span>
              </div>

              {/* Bio */}
              <div
                className="mt-6 p-4 rounded-xl text-sm leading-relaxed"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {achiever.bio}
              </div>

              {/* Awards */}
              {achiever.awards.length > 0 && (
                <div className="mt-6">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--color-red-500)', fontFamily: 'var(--font-display)' }}
                  >
                    🏆 Awards & Recognition
                  </h3>
                  <div className="space-y-2">
                    {achiever.awards.map((award, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg text-sm"
                        style={{
                          background: 'rgba(244, 42, 65, 0.04)',
                          border: '1px solid rgba(244, 42, 65, 0.1)',
                        }}
                      >
                        <span style={{ color: 'var(--color-text-primary)' }}>{award.title}</span>
                        {award.year && (
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {award.year}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Institutions */}
              {achiever.institutions.length > 0 && (
                <div className="mt-6">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    🏛️ Institutions
                  </h3>
                  <div className="space-y-2">
                    {achiever.institutions.map((inst, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg text-sm"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--color-text-primary)' }}>{inst.name}</span>
                          <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {inst.role}
                          </span>
                        </div>
                        {inst.current && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-emerald-500)', color: '#fff' }}>
                            Current
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {achiever.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(0, 106, 78, 0.06)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* View full profile link */}
              <Link
                href={`/achievers/${achiever.slug}`}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-400))',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  boxShadow: 'var(--shadow-glow-emerald)',
                }}
              >
                View Full Profile
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Connections count */}
              {connections.length > 0 && (
                <p className="mt-4 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  🔗 {connections.length} constellation connection{connections.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
