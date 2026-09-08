import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { Achiever } from '@/types/achiever';
import { ACHIEVERS, getCategoryBySlug, getConnectionsForAchiever, getAchieverById } from '@/lib/data/seed';
import Link from 'next/link';
import BangladeshMapBg from '@/components/ui/BangladeshMapBg';
import PassportPhoto from '@/components/ui/PassportPhoto';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getAchieverFromAnySource(slug: string): Achiever | undefined {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'custom-achievers.json');
    if (fs.existsSync(dataFilePath)) {
      const list: Achiever[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      const custom = list.find((a) => a.slug === slug || a.id === slug);
      if (custom) {
        if (custom.isDeleted) return undefined;
        return custom;
      }
    }
  } catch (e) {
    // ignore
  }

  const seed = ACHIEVERS.find((a) => a.slug === slug);
  return seed;
}

export async function generateStaticParams() {
  return ACHIEVERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const achiever = getAchieverFromAnySource(slug);
  if (!achiever) return { title: 'Achiever Not Found' };

  return {
    title: `${achiever.name} — Pride of BD`,
    description: achiever.bio.slice(0, 160),
    openGraph: {
      title: `${achiever.name} — ${achiever.title}`,
      description: achiever.bio.slice(0, 160),
      type: 'profile',
    },
  };
}

export default async function AchieverProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const achiever = getAchieverFromAnySource(slug);

  if (!achiever) notFound();

  const category = getCategoryBySlug(achiever.category);
  const connections = getConnectionsForAchiever(achiever.id);

  // Get connected achiever details
  const connectedAchievers = connections
    .map((c) => {
      const otherId = c.achieverId === achiever.id ? c.relatedAchieverId : c.achieverId;
      return { connection: c, achiever: getAchieverById(otherId) || getAchieverFromAnySource(otherId) };
    })
    .filter((c) => c.achiever);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg-primary)' }}>
      <BangladeshMapBg />
      {/* Minimal header */}
      <header className="sticky top-0 z-50 glass" style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Atlas
          </Link>
          <Link
            href="/hall-of-fame"
            className="text-sm transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Hall of Fame
          </Link>
        </div>
      </header>

      {/* Profile content */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <PassportPhoto
              photoUrl={achiever.photoUrl}
              name={achiever.name}
              categoryColor={category?.color}
              categoryIcon={category?.icon}
              className="w-28 sm:w-36 shadow-lg rounded-2xl"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-3xl sm:text-4xl">{achiever.countryFlag}</span>
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: `${category?.color || '#22c968'}15`,
                    color: category?.color || '#22c968',
                    border: `1px solid ${category?.color || '#22c968'}30`,
                  }}
                >
                  {category?.icon} {category?.label}
                </span>
              </div>

              <h1
                className="text-3xl md:text-5xl font-bold leading-tight mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {achiever.name}
              </h1>
              <p className="text-xl" style={{ color: 'var(--color-emerald-400)' }}>
                {achiever.title}
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                <span>📍 {achiever.country}</span>
                <span>💼 {achiever.profession}</span>
                <span>🌐 {achiever.nationality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <section
              className="p-6 rounded-2xl"
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                About
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {achiever.bio}
              </p>
            </section>

            {/* Awards */}
            {achiever.awards.length > 0 && (
              <section
                className="p-6 rounded-2xl"
                style={{
                  background: '#fffdf5',
                  border: '1px solid rgba(249, 168, 37, 0.2)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-400)' }}
                >
                  🏆 Awards & Recognition
                </h2>
                <div className="space-y-3">
                  {achiever.awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: 'rgba(249, 168, 37, 0.05)',
                        border: '1px solid rgba(249, 168, 37, 0.08)',
                      }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {award.title}
                        </p>
                        {award.organization && (
                          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            {award.organization}
                          </p>
                        )}
                      </div>
                      {award.year && (
                        <span
                          className="text-sm font-mono px-3 py-1 rounded-full"
                          style={{
                            background: 'rgba(249, 168, 37, 0.1)',
                            color: 'var(--color-gold-400)',
                          }}
                        >
                          {award.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Constellation Connections */}
            {connectedAchievers.length > 0 && (
              <section
                className="p-6 rounded-2xl"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  🔗 Constellation Connections
                </h2>
                <div className="space-y-3">
                  {connectedAchievers.map(({ connection, achiever: related }) => {
                    if (!related) return null;
                    const relCat = getCategoryBySlug(related.category);
                    const labels: Record<string, string> = {
                      same_field: 'Same Field',
                      same_university: 'Same University',
                      same_country: 'Same Country',
                      same_industry: 'Same Industry',
                      collaborated: 'Collaborated',
                    };

                    return (
                      <Link
                        key={connection.id}
                        href={`/achievers/${related.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                        style={{ border: '1px solid var(--glass-border)' }}
                      >
                        <span className="text-2xl">{related.countryFlag}</span>
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {related.name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {related.title}
                          </p>
                        </div>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: `${relCat?.color || '#22c968'}15`,
                            color: relCat?.color || '#22c968',
                            border: `1px solid ${relCat?.color || '#22c968'}20`,
                          }}
                        >
                          {labels[connection.relationType] || connection.relationType}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Institutions */}
            {achiever.institutions.length > 0 && (
              <section
                className="p-5 rounded-2xl"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                }}
              >
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  🏛️ Institutions
                </h3>
                <div className="space-y-3">
                  {achiever.institutions.map((inst, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {inst.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {inst.role}
                      </p>
                      {inst.current && (
                        <span
                          className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--color-emerald-500)', color: '#fff' }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            <section
              className="p-5 rounded-2xl"
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                🏷️ Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {achiever.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Quick stats */}
            <section
              className="p-5 rounded-2xl text-center"
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-400)' }}
                  >
                    {achiever.awards.length}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Awards</p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-400)' }}
                  >
                    {connectedAchievers.length}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Connections</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          🇧🇩 Pride of BD — Celebrating Bangladeshi Excellence Worldwide
        </p>
      </footer>
    </main>
  );
}
