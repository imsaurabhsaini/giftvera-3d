'use client';

import React from 'react';
import * as THREE from 'three';
import { useThemeTexture } from '@/lib/useThemeTexture';

interface ThemeTextures {
  sunsetDeck?: THREE.CanvasTexture | null;
  teakSlats?: THREE.CanvasTexture | null;
}

export const SunsetPavilion: React.FC<{ textures: ThemeTextures | null }> = ({ textures }) => {
  // Real high-resolution tropical beach & sunset photographic backdrop images
  const beachTex = useThemeTexture('/themes/sunset_beach.jpg');
  const oceanTex = useThemeTexture('/themes/sunset_ocean.jpg');
  const palmsTex = useThemeTexture('/themes/sunset_palms.jpg');

  return (
    <group>
      {/* ================= SUNSET LIGHTING ================= */}
      <ambientLight intensity={0.9} color="#fed7aa" />
      <directionalLight
        position={[-16, 5, 2]}
        intensity={2.6}
        color="#f97316"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight color="#fbbf24" groundColor="#c2410c" intensity={0.7} />

      {/* ================= OVERWATER TEAK BOARDWALK DECK ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          key="sunset-deck-mat"
          map={textures?.sunsetDeck || undefined}
          color="#d97706"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Ocean Water surrounding deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.12}
          metalness={0.85}
        />
      </mesh>

      {/* ================= OPEN NAUTICAL DECK RAILINGS ================= */}
      {[-12.8, 12.8].map((z) => (
        <group key={`rail-z-${z}`}>
          <mesh position={[0, 1.05, z]}>
            <boxGeometry args={[25.6, 0.12, 0.18]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, z]}>
            <boxGeometry args={[25.6, 0.08, 0.1]} />
            <meshStandardMaterial color="#451a03" roughness={0.5} />
          </mesh>
          {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
            <mesh key={`post-${x}-${z}`} position={[x, 0.55, z]}>
              <boxGeometry args={[0.12, 0.95, 0.12]} />
              <meshStandardMaterial color="#78350f" roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {[-12.8, 12.8].map((x) => (
        <group key={`rail-x-${x}`}>
          <mesh position={[x, 1.05, 0]}>
            <boxGeometry args={[0.18, 0.12, 25.6]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
          <mesh position={[x, 0.2, 0]}>
            <boxGeometry args={[0.1, 0.08, 25.6]} />
            <meshStandardMaterial color="#451a03" roughness={0.5} />
          </mesh>
          {[-10, -5, 0, 5, 10].map((z) => (
            <mesh key={`post-side-${x}-${z}`} position={[x, 0.55, z]}>
              <boxGeometry args={[0.12, 0.95, 0.12]} />
              <meshStandardMaterial color="#78350f" roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= REAL TROPICAL BEACH & SUNSET SCENIC WALL PANORAMAS ================= */}
      {/* North Wall: Breathtaking Tropical Beach & Turquoise Waters */}
      <group position={[0, 2.7, -12]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="sunset-beach-north"
            map={beachTex || undefined}
            color={beachTex ? '#ffffff' : '#d97706'}
          />
        </mesh>
        {/* Architectural Teak Framing */}
        <mesh position={[0, 2.7, 0.05]}>
          <boxGeometry args={[24.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[0, -2.6, 0.05]}>
          <boxGeometry args={[24.2, 0.25, 0.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
      </group>

      {/* South Wall: Ocean Sunset Waves & Golden Shoreline */}
      <group position={[0, 2.7, 12]} rotation={[0, Math.PI, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="sunset-ocean-south"
            map={oceanTex || beachTex || undefined}
            color={oceanTex || beachTex ? '#ffffff' : '#d97706'}
          />
        </mesh>
        <mesh position={[0, 2.7, 0.05]}>
          <boxGeometry args={[24.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[0, -2.6, 0.05]}>
          <boxGeometry args={[24.2, 0.25, 0.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
      </group>

      {/* East Wall: Tropical Palm Trees Arching over Sunset Horizon */}
      <group position={[12, 2.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[24, 5.4]} />
          <meshBasicMaterial
            key="sunset-palms-east"
            map={palmsTex || beachTex || undefined}
            color={palmsTex || beachTex ? '#ffffff' : '#d97706'}
          />
        </mesh>
        <mesh position={[0, 2.7, 0.05]}>
          <boxGeometry args={[24.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[0, -2.6, 0.05]}>
          <boxGeometry args={[24.2, 0.25, 0.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
      </group>

      {/* ================= HEAVY TIMBER PAVILION POSTS ================= */}
      {[-12, 12].map((x) =>
        [-12, 0, 12].map((z) => (
          <mesh key={`timber-col-${x}-${z}`} position={[x, 2.7, z]}>
            <boxGeometry args={[0.45, 5.4, 0.45]} />
            <meshStandardMaterial color="#5c2409" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* ================= OPEN PERGOLA CEILING & LANTERNS ================= */}
      <group position={[0, 5.4, 0]}>
        {/* Main Timber Girders */}
        {[-9, -4.5, 0, 4.5, 9].map((x) => (
          <mesh key={`girder-${x}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 25.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
        ))}
        {/* Cross Bamboo Rafters */}
        {[-10, -6, -2, 2, 6, 10].map((z) => (
          <mesh key={`rafter-${z}`} position={[0, 0.25, z]}>
            <boxGeometry args={[25.5, 0.2, 0.2]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
        ))}

        {/* Glowing Woven Rattan Lanterns */}
        {[
          [-6, -1.2, -6],
          [6, -1.2, -6],
          [-6, -1.2, 6],
          [6, -1.2, 6],
          [0, -1.4, 0],
        ].map(([lx, ly, lz], idx) => (
          <group key={`lantern-${idx}`} position={[lx, ly, lz]}>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.6]} />
              <meshBasicMaterial color="#1c0f07" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.6}
                roughness={0.7}
              />
            </mesh>
            <pointLight color="#fbbf24" intensity={2.2} distance={8} decay={2} />
          </group>
        ))}
      </group>

      {/* ================= TROPICAL PALM TREES AT CORNERS ================= */}
      {[
        [-11.2, 0, -11.2],
        [11.2, 0, -11.2],
        [11.2, 0, 11.2],
        [-11.2, 0, 11.2],
      ].map(([px, py, pz], idx) => (
        <group key={`palm-${idx}`} position={[px, py, pz]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.45, 0.35, 0.8, 16]} />
            <meshStandardMaterial color="#c2410c" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0.08 * (idx % 2 === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.14, 0.18, 2.2, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <group position={[0, 3.0, 0]}>
            {[0, 1, 2, 3, 4, 5].map((angleIdx) => {
              const ang = (angleIdx * Math.PI) / 3;
              return (
                <mesh
                  key={`frond-${angleIdx}`}
                  position={[Math.cos(ang) * 0.7, 0.1, Math.sin(ang) * 0.7]}
                  rotation={[0.3, ang, 0.4]}
                >
                  <boxGeometry args={[1.4, 0.05, 0.35]} />
                  <meshStandardMaterial color="#15803d" roughness={0.5} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* ================= OUTDOOR SUNSET VISTA (WEST) ================= */}
      <group position={[-28, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[70, 32]} />
          <meshBasicMaterial color="#c2410c" />
        </mesh>
        <mesh position={[0, 0, -1]}>
          <circleGeometry args={[9, 32]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0, -2, 0.5]}>
          <planeGeometry args={[70, 8]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        <mesh position={[0, -7, 1]}>
          <planeGeometry args={[70, 5]} />
          <meshBasicMaterial color="#7c2d12" />
        </mesh>
      </group>

      {/* ================= CENTRAL RESORT DAYBED ================= */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[3.8, 0.4, 1.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3.6, 0.2, 1.6]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        <mesh position={[-1.2, 0.7, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.5, 0.25, 0.5]} />
          <meshStandardMaterial color="#f97316" roughness={0.6} />
        </mesh>
        <mesh position={[1.2, 0.7, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.5, 0.25, 0.5]} />
          <meshStandardMaterial color="#fb923c" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
