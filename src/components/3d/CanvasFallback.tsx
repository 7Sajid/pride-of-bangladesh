'use client';

/**
 * 2D fallback shown while the 3D canvas loads (Suspense boundary)
 * or on devices without WebGL support.
 */
export default function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gradient-hero">
      {/* Animated SVG Bangladesh silhouette */}
      <div className="relative">
        {/* Pulsing background glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(0,106,78,0.3) 0%, transparent 70%)',
            width: '300px',
            height: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* SVG Silhouette */}
        <svg
          width="200"
          height="260"
          viewBox="0 0 200 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float relative z-10"
        >
          <path
            d="M100 10 L120 25 L140 40 L155 60 L165 85 L160 110 L165 135 L155 160 L140 185 L125 210 L110 230 L100 245 L90 235 L75 215 L60 190 L45 160 L35 130 L30 105 L40 75 L55 50 L70 30 Z"
            fill="url(#mesh-gradient)"
            stroke="rgba(34,201,104,0.4)"
            strokeWidth="1.5"
          />
          {/* Red disc (flag) */}
          <circle cx="110" cy="120" r="25" fill="rgba(244,42,65,0.3)" />
          <defs>
            <linearGradient id="mesh-gradient" x1="30" y1="10" x2="165" y2="245">
              <stop offset="0%" stopColor="rgba(0,106,78,0.5)" />
              <stop offset="50%" stopColor="rgba(0,106,78,0.3)" />
              <stop offset="100%" stopColor="rgba(0,106,78,0.1)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Loading text */}
        <div className="text-center mt-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
          >
            Loading Atlas
          </p>
        </div>
      </div>
    </div>
  );
}
