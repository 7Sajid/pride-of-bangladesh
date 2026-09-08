'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';
import { CATEGORIES, getAchieversByCategory } from '@/lib/data/seed';
import { useAtlasStore } from '@/lib/store';
import type { CategorySlug } from '@/types/achiever';

/** Single achiever node on an orbit ring */
function AchieverNode({
  position,
  color,
  achieverId,
  name,
  index,
}: {
  position: [number, number, number];
  color: string;
  achieverId: string;
  name: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { hoveredAchieverId, hoverAchiever, openDetail } = useAtlasStore();
  const isHovered = hoveredAchieverId === achieverId;

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.position.y =
        position[1] + Math.sin(Date.now() * 0.001 + index) * 0.05;

      // Scale on hover
      const targetScale = isHovered ? 1.8 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 5
      );
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoverAchiever(achieverId);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hoverAchiever(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          openDetail(achieverId);
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.8 : 0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glow halo */}
      <mesh position={position}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.25 : 0.08}
        />
      </mesh>

      {/* Name label on hover */}
      {isHovered && (
        <Text
          position={[position[0], position[1] + 0.25, position[2]]}
          fontSize={0.1}
          color="#f0f4f8"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

/** Orbit ring for a single category */
function OrbitRing({
  category,
}: {
  category: typeof CATEGORIES[number];
}) {
  const ringRef = useRef<THREE.LineLoop>(null);
  const selectedCategory = useAtlasStore((s) => s.selectedCategory);

  const isActive = !selectedCategory || selectedCategory === category.slug;
  const achievers = useMemo(() => getAchieversByCategory(category.slug), [category.slug]);

  // Compute ring points
  const ringPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * category.orbitRadius,
          0,
          Math.sin(angle) * category.orbitRadius
        )
      );
    }
    return pts;
  }, [category.orbitRadius]);

  const ringGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    return geo;
  }, [ringPoints]);

  // Slow ring rotation
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03 * (1 + CATEGORIES.indexOf(category) * 0.1);
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* Orbit ring line */}
      <lineLoop ref={ringRef} geometry={ringGeo}>
        <lineBasicMaterial
          color={category.color}
          transparent
          opacity={0.2}
          linewidth={1}
        />
      </lineLoop>

      {/* Achiever nodes positioned along ring */}
      {achievers.map((achiever, idx) => {
        const angle = (idx / Math.max(achievers.length, 1)) * Math.PI * 2;
        const x = Math.cos(angle) * category.orbitRadius;
        const z = Math.sin(angle) * category.orbitRadius;
        const y = Math.sin(angle * 2) * 0.15; // slight undulation

        return (
          <AchieverNode
            key={achiever.id}
            position={[x, y, z]}
            color={category.color}
            achieverId={achiever.id}
            name={achiever.name}
            index={idx}
          />
        );
      })}
    </group>
  );
}

/** All orbit rings together */
export default function OrbitRings() {
  return (
    <group>
      {CATEGORIES.map((cat) => (
        <OrbitRing key={cat.id} category={cat} />
      ))}
    </group>
  );
}
