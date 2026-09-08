'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useAtlasStore } from '@/lib/store';
import { getConnectionsForAchiever, ACHIEVERS, CATEGORIES } from '@/lib/data/seed';

/**
 * Constellation lines connecting related achievers.
 * Only shows connections for the currently hovered or selected achiever.
 */
export default function Constellation() {
  const { hoveredAchieverId, selectedAchieverId } = useAtlasStore();

  const activeId = hoveredAchieverId || selectedAchieverId;

  // Compute positions for all achievers (must match OrbitRings positioning)
  const positionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();

    for (const cat of CATEGORIES) {
      const achievers = ACHIEVERS.filter((a) => a.category === cat.slug);
      achievers.forEach((achiever, idx) => {
        const angle = (idx / Math.max(achievers.length, 1)) * Math.PI * 2;
        const x = Math.cos(angle) * cat.orbitRadius;
        const z = Math.sin(angle) * cat.orbitRadius;
        const y = Math.sin(angle * 2) * 0.15;
        map.set(achiever.id, [x, y, z]);
      });
    }

    return map;
  }, []);

  // Get connections for active achiever
  const lines = useMemo(() => {
    if (!activeId) return [];

    const connections = getConnectionsForAchiever(activeId);
    const result: { points: [number, number, number][]; color: string }[] = [];

    for (const conn of connections) {
      const otherId =
        conn.achieverId === activeId ? conn.relatedAchieverId : conn.achieverId;

      const fromPos = positionMap.get(activeId);
      const toPos = positionMap.get(otherId);

      if (fromPos && toPos) {
        const colorMap: Record<string, string> = {
          same_field: '#22c968',
          same_university: '#3b82f6',
          same_country: '#f9a825',
          same_industry: '#a855f7',
          collaborated: '#ec4899',
        };

        result.push({
          points: [fromPos, toPos],
          color: colorMap[conn.relationType] || '#22c968',
        });
      }
    }

    return result;
  }, [activeId, positionMap]);

  if (!activeId || lines.length === 0) return null;

  return (
    <group>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={line.points}
          color={line.color}
          lineWidth={1.5}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}
