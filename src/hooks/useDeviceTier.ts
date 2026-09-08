'use client';

import { useState, useEffect } from 'react';
import type { DeviceTier } from '@/types/achiever';
import { useAtlasStore } from '@/lib/store';

/**
 * Detects device capabilities and returns an appropriate rendering tier.
 * - 'high': full 3D with post-processing
 * - 'low': simplified 3D (fewer particles, no bloom)
 * - 'fallback': no WebGL, show 2D list view
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high');
  const setDeviceTier = useAtlasStore((s) => s.setDeviceTier);

  useEffect(() => {
    const detect = (): DeviceTier => {
      // Check prefers-reduced-motion
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return 'fallback';
      }

      // Check WebGL2 support
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return 'fallback';
      } catch {
        return 'fallback';
      }

      // Capability signals
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

      if (cores <= 2 || memory <= 2) return 'low';
      if (cores <= 4 || memory <= 4) return 'low';

      return 'high';
    };

    const detected = detect();
    setTier(detected);
    setDeviceTier(detected);
  }, [setDeviceTier]);

  return tier;
}
