'use client';

import { Stars, OrbitControls, Environment } from '@react-three/drei';
import { useAtlasStore } from '@/lib/store';

/**
 * Scene environment: lighting, stars, orbit controls, post-processing (conditional).
 */
export default function SceneEnvironment() {
  const deviceTier = useAtlasStore((s) => s.deviceTier);
  const isHigh = deviceTier === 'high';

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} color="#94a3b8" />

      {/* Main directional — warm gold accent */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffd94d"
        castShadow={isHigh}
      />

      {/* Fill light — emerald tint */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.4}
        color="#22c968"
      />

      {/* Rim light — subtle red */}
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#f42a41" />

      {/* Star field background */}
      <Stars
        radius={50}
        depth={50}
        count={isHigh ? 5000 : 1500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset="night" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#040a12', 12, 30]} />
    </>
  );
}
