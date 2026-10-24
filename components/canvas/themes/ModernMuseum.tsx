'use client';

import React from 'react';
import * as THREE from 'three';
import { useThemeTexture } from '@/lib/useThemeTexture';

interface ThemeTextures {
  museumWall?: THREE.CanvasTexture | null;
  museumFloor?: THREE.CanvasTexture | null;
}

export const ModernMuseum: React.FC<{ textures: ThemeTextures | null }> = ({ textures }) => {
  // Real high-resolution museum gallery and exhibition hall photographic images
  const museumGalleryTex = useThemeTexture('/themes/museum_gallery.jpg');
  const museumHallTex = useThemeTexture('/themes/museum_hall.jpg');

  return (
    <group>
      {/* ================= ARCHIVAL GALLERY LIGHTING ================= */}
      <ambientLight intensity={0.85} color="#f8fafc" />
      <directionalLight
        position={[0, 9, 2]}
        intensity={1.5}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight color="#e2e8f0" groundColor="#334155" intensity={0.5} />

      {/* ================= FRENCH OAK HERRINGBONE PARQUET FLOOR ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          key="museum-floor-mat"
          map={textures?.museumFloor || undefined}
          color="#542c16"
          roughness={0.28}
          metalness={0.1}
        />
      </mesh>

      {/* Center Slate Gallery Mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]}>
        <ringGeometry args={[6.8, 7.0, 4]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ================= REAL PHOTOGRAPHIC MUSEUM GALLERY WALLS ================= */}
      {/* North Gallery Wall (Z = -12) */}
      <group position={[0, 2.7, -12]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="museum-photo-north"
            map={museumGalleryTex || textures?.museumWall || undefined}
            color={museumGalleryTex ? '#ffffff' : '#f1f5f9'}
          />
        </mesh>
        {/* Nero Marquina Marble Baseboard */}
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Dark Bronze Picture Rail */}
        <mesh position={[0, 2.45, 0.05]}>
          <boxGeometry args={[24.2, 0.12, 0.08]} />
          <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* South Gallery Wall (Z = 12) */}
      <group position={[0, 2.7, 12]} rotation={[0, Math.PI, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="museum-photo-south"
            map={museumGalleryTex || textures?.museumWall || undefined}
            color={museumGalleryTex ? '#ffffff' : '#f1f5f9'}
          />
        </mesh>
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, 2.45, 0.05]}>
          <boxGeometry args={[24.2, 0.12, 0.08]} />
          <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* East Gallery Wall (X = 12) */}
      <group position={[12, 2.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="museum-photo-east"
            map={museumHallTex || museumGalleryTex || undefined}
            color={museumHallTex || museumGalleryTex ? '#ffffff' : '#f1f5f9'}
          />
        </mesh>
        <mesh position={[0, -2.55, 0.05]}>
          <boxGeometry args={[24.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, 2.45, 0.05]}>
          <boxGeometry args={[24.2, 0.12, 0.08]} />
          <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Architectural Fluted Pilasters between picture bays */}
      {[-6, 6].map((x) => (
        <group key={`pilaster-north-${x}`} position={[x, 2.7, -11.92]}>
          <mesh>
            <boxGeometry args={[0.3, 5.4, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.04, 5.4, 0.02]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ================= COFFERED CEILING & GALLERY TRACK LIGHTING ================= */}
      <group position={[0, 5.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {[-8, 0, 8].map((x) => (
          <mesh key={`baffle-${x}`} position={[x, -0.15, 0]}>
            <boxGeometry args={[0.2, 0.3, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        ))}

        {[-8.5, 8.5].map((z) => (
          <group key={`track-z-${z}`} position={[0, -0.1, z]}>
            <mesh>
              <boxGeometry args={[20, 0.06, 0.06]} />
              <meshStandardMaterial color="#18181b" metalness={0.9} />
            </mesh>
            {[-6, -2, 2, 6].map((sx) => (
              <group key={`spot-${sx}`} position={[sx, -0.15, 0]}>
                <mesh rotation={[0.4, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.12, 0.22, 12]} />
                  <meshStandardMaterial color="#27272a" metalness={0.8} />
                </mesh>
                <pointLight color="#fffbeb" intensity={1.2} distance={6} />
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* ================= WEST PANORAMIC OBSERVATION WINDOW ================= */}
      <group position={[-12, 2.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[24, 5.4]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.9}
            transparent
            opacity={0.25}
            roughness={0.1}
          />
        </mesh>
        {[-8, -4, 0, 4, 8].map((wx) => (
          <mesh key={`mullion-${wx}`} position={[wx, 0, 0.02]}>
            <boxGeometry args={[0.1, 5.4, 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Grand Architectural Museum Hall Vista outside window */}
      <group position={[-24, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[60, 24]} />
          <meshBasicMaterial
            map={museumHallTex || undefined}
            color={museumHallTex ? '#ffffff' : '#0c4a6e'}
          />
        </mesh>
      </group>

      {/* ================= MINIMALIST GALLERY BENCH ================= */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[4.2, 0.12, 1.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[4.0, 0.14, 1.25]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {[-1.8, 1.8].map((lx) => (
          <mesh key={`leg-${lx}`} position={[lx, 0.17, 0]}>
            <boxGeometry args={[0.08, 0.34, 1.1]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ================= MARBLE SCULPTURE PEDESTAL ================= */}
      <group position={[8.5, 0, -8.5]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.86, 0.1, 0.86]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.6, 0]} rotation={[0.4, 0.6, 0.2]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
