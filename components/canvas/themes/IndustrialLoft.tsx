'use client';

import React from 'react';
import * as THREE from 'three';
import { useThemeTexture } from '@/lib/useThemeTexture';

interface ThemeTextures {
  brickWall?: THREE.CanvasTexture | null;
  loftFloor?: THREE.CanvasTexture | null;
}

export const IndustrialLoft: React.FC<{ textures: ThemeTextures | null }> = ({ textures }) => {
  // Real high-resolution exposed brick and night skyline photographic images
  const brickPhotoTex = useThemeTexture('/themes/loft_brick.jpg');
  const skylinePhotoTex = useThemeTexture('/themes/loft_skyline.jpg');

  return (
    <group>
      {/* ================= MOODY WARM INDUSTRIAL LIGHTING ================= */}
      <ambientLight intensity={0.7} color="#fed7aa" />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.8}
        color="#fef08a"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* ================= WAREHOUSE FLOOR & RUG ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          key="loft-floor-mat"
          map={textures?.loftFloor || undefined}
          color="#1c1917"
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Distressed Center Vintage Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#3b1d1d" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]}>
        <ringGeometry args={[7.2, 7.8, 4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>

      {/* ================= REAL PHOTOGRAPHIC EXPOSED BRICK WALLS ================= */}
      {/* North Brick Wall (Z = -12) */}
      <group position={[0, 2.7, -12]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="loft-brick-photo-north"
            map={brickPhotoTex || textures?.brickWall || undefined}
            color={brickPhotoTex ? '#ffffff' : '#991b1b'}
          />
        </mesh>
        {/* Cast Iron Baseboard */}
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Top Angle Iron Trim */}
        <mesh position={[0, 2.65, 0.05]}>
          <boxGeometry args={[24.2, 0.15, 0.1]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.4} />
        </mesh>
      </group>

      {/* South Brick Wall (Z = 12) */}
      <group position={[0, 2.7, 12]} rotation={[0, Math.PI, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="loft-brick-photo-south"
            map={brickPhotoTex || textures?.brickWall || undefined}
            color={brickPhotoTex ? '#ffffff' : '#991b1b'}
          />
        </mesh>
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.65, 0.05]}>
          <boxGeometry args={[24.2, 0.15, 0.1]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.4} />
        </mesh>
      </group>

      {/* East Brick Wall (X = 12) */}
      <group position={[12, 2.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="loft-brick-photo-east"
            map={brickPhotoTex || textures?.brickWall || undefined}
            color={brickPhotoTex ? '#ffffff' : '#991b1b'}
          />
        </mesh>
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.65, 0.05]}>
          <boxGeometry args={[24.2, 0.15, 0.1]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.4} />
        </mesh>
      </group>

      {/* Vertical Black Steel I-Beams dividing wall sections */}
      {[-6, 0, 6].map((x) => (
        <group key={`ibeam-north-${x}`} position={[x, 2.7, -11.9]}>
          <mesh>
            <boxGeometry args={[0.35, 5.4, 0.2]} />
            <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {[-6, 0, 6].map((z) => (
        <group key={`ibeam-east-${z}`} position={[11.9, 2.7, z]}>
          <mesh>
            <boxGeometry args={[0.2, 5.4, 0.35]} />
            <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Copper Conduits & Wall Pipes */}
      <mesh position={[0, 4.4, -11.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 23.8, 8]} />
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ================= CEILING, TRUSSES & EDISON BULBS ================= */}
      <group position={[0, 5.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>

        {/* Steel Rafter Trusses */}
        {[-8, -4, 0, 4, 8].map((x) => (
          <mesh key={`truss-${x}`} position={[x, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.4, 24]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}

        {/* Central Spiral HVAC Galvanized Duct */}
        <mesh position={[0, -0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 24, 20]} />
          <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Hanging Edison Filament Pendants */}
        {[
          [-5, -1.8, -4],
          [5, -1.8, -4],
          [-5, -1.8, 4],
          [5, -1.8, 4],
          [0, -2.1, 0],
        ].map(([bx, by, bz], idx) => (
          <group key={`bulb-${idx}`} position={[bx, by, bz]}>
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 2.0]} />
              <meshBasicMaterial color="#18181b" />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
            <pointLight color="#f59e0b" intensity={2.4} distance={9} decay={2} />
          </group>
        ))}
      </group>

      {/* ================= WEST INDUSTRIAL GRID WAREHOUSE WINDOWS ================= */}
      <group position={[-12, 2.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[24, 5.4]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.85}
            transparent
            opacity={0.25}
            roughness={0.1}
          />
        </mesh>
        {[-8, -4, 0, 4, 8].map((wx) => (
          <mesh key={`grid-v-${wx}`} position={[wx, 0, 0.02]}>
            <boxGeometry args={[0.08, 5.4, 0.08]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {[-1.5, 0, 1.5].map((wy) => (
          <mesh key={`grid-h-${wy}`} position={[0, wy, 0.02]}>
            <boxGeometry args={[24, 0.08, 0.08]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Real Night City Skyline Backdrop outside the window */}
      <group position={[-24, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[60, 24]} />
          <meshBasicMaterial
            map={skylinePhotoTex || undefined}
            color={skylinePhotoTex ? '#ffffff' : '#020617'}
          />
        </mesh>
      </group>

      {/* ================= LEATHER CHESTERFIELD BENCH ================= */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[4.2, 0.44, 1.4]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[4.0, 0.24, 1.25]} />
          <meshStandardMaterial color="#3f1d0b" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
