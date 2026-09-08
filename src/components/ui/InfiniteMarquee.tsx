'use client';

import { getFeaturedAchievers } from '@/lib/data/seed';

/**
 * Auto-scrolling horizontal marquee of featured achiever highlights.
 * Pure CSS animation for performance — no JS runtime.
 */
export default function InfiniteMarquee() {
  const featured = getFeaturedAchievers();

  // Duplicate items for seamless loop
  const items = [...featured, ...featured];

  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(0, 106, 78, 0.02)',
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-bg-primary), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--color-bg-primary), transparent)' }}
      />

      {/* Scrolling track */}
      <div
        className="flex gap-8 animate-marquee hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': '40s', width: 'max-content' } as React.CSSProperties}
      >
        {items.map((achiever, idx) => (
          <div
            key={`${achiever.id}-${idx}`}
            className="flex items-center gap-4 shrink-0 px-8 py-6 rounded-2xl min-w-95"
            style={{
              background: '#ffffff',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 4px 12px rgba(0,106,78,0.08)',
            }}
          >
            <span className="text-3xl">{achiever.countryFlag}</span>
            <div className="overflow-hidden">
              <p
                className="text-base font-bold truncate"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {achiever.name}
              </p>
              <p
                className="text-sm truncate"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {achiever.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
