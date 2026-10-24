'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EmoteEvent } from '@/lib/types';

interface EmoteParticlesProps {
  emotes: EmoteEvent[];
}

export const EmoteParticles: React.FC<EmoteParticlesProps> = ({ emotes }) => {
  return (
    <group>
      {emotes.map((e) => (
        <SingleEmoteBurst key={`${e.playerId}-${e.timestamp}`} event={e} />
      ))}
    </group>
  );
};

const SingleEmoteBurst: React.FC<{ event: EmoteEvent }> = ({ event }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 14;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map(() => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        Math.random() * 2.2 + 1.2,
        (Math.random() - 0.5) * 1.5
      ),
      scale: Math.random() * 0.12 + 0.08,
      color:
        event.type === 'heart'
          ? '#f43f5e'
          : event.type === 'confetti'
          ? ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'][Math.floor(Math.random() * 4)]
          : '#fbbf24',
    }));
  }, [event.type]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const elapsed = (Date.now() - event.timestamp) / 1000;

    // Rise and fade out over 2.5 seconds
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      if (child && p) {
        child.position.x += p.velocity.x * delta;
        child.position.y += p.velocity.y * delta;
        child.position.z += p.velocity.z * delta;
        p.velocity.y -= delta * 2.5; // Gravity pull

        const scaleMultiplier = Math.max(0, 1 - elapsed / 2.2);
        child.scale.setScalar(p.scale * scaleMultiplier);
      }
    });
  });

  return (
    <group ref={groupRef} position={[event.position[0], event.position[1] + 1.8, event.position[2]]}>
      {particles.map((p, idx) => (
        <mesh key={idx}>
          {event.type === 'heart' ? (
            <sphereGeometry args={[0.09, 8, 8]} />
          ) : (
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          )}
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};
