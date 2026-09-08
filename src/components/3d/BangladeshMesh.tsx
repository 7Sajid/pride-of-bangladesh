'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hyper-detailed, cinematic 3D majestic galaxy.
 * The core contains a glowing topographical map of Bangladesh in vibrant emerald green,
 * pulsing with cosmic energy, and a crimson-red sphere embedded in its center.
 */
export default function BangladeshMesh() {
  const mapRef = useRef<THREE.Mesh>(null);
  const redSphereRef = useRef<THREE.Mesh>(null);
  const galaxyRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // --- 1. Topographical Map of Bangladesh ---
  const mapShape = useMemo(() => {
    const s = new THREE.Shape();
    // Simplified but recognizable Bangladesh polygon
    const points: [number, number][] = [
      [0.0, 1.4], [0.3, 1.3], [0.6, 1.2], [0.9, 1.0], [1.1, 0.7],
      [1.2, 0.4], [1.0, 0.1], [1.1, -0.2], [0.9, -0.5], [0.7, -0.8],
      [0.5, -1.1], [0.3, -1.3], [0.1, -1.4], [-0.1, -1.2], [-0.3, -0.9],
      [-0.5, -0.5], [-0.7, -0.2], [-0.8, 0.2], [-0.6, 0.6], [-0.4, 0.9],
      [-0.2, 1.2],
    ];

    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.closePath();
    return s;
  }, []);

  const mapGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(mapShape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 4,
      curveSegments: 16,
    });
  }, [mapShape]);

  // --- 2. Majestic Galaxy Particle System ---
  const galaxyGeometry = useMemo(() => {
    const particleCount = 20000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Core colors: emerald green bleeding out to majestic purple and starry blue
    const colorInside = new THREE.Color('#10b981'); // Emerald core
    const colorOutside = new THREE.Color('#3b82f6'); // Blue/purple edge
    const colorAccent = new THREE.Color('#8b5cf6');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Exponential radius for dense core
      const radius = Math.pow(Math.random(), 1.5) * 8 + 0.2; 
      const spinAngle = radius * 2.5; 
      const branchAngle = ((i % 4) / 4) * Math.PI * 2; // 4 spiral branches
      
      // Random scatter decreases closer to core
      const scatter = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * (radius * 0.15 + 0.1);
      const scatterY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * (radius * 0.1 + 0.05);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatter;
      positions[i3 + 1] = scatterY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatter;

      // Color interpolation
      const mixedColor = colorInside.clone().lerp(
        Math.random() > 0.5 ? colorOutside : colorAccent, 
        radius / 8
      );
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // --- 3. Animation Loop (Pulsing & Rotation) ---
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // The whole structure rotates slowly (the scroll animation happens in OrbitControls/App)
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    // Galaxy core spins slightly faster
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.05;
    }

    // Map pulsing cosmic energy
    if (mapRef.current) {
      const material = mapRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.4;
    }

    // Red sphere glowing pulse
    if (redSphereRef.current) {
      const material = redSphereRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.2 + Math.cos(t * 3) * 0.6;
      // Gentle floating
      redSphereRef.current.position.y = -0.05 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 8, 0, Math.PI / 16]}>
      
      {/* 1. The Majestic Galaxy */}
      <points ref={galaxyRef}>
        <bufferGeometry attach="geometry" {...galaxyGeometry} />
        <pointsMaterial
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          transparent={true}
          opacity={0.8}
        />
      </points>

      {/* 2. Topographical Map of Bangladesh at the Core */}
      <mesh ref={mapRef} geometry={mapGeometry} position={[0, 0, -0.15]}>
        <meshPhysicalMaterial
          color="#00C853" // Vibrant emerald
          emissive="#00E676" // Luminous cosmic energy
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.2}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* 3. Brilliant Crimson-Red Sphere (Flag Sun) */}
      <mesh ref={redSphereRef} position={[0.15, -0.05, 0.2]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#FF1744"
          emissive="#FF0000"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.5}
          toneMapped={false} // Ensure it stays extremely bright regardless of lighting
        />
      </mesh>
      
      {/* Intense red point light radiating from the sphere */}
      <pointLight position={[0.15, -0.05, 0.2]} distance={4} intensity={2.0} color="#FF1744" />
      
      {/* Emerald cosmic core light */}
      <pointLight position={[0, 0, 0]} distance={10} intensity={3.0} color="#00E676" />

    </group>
  );
}
