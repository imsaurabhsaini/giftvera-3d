'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Avatar } from './Avatar';
import { PlayerState } from '@/lib/types';

interface CompanionBotProps {
  name: string;
  color?: string;
  onEmote?: (type: 'heart' | 'confetti' | 'sparkles', position: [number, number, number]) => void;
}

// Waypoints around the gallery in front of paintings
const WAYPOINTS: [number, number, number][] = [
  [-6, 0, -8.5],
  [0, 0, -8.5],
  [6, 0, -8.5],
  [8.5, 0, -3],
  [8.5, 0, 3],
  [6, 0, 8.5],
  [0, 0, 8.5],
  [-6, 0, 8.5],
];

export const CompanionBot: React.FC<CompanionBotProps> = ({
  name,
  color = '#38bdf8',
  onEmote,
}) => {
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [state, setState] = useState<'walking' | 'looking'>('walking');
  const pos = useRef(new THREE.Vector3(-6, 0, -8.5));
  const yaw = useRef(0);
  const lookTimer = useRef(0);

  const [playerState, setPlayerState] = useState<PlayerState>({
    id: 'companion_bot',
    name: `${name} (Guide)`,
    color,
    position: [-6, 0, -8.5],
    rotation: [0, 0, 0],
    action: 'walking',
    lastUpdated: Date.now(),
  });

  useFrame((_, delta) => {
    const target = WAYPOINTS[waypointIdx];
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);

    if (state === 'walking') {
      const dist = pos.current.distanceTo(targetVec);

      if (dist < 0.3) {
        // Reached painting waypoint: stop and look at artwork
        setState('looking');
        lookTimer.current = 4.0; // Admire for 4 seconds

        // Random chance to drop a heart or sparkles
        if (onEmote && Math.random() > 0.4) {
          onEmote(Math.random() > 0.5 ? 'heart' : 'sparkles', [
            pos.current.x,
            pos.current.y,
            pos.current.z,
          ]);
        }
      } else {
        // Move towards target
        const dir = targetVec.clone().sub(pos.current).normalize();
        pos.current.add(dir.multiplyScalar(2.2 * delta));

        // Face movement direction
        yaw.current = Math.atan2(dir.x, dir.z);

        setPlayerState({
          id: 'companion_bot',
          name: `${name} (Guide)`,
          color,
          position: [pos.current.x, pos.current.y, pos.current.z],
          rotation: [0, yaw.current, 0],
          action: 'walking',
          lastUpdated: Date.now(),
        });
      }
    } else {
      // In 'looking' state
      lookTimer.current -= delta;
      if (lookTimer.current <= 0) {
        // Go to next waypoint
        setWaypointIdx((prev) => (prev + 1) % WAYPOINTS.length);
        setState('walking');
      } else {
        setPlayerState((prev) => ({
          ...prev,
          action: 'idle',
          lastUpdated: Date.now(),
        }));
      }
    }
  });

  return <Avatar player={playerState} />;
};
