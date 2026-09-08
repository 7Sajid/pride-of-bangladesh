'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Achiever } from '@/types/achiever';
import { getCategoryBySlug } from '@/lib/data/seed';
import { useAtlasStore } from '@/lib/store';

import PassportPhoto from './PassportPhoto';

interface AchieverTiltCardProps {
  achiever: Achiever;
  index?: number;
}

export default function AchieverTiltCard({ achiever, index = 0 }: AchieverTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { openDetail } = useAtlasStore();

  const category = getCategoryBySlug(achiever.category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateY: x * 15,
      rotateX: -y * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1000px' }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => openDetail(achiever.id)}
        className="relative cursor-pointer rounded-2xl overflow-hidden transition-shadow duration-500 h-full flex flex-col justify-between"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'none' : 'transform 0.5s var(--ease-out-expo)',
          background: '#ffffff',
          border: `1px solid ${isHovered ? 'var(--glass-border-hover)' : 'var(--glass-border)'}`,
          boxShadow: isHovered
            ? `var(--shadow-card-hover)`
            : 'var(--shadow-card)',
        }}
      >
        {/* Gradient top accent */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, ${category?.color || 'var(--color-emerald-500)'}, ${category?.color || 'var(--color-emerald-500)'}80)`,
          }}
        />

        {/* Card Body: Left details + Right Passport Photo */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3.5">
            {/* Left side details */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Flag & Category badge */}
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="text-xl sm:text-2xl leading-none">{achiever.countryFlag}</span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium truncate max-w-42.5"
                  style={{
                    background: `${category?.color || 'var(--color-emerald-500)'}12`,
                    color: category?.color || 'var(--color-emerald-500)',
                    border: `1px solid ${category?.color || 'var(--color-emerald-500)'}25`,
                  }}
                >
                  {category?.icon} {category?.label}
                </span>
              </div>

              {/* Achiever Name */}
              <h3
                className="text-base sm:text-lg font-bold mb-1 leading-snug line-clamp-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                title={achiever.name}
              >
                {achiever.name}
              </h3>

              {/* Title */}
              <p
                className="text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
                title={achiever.title}
              >
                {achiever.title}
              </p>
            </div>

            {/* Right side: Passport size photo with strict 3:4 aspect ratio */}
            <div className="shrink-0 pt-0.5">
              <PassportPhoto
                photoUrl={achiever.photoUrl}
                name={achiever.name}
                categoryColor={category?.color}
                categoryIcon={category?.icon}
                className="w-20 sm:w-22 md:w-24 lg:w-26"
              />
            </div>
          </div>

          {/* Bottom metadata */}
          <div className="mt-3 pt-2.5 border-t flex items-center justify-between gap-2 text-xs" style={{ borderColor: 'rgba(0, 106, 78, 0.08)' }}>
            <div className="flex items-center gap-1.5 min-w-0 truncate" style={{ color: 'var(--color-text-muted)' }}>
              <span className="truncate font-medium">{achiever.country}</span>
              <span>·</span>
              <span className="truncate">{achiever.profession}</span>
            </div>

            {/* Awards count */}
            {achiever.awards && achiever.awards.length > 0 && (
              <span className="text-[11px] font-semibold shrink-0 whitespace-nowrap" style={{ color: 'var(--color-red-500)' }}>
                🏆 {achiever.awards.length} award{achiever.awards.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Hover shimmer overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none animate-shimmer"
            style={{ borderRadius: 'inherit' }}
          />
        )}
      </div>
    </motion.div>
  );
}
