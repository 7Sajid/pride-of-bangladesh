'use client';

import { useState } from 'react';

interface PassportPhotoProps {
  photoUrl?: string;
  name: string;
  categoryColor?: string;
  categoryIcon?: string;
  className?: string;
  priority?: boolean;
}

export default function PassportPhoto({
  photoUrl,
  name,
  categoryColor = '#006a4e',
  categoryIcon,
  className = '',
}: PassportPhotoProps) {
  const [hasError, setHasError] = useState(false);

  // Extract initials (e.g. "Muhammad Yunus" -> "MY", "Prof. Dr. M. Zahid Hasan" -> "ZH")
  const getInitials = (fullName: string) => {
    if (!fullName) return 'BD';
    const cleanName = fullName
      .replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.|Sir|Engr\.)\s+/gi, '')
      .trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const showImage = Boolean(photoUrl) && !hasError;

  return (
    <div
      className={`relative aspect-3/4 rounded-xl overflow-hidden select-none shrink-0 ${className}`}
      style={{
        border: '1px solid rgba(0, 106, 78, 0.18)',
        boxShadow: '0 2px 8px rgba(0, 106, 78, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        background: '#f8faf9',
      }}
    >
      {showImage ? (
        <img
          src={photoUrl}
          alt={`Passport photo of ${name}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        /* Stylized passport photo placeholder */
        <div
          className="w-full h-full flex flex-col items-center justify-between p-2 text-center"
          style={{
            background: `linear-gradient(145deg, #ffffff 0%, ${categoryColor}15 100%)`,
          }}
        >
          {/* Subtle passport header badge */}
          <div className="w-full flex justify-between items-center opacity-50 px-1 pt-0.5">
            <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-900/60">
              PASSPORT
            </span>
            <span className="text-[10px]">{categoryIcon || '🇧🇩'}</span>
          </div>

          {/* Central Silhouette or Initials */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm tracking-wider shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}25, ${categoryColor}40)`,
                color: categoryColor,
                fontFamily: 'var(--font-display)',
                border: `1.5px solid ${categoryColor}50`,
              }}
            >
              {initials}
            </div>
            <span className="text-[10px] font-medium mt-1.5 line-clamp-1 opacity-75" style={{ color: 'var(--color-text-secondary)' }}>
              {name.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>

          {/* Bottom subtle watermark */}
          <div
            className="w-full py-0.5 text-[8px] tracking-widest font-mono uppercase text-center border-t"
            style={{
              borderColor: `${categoryColor}20`,
              color: 'var(--color-text-muted)',
            }}
          >
            OFFICIAL
          </div>
        </div>
      )}

      {/* Glossy inner border sheen */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
        }}
      />
    </div>
  );
}
