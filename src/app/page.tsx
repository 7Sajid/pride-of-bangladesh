'use client';

if (typeof window !== 'undefined') {
  // Suppress THREE.Clock deprecation warning caused by @react-three/fiber internally
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import AchieverDetailSlideOver from '@/components/ui/AchieverDetailSlideOver';
import StatCounter from '@/components/ui/StatCounter';
import CanvasFallback from '@/components/3d/CanvasFallback';
import BangladeshMapBg from '@/components/ui/BangladeshMapBg';
import Image from 'next/image';

import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useAtlasStore } from '@/lib/store';
import { getAtlasStats, ACHIEVERS, CATEGORIES } from '@/lib/data/seed';
import { mergeAchievers } from '@/lib/data/achievers';

/* ─── Dynamically import 3D scene components (client-only, no SSR) ─── */
const SceneEnvironment = dynamic(() => import('@/components/3d/SceneEnvironment'), { ssr: false });
const OrbitRings = dynamic(() => import('@/components/3d/OrbitRings'), { ssr: false });
const Constellation = dynamic(() => import('@/components/3d/Constellation'), { ssr: false });

export default function AtlasPage() {
  const tier = useDeviceTier();
  const uiMode = useAtlasStore((s) => s.uiMode);
  const customAchievers = useAtlasStore((s) => s.customAchievers);
  const stats = getAtlasStats();

  const show3D = uiMode === 'atlas' && tier !== 'fallback';
  const displayAchievers = mergeAchievers(customAchievers);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg-primary)' }}>
      {/* ─── Bangladesh Map Background ─── */}
      <BangladeshMapBg />

      {/* ─── Header ─── */}
      <Header />

      {/* ─── Search ─── */}
      <SearchBar />

      {/* ─── Detail Panel ─── */}
      <AchieverDetailSlideOver />

      {/* ─── 3D Canvas Layer ─── */}
      {show3D && (
        <div className="fixed inset-0 z-0">
          <Suspense fallback={<CanvasFallback />}>
            <Canvas
              camera={{ position: [0, 5, 10], fov: 50 }}
              dpr={tier === 'high' ? [1, 2] : [1, 1]}
              style={{ background: 'transparent' }}
            >
              <SceneEnvironment />
              <OrbitRings />
              <Constellation />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* ─── HUD Overlay ─── */}
      <div className={`relative z-10 ${show3D ? 'pointer-events-none' : ''}`}>
        {/* Hero section */}
        <section className={`pt-24 pb-8 px-6 ${show3D ? 'min-h-[60vh] flex flex-col justify-end' : ''}`}>
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <h2
                className="text-4xl md:text-6xl font-bold mb-5"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-900)' }}
              >
                Bangladesh's
                <br />
                brilliance, <span style={{ color: 'var(--color-red-600)' }}>mapped.</span>
              </h2>
              <p
                className="text-lg md:text-xl mb-8"
                style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}
              >
                Discover the visionary scientists, scholars, educators, innovators, and researchers from Bangladesh who have achieved global prestige and transformed the world through education, research and innovation.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/hall-of-fame"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ background: 'var(--color-emerald-800)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Meet the Hall of Fame
                </Link>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-emerald-800)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
                    Celebrating<br/>Bangladeshi Excellence
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-emerald-800)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
                    From Bangladesh<br/>to the World
                  </div>
                </div>
              </div>
            </motion.div>


          </div>
        </section>

        {/* Stats bar */}
        <section className="pointer-events-auto relative z-10 mt-12 mb-8">
          <div className="max-w-250 mx-auto px-6">
            <div
              className="rounded-full flex flex-wrap justify-between items-center py-2 px-8"
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
              }}
            >
              <StatCounter 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>} 
                label="Achievers" value={stats.totalAchievers} suffix="+" 
              />
              <StatCounter 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>} 
                label="Fields" value={stats.totalFields} suffix="+" 
              />
              <StatCounter 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>} 
                label="Countries" value={stats.totalCountries} suffix="+" 
              />
              <StatCounter 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>} 
                label="Awards" value={stats.totalAwards} suffix="+" 
              />
            </div>
          </div>
        </section>

        {/* Explore extraordinary people */}
        <section className="pt-20 pb-12 px-6 pointer-events-auto bg-white/50 backdrop-blur-sm relative z-10 border-t border-gray-200/50" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.95) 100%)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Explore extraordinary people</h3>
                <p className="text-gray-600">Meet some of the remarkable Bangladeshi minds making a global impact.</p>
              </div>
              <Link href="/hall-of-fame" className="text-sm font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 transition-colors shrink-0">
                View all talent <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayAchievers.slice(0, 4).map(achiever => (
                <div key={achiever.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={() => useAtlasStore.getState().openDetail(achiever.id)}>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-100 relative bg-gray-50">
                      {achiever.photoUrl && <img src={achiever.photoUrl} alt={achiever.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{achiever.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{achiever.title}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50">
                      <div className="w-3 h-3 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
                        {/* Dummy flag circle */}
                        <div className="w-full h-full bg-gray-300"></div>
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 truncate max-w-25">{achiever.country}</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-emerald-700 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Discover by field */}
        <section className="py-12 px-6 pointer-events-auto bg-white relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Discover by field</h3>
              <p className="text-gray-600 text-sm">Explore talents across diverse disciplines and areas of impact.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.slice(0, 4).map((cat, i) => (
                <Link href="/hall-of-fame" key={cat.slug} onClick={() => { useAtlasStore.getState().selectCategory(cat.slug); }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-100 transition-all group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: 'rgba(0, 106, 78, 0.05)' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-800 transition-colors">{cat.label}</h4>
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      Explore <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-6 pointer-events-auto relative z-10" style={{ background: 'var(--color-emerald-900)', backgroundImage: 'radial-gradient(circle at 100% 100%, var(--color-emerald-800) 0%, transparent 50%), radial-gradient(circle at 0% 0%, var(--color-emerald-950) 0%, transparent 50%)' }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Know a Bangladeshi who deserves to be here?</h3>
                <p className="text-emerald-100 text-sm">Help us grow the atlas. Share the profile of an inspiring Bangladeshi talent.</p>
              </div>
            </div>
            <Link href="/contribute" className="shrink-0 px-8 py-4 bg-white text-emerald-900 font-bold rounded-full text-sm hover:bg-gray-50 hover:shadow-lg transition-all flex items-center gap-2">
              Contribute a profile <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-8 px-6 text-center pointer-events-auto"
          style={{
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(0, 106, 78, 0.02)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--color-emerald-500)' }}>
            🇧🇩 Pride of BD — Celebrating Bangladeshi Excellence Worldwide
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Built with ❤️ to honor the achievers who make Bangladesh proud.
          </p>
        </footer>
      </div>
    </main>
  );
}
