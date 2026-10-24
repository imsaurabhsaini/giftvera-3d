'use client';

import React, { useMemo } from 'react';
import { PhotoFrame } from './PhotoFrame';
import { Avatar } from './Avatar';
import { EmoteParticles } from './EmoteParticles';
import { PlayerController } from './PlayerController';
import { CompanionBot } from './CompanionBot';
import { SunsetPavilion } from './themes/SunsetPavilion';
import { IndustrialLoft } from './themes/IndustrialLoft';
import { ModernMuseum } from './themes/ModernMuseum';
import { PhotoItem, PlayerState, EmoteEvent, ThemeType } from '@/lib/types';
import {
  createMuseumParquetTexture,
  createBrickTexture,
  createMuseumWallTexture,
  createTropicalTeakTexture,
  createOceanDeckTexture,
} from '@/lib/proceduralTextures';

interface MuseumSceneProps {
  photos: PhotoItem[];
  peers: PlayerState[];
  emotes: EmoteEvent[];
  theme?: ThemeType;
  onSelectPhoto: (photo: PhotoItem) => void;
  onPlayerMove?: (
    pos: [number, number, number],
    rot: [number, number, number],
    action: 'idle' | 'walking' | 'jumping'
  ) => void;
  joystickInput?: { x: number; y: number };
  isTouchDevice?: boolean;
  cameraMode?: 'first-person' | 'third-person';
  onToggleCameraMode?: () => void;
  myColor?: string;
  myName?: string;
  showCompanion?: boolean;
  companionName?: string;
  onCompanionEmote?: (type: 'heart' | 'confetti' | 'sparkles', pos: [number, number, number]) => void;
}

export const MuseumScene: React.FC<MuseumSceneProps> = ({
  photos,
  peers,
  emotes,
  theme = 'museum',
  onSelectPhoto,
  onPlayerMove,
  joystickInput,
  isTouchDevice,
  cameraMode = 'third-person',
  onToggleCameraMode,
  myColor = '#f472b6',
  myName = 'You',
  showCompanion = true,
  companionName = 'Sophia',
  onCompanionEmote,
}) => {
  // Procedural Canvas Textures for realistic theme walls & floors (synchronously memoized)
  const textures = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return {
      museumFloor: createMuseumParquetTexture(),
      museumWall: createMuseumWallTexture(),
      loftFloor: createMuseumParquetTexture(),
      brickWall: createBrickTexture(),
      sunsetDeck: createOceanDeckTexture(),
      teakSlats: createTropicalTeakTexture(),
    };
  }, []);

  // Compute frame placements along walls
  const framePlacements = useMemo(() => {
    const placements: Array<{
      photo: PhotoItem;
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    const count = photos.length;
    const height = 2.4;

    photos.forEach((photo, index) => {
      if (index < 4) {
        // North Wall (Z = -11.6, facing South)
        const spacing = 5.2;
        const startX = -((Math.min(count, 4) - 1) * spacing) / 2;
        placements.push({
          photo,
          position: [startX + index * spacing, height, -11.6],
          rotation: [0, 0, 0],
        });
      } else if (index < 7) {
        // East Wall (X = 11.6, facing West)
        const eastIndex = index - 4;
        const spacing = 5.4;
        const startZ = -((Math.min(count - 4, 3) - 1) * spacing) / 2;
        placements.push({
          photo,
          position: [11.6, height, startZ + eastIndex * spacing],
          rotation: [0, -Math.PI / 2, 0],
        });
      } else {
        // South Wall (Z = 11.6, facing North)
        const southIndex = index - 7;
        const spacing = 5.2;
        const startX = -((Math.min(count - 7, 4) - 1) * spacing) / 2;
        placements.push({
          photo,
          position: [startX + southIndex * spacing, height, 11.6],
          rotation: [0, Math.PI, 0],
        });
      }
    });

    return placements;
  }, [photos]);

  return (
    <>
      {/* Player Controller */}
      <PlayerController
        onMove={onPlayerMove}
        joystickInput={joystickInput}
        isTouchDevice={isTouchDevice}
        cameraMode={cameraMode}
        onToggleCameraMode={onToggleCameraMode}
        myColor={myColor}
        myName={myName}
      />

      {/* ================= THEME ARCHITECTURAL ENVIRONMENT ================= */}
      {theme === 'sunset' && <SunsetPavilion textures={textures} />}
      {theme === 'loft' && <IndustrialLoft textures={textures} />}
      {theme === 'museum' && <ModernMuseum textures={textures} />}

      {/* ================= WALL-MOUNTED PHOTO FRAMES ================= */}
      {framePlacements.map(({ photo, position, rotation }) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          position={position}
          rotation={rotation}
          onInspect={onSelectPhoto}
        />
      ))}

      {/* ================= MULTIPLAYER PEER AVATARS ================= */}
      {peers.map((peer) => (
        <Avatar key={peer.id} player={peer} />
      ))}

      {/* ================= AI COMPANION BOT ================= */}
      {showCompanion && (
        <CompanionBot
          name={companionName}
          color="#38bdf8"
          onEmote={onCompanionEmote}
        />
      )}

      {/* ================= REAL-TIME EMOTE BURSTS ================= */}
      <EmoteParticles emotes={emotes} />
    </>
  );
};
