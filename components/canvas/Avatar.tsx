'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PlayerState } from '@/lib/types';

interface AvatarProps {
  player: PlayerState;
}

export const Avatar: React.FC<AvatarProps> = ({ player }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRootRef = useRef<THREE.Group>(null);

  // Target vectors for smooth interpolation
  const targetPos = useRef(new THREE.Vector3(...player.position));
  const targetYaw = useRef(player.rotation[1] || 0);

  targetPos.current.set(player.position[0], player.position[1], player.position[2]);
  targetYaw.current = player.rotation[1] || 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth Lerp Position & Yaw
    const lerpSpeed = player.id.startsWith('local') ? Math.min(1, delta * 25) : Math.min(1, delta * 12);
    groupRef.current.position.lerp(targetPos.current, lerpSpeed);

    let diff = targetYaw.current - groupRef.current.rotation.y;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    groupRef.current.rotation.y += diff * lerpSpeed;

    // Character Procedural Walking / Jumping Animations
    const time = Date.now() * 0.009;

    if (player.action === 'walking') {
      // Natural humanoid walk cycle: opposite arms and legs swing back and forth
      const swingAngle = Math.sin(time * 1.2) * 0.55;

      if (leftArmRef.current) leftArmRef.current.rotation.x = -swingAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swingAngle;

      if (leftLegRef.current) leftLegRef.current.rotation.x = swingAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swingAngle;

      // Realistic vertical step bobbing
      if (bodyRootRef.current) {
        bodyRootRef.current.position.y = Math.abs(Math.sin(time * 1.2)) * 0.08;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.6) * 0.06;
      }
    } else if (player.action === 'jumping') {
      // Jumping: Arms reach up high, legs tuck
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI * 0.65;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI * 0.65;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.35;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.35;
      if (bodyRootRef.current) bodyRootRef.current.position.y = 0.15;
    } else {
      // Idle: Gentle breathing motion
      const breath = Math.sin(time * 0.3) * 0.03;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breath;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breath;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRootRef.current) bodyRootRef.current.position.y = breath * 0.5;
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 0.2) * 0.04;
    }
  });

  const outfitColor = player.color || '#f43f5e';
  const skinColor = '#ffedd5'; // Warm natural skin tone
  const hairColor = '#292524'; // Espresso dark hair
  const pantsColor = '#1e293b'; // Denim slate pants
  const shoeColor = '#f8fafc'; // Clean white sneakers

  return (
    <group ref={groupRef} position={player.position}>
      {/* Floating Name Tag */}
      <group position={[0, 2.3, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.2, 0.28]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.7} />
        </mesh>
        <Text
          fontSize={0.13}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {player.name || 'Friend'}
        </Text>
      </group>

      {/* Ground Contact Shadow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.42, 32]} />
        <meshBasicMaterial color={outfitColor} transparent opacity={0.45} />
      </mesh>

      {/* Main Body Root for Bobbing */}
      <group ref={bodyRootRef}>
        {/* ================= 1. HEAD & FACE ================= */}
        <group ref={headRef} position={[0, 1.48, 0]}>
          {/* Head Base */}
          <mesh castShadow>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>

          {/* Hair / Stylish Beanie Cap */}
          <mesh position={[0, 0.08, -0.02]}>
            <sphereGeometry args={[0.246, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>

          {/* Hair Fringe / Front Bangs */}
          <mesh position={[0, 0.17, 0.17]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.22, 0.08, 0.08]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>

          {/* Left Eye */}
          <group position={[-0.085, 0.02, 0.21]}>
            <mesh>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Eye Shine Highlight */}
            <mesh position={[-0.01, 0.015, 0.025]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.085, 0.02, 0.21]}>
            <mesh>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Eye Shine Highlight */}
            <mesh position={[-0.01, 0.015, 0.025]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Cheerful Smile */}
          <mesh position={[0, -0.075, 0.22]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
            <meshBasicMaterial color="#be123c" />
          </mesh>

          {/* Rosy Blush Cheeks */}
          <mesh position={[-0.14, -0.04, 0.18]} rotation={[0, -0.4, 0]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.14, -0.04, 0.18]} rotation={[0, 0.4, 0]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* ================= 2. TORSO & HOODIE ================= */}
        <group position={[0, 0.98, 0]}>
          {/* Main Torso Jacket */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.24, 0.54, 16]} />
            <meshStandardMaterial color={outfitColor} roughness={0.5} />
          </mesh>

          {/* Hoodie Collar Ring */}
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.045, 12, 24]} />
            <meshStandardMaterial color={outfitColor} roughness={0.4} />
          </mesh>

          {/* Front Jacket Zipper / Stripe */}
          <mesh position={[0, 0, 0.222]}>
            <planeGeometry args={[0.025, 0.48]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* ================= 3. ARMS & HANDS ================= */}
        {/* Left Arm (Shoulder Pivot at Y = 1.18, X = -0.29) */}
        <group ref={leftArmRef} position={[-0.29, 1.18, 0]}>
          {/* Upper Sleeve */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.06, 0.36, 12]} />
            <meshStandardMaterial color={outfitColor} roughness={0.5} />
          </mesh>
          {/* Left Hand */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <sphereGeometry args={[0.068, 14, 14]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm (Shoulder Pivot at Y = 1.18, X = 0.29) */}
        <group ref={rightArmRef} position={[0.29, 1.18, 0]}>
          {/* Upper Sleeve */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.06, 0.36, 12]} />
            <meshStandardMaterial color={outfitColor} roughness={0.5} />
          </mesh>
          {/* Right Hand */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <sphereGeometry args={[0.068, 14, 14]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* ================= 4. LEGS & SNEAKERS ================= */}
        {/* Left Leg (Hip Pivot at Y = 0.72, X = -0.12) */}
        <group ref={leftLegRef} position={[-0.12, 0.72, 0]}>
          {/* Pants Leg */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.07, 0.48, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} />
          </mesh>
          {/* Left Sneaker Shoe */}
          <mesh position={[0, -0.54, 0.04]} castShadow>
            <boxGeometry args={[0.13, 0.1, 0.22]} />
            <meshStandardMaterial color={shoeColor} roughness={0.3} />
          </mesh>
          {/* Sneaker Accent Stripe */}
          <mesh position={[0, -0.54, 0.155]}>
            <boxGeometry args={[0.132, 0.03, 0.01]} />
            <meshBasicMaterial color={outfitColor} />
          </mesh>
        </group>

        {/* Right Leg (Hip Pivot at Y = 0.72, X = 0.12) */}
        <group ref={rightLegRef} position={[0.12, 0.72, 0]}>
          {/* Pants Leg */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.07, 0.48, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} />
          </mesh>
          {/* Right Sneaker Shoe */}
          <mesh position={[0, -0.54, 0.04]} castShadow>
            <boxGeometry args={[0.13, 0.1, 0.22]} />
            <meshStandardMaterial color={shoeColor} roughness={0.3} />
          </mesh>
          {/* Sneaker Accent Stripe */}
          <mesh position={[0, -0.54, 0.155]}>
            <boxGeometry args={[0.132, 0.03, 0.01]} />
            <meshBasicMaterial color={outfitColor} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
