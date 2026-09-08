'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAtlasStore } from '@/lib/store';

export default function Header() {
  const { uiMode, setUIMode, toggleSearch } = useAtlasStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleAtlasClick = () => {
    setUIMode('atlas');
    if (pathname !== '/') router.push('/');
  };

  const handleListClick = () => {
    setUIMode('list');
    if (pathname !== '/hall-of-fame') router.push('/hall-of-fame');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="shrink-0 flex items-center justify-center mt-1">
            <Image src="/logo.png" alt="Smart Bangladesh Logo" width={44} height={44} className="object-contain h-11 w-auto" priority />
          </div>
          <div className="flex flex-col justify-center">
            <h1
              className="text-base font-bold leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-500)' }}
            >
              Pride of BD
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Bangladesh Talent Atlas
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: '/', label: 'Atlas' },
            { href: '/hall-of-fame', label: 'Hall of Fame' },
            { href: '/contribute', label: 'Contribute' },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative py-2 text-sm transition-all duration-300 hover:opacity-80"
                style={{
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    className="absolute -bottom-5.5 left-0 right-0 h-1 rounded-t-full"
                    style={{ background: 'var(--color-emerald-600)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Search button styled as an input box */}
          <button
            onClick={toggleSearch}
            className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-sm"
            style={{
              background: 'rgba(0, 106, 78, 0.03)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
              width: '260px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 text-left truncate text-xs">Search people, fields, countries...</span>
          </button>

          {/* View toggle */}
          <div
            className="hidden sm:flex items-center rounded-full p-0.5"
            style={{ background: 'rgba(0, 106, 78, 0.06)', border: '1px solid var(--glass-border)' }}
          >
            <button
              onClick={handleAtlasClick}
              className="px-3 py-1 text-xs rounded-full transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                background: uiMode === 'atlas' ? 'var(--color-emerald-500)' : 'transparent',
                color: uiMode === 'atlas' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: uiMode === 'atlas' ? 600 : 400,
              }}
            >
              3D Atlas
            </button>
            <button
              onClick={handleListClick}
              className="px-3 py-1 text-xs rounded-full transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                background: uiMode === 'list' ? 'var(--color-emerald-500)' : 'transparent',
                color: uiMode === 'list' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: uiMode === 'list' ? 600 : 400,
              }}
            >
              List
            </button>
            <Link
              href="/admin"
              className="ml-1 px-3 py-1 text-xs rounded-full transition-all duration-300 flex items-center justify-center font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'rgba(0, 106, 78, 0.1)',
                color: 'var(--color-emerald-700)',
                border: '1px solid var(--color-emerald-200)',
              }}
              title="Admin"
            >
              A
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
