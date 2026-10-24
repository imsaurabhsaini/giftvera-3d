'use client';

import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export interface GirlAvatarRefs {
  group: THREE.Group | null;
  bodyRoot: THREE.Group | null;
  head: THREE.Group | null;
  leftArm: THREE.Group | null;
  rightArm: THREE.Group | null;
  leftLeg: THREE.Group | null;
  rightLeg: THREE.Group | null;
}

interface GirlAvatarProps {
  name?: string;
  pinkColor?: string;
}

export const GirlAvatar = forwardRef<GirlAvatarRefs, GirlAvatarProps>(
  ({ name = 'You', pinkColor = '#f472b6' }, ref) => {
    const groupRef = React.useRef<THREE.Group>(null);
    const bodyRootRef = React.useRef<THREE.Group>(null);
    const headRef = React.useRef<THREE.Group>(null);
    const leftArmRef = React.useRef<THREE.Group>(null);
    const rightArmRef = React.useRef<THREE.Group>(null);
    const leftLegRef = React.useRef<THREE.Group>(null);
    const rightLegRef = React.useRef<THREE.Group>(null);

    React.useImperativeHandle(ref, () => ({
      get group() {
        return groupRef.current;
      },
      get bodyRoot() {
        return bodyRootRef.current;
      },
      get head() {
        return headRef.current;
      },
      get leftArm() {
        return leftArmRef.current;
      },
      get rightArm() {
        return rightArmRef.current;
      },
      get leftLeg() {
        return leftLegRef.current;
      },
      get rightLeg() {
        return rightLegRef.current;
      },
    }));

    // ALL-PINK AESTHETIC PALETTE
    const skinTone = '#ffedd5'; // Fair warm skin tone
    const hairPink = '#f472b6'; // Vibrant strawberry-pastel pink hair
    const hairCrownPink = '#ec4899'; // Deep pink hair top
    const ribbonPink = '#be185d'; // Deep hot pink hair ribbons
    const skirtPink = '#db2777'; // Pretty pleated pink skirt
    const shoePink = '#f472b6'; // Pink sneakers
    const whiteAccent = '#ffffff';

    return (
      <group ref={groupRef}>
        {/* Floating Name Tag */}
        <group position={[0, 2.25, 0]}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1.2, 0.28]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.7} />
          </mesh>
          <Text
            fontSize={0.13}
            color="#fbcfe8"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            {name}
          </Text>
        </group>

        {/* Soft Pink Emissive Ground Shadow */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.42, 32]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
        </mesh>

        {/* Body Root for Step-Bobbing */}
        <group ref={bodyRootRef}>
          {/* ================= 1. HEAD & CUTE GIRL FACE ================= */}
          <group ref={headRef} position={[0, 1.46, 0]}>
            {/* Head Base */}
            <mesh castShadow>
              <sphereGeometry args={[0.23, 24, 24]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>

            {/* Pink Hair Cap & Crown */}
            <mesh position={[0, 0.07, -0.03]}>
              <sphereGeometry args={[0.242, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
              <meshStandardMaterial color={hairPink} roughness={0.7} />
            </mesh>

            {/* Pink Hair Crown Top */}
            <mesh position={[0, 0.16, -0.05]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={hairCrownPink} roughness={0.7} />
            </mesh>

            {/* Cute Pink Front Bangs */}
            <mesh position={[0, 0.16, 0.16]} rotation={[0.42, 0, 0]}>
              <boxGeometry args={[0.24, 0.08, 0.09]} />
              <meshStandardMaterial color={hairPink} roughness={0.7} />
            </mesh>

            {/* Side Hair Tendrils Framing the Face */}
            <mesh position={[-0.22, -0.02, 0.06]} rotation={[0, 0, 0.15]}>
              <capsuleGeometry args={[0.045, 0.26, 8, 12]} />
              <meshStandardMaterial color={hairPink} roughness={0.7} />
            </mesh>
            <mesh position={[0.22, -0.02, 0.06]} rotation={[0, 0, -0.15]}>
              <capsuleGeometry args={[0.045, 0.26, 8, 12]} />
              <meshStandardMaterial color={hairPink} roughness={0.7} />
            </mesh>

            {/* Twin Pigtails with Hot Pink Ribbon Ties */}
            {/* Left Ponytail */}
            <group position={[-0.24, 0.12, -0.12]} rotation={[0.2, 0.3, 0.5]}>
              <mesh>
                <torusGeometry args={[0.05, 0.022, 8, 16]} />
                <meshStandardMaterial color={ribbonPink} />
              </mesh>
              <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.065, 0.35, 8, 14]} />
                <meshStandardMaterial color={hairPink} roughness={0.7} />
              </mesh>
            </group>

            {/* Right Ponytail */}
            <group position={[0.24, 0.12, -0.12]} rotation={[0.2, -0.3, -0.5]}>
              <mesh>
                <torusGeometry args={[0.05, 0.022, 8, 16]} />
                <meshStandardMaterial color={ribbonPink} />
              </mesh>
              <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.065, 0.35, 8, 14]} />
                <meshStandardMaterial color={hairPink} roughness={0.7} />
              </mesh>
            </group>

            {/* Left Eye with Eyelashes & Shine */}
            <group position={[-0.085, 0.02, 0.2]}>
              <mesh position={[0, 0, -0.005]}>
                <sphereGeometry args={[0.042, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.038, 16, 16]} />
                <meshBasicMaterial color="#6b21a8" />
              </mesh>
              <mesh position={[-0.012, 0.016, 0.024]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.01, -0.012, 0.024]}>
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.04, 0.01]}>
                <boxGeometry args={[0.08, 0.01, 0.01]} />
                <meshBasicMaterial color="#1e1b18" />
              </mesh>
            </group>

            {/* Right Eye with Eyelashes & Shine */}
            <group position={[0.085, 0.02, 0.2]}>
              <mesh position={[0, 0, -0.005]}>
                <sphereGeometry args={[0.042, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.038, 16, 16]} />
                <meshBasicMaterial color="#6b21a8" />
              </mesh>
              <mesh position={[-0.012, 0.016, 0.024]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.01, -0.012, 0.024]}>
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.04, 0.01]}>
                <boxGeometry args={[0.08, 0.01, 0.01]} />
                <meshBasicMaterial color="#1e1b18" />
              </mesh>
            </group>

            {/* Cute Rosy Blush Cheeks */}
            <mesh position={[-0.13, -0.04, 0.17]} rotation={[0, -0.4, 0]}>
              <circleGeometry args={[0.035, 16]} />
              <meshBasicMaterial color="#f472b6" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.13, -0.04, 0.17]} rotation={[0, 0.4, 0]}>
              <circleGeometry args={[0.035, 16]} />
              <meshBasicMaterial color="#f472b6" transparent opacity={0.7} />
            </mesh>

            {/* Cheerful Smile */}
            <mesh position={[0, -0.075, 0.21]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.032, 0.008, 8, 16, Math.PI]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
          </group>

          {/* ================= 2. TORSO & PINK OUTFIT ================= */}
          <group position={[0, 0.98, 0]}>
            {/* Cute Pink Hoodie/Jacket */}
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.23, 0.52, 16]} />
              <meshStandardMaterial color={pinkColor} roughness={0.4} />
            </mesh>

            {/* White Collar Ring */}
            <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.04, 12, 24]} />
              <meshStandardMaterial color={whiteAccent} roughness={0.5} />
            </mesh>

            {/* Front White Drawstrings / Zipper */}
            <mesh position={[0, 0, 0.215]}>
              <planeGeometry args={[0.02, 0.45]} />
              <meshBasicMaterial color={whiteAccent} />
            </mesh>

            {/* Pink Pleated Skirt */}
            <mesh position={[0, -0.28, 0]}>
              <cylinderGeometry args={[0.24, 0.29, 0.18, 18]} />
              <meshStandardMaterial color={skirtPink} roughness={0.6} />
            </mesh>
          </group>

          {/* ================= 3. ARMS & HANDS ================= */}
          {/* Left Arm (Shoulder Joint at Y = 1.16, X = -0.27) */}
          <group ref={leftArmRef} position={[-0.27, 1.16, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.055, 0.32, 12]} />
              <meshStandardMaterial color={pinkColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.34, 0]} castShadow>
              <sphereGeometry args={[0.062, 14, 14]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>
          </group>

          {/* Right Arm (Shoulder Joint at Y = 1.16, X = 0.27) */}
          <group ref={rightArmRef} position={[0.27, 1.16, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.055, 0.32, 12]} />
              <meshStandardMaterial color={pinkColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.34, 0]} castShadow>
              <sphereGeometry args={[0.062, 14, 14]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>
          </group>

          {/* ================= 4. LEGS & PINK SNEAKERS ================= */}
          {/* Left Leg (Hip Joint at Y = 0.68, X = -0.11) */}
          <group ref={leftLegRef} position={[-0.11, 0.68, 0]}>
            <mesh position={[0, -0.26, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.06, 0.46, 12]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>
            {/* White Ankle Sock */}
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[0.068, 0.068, 0.16, 12]} />
              <meshStandardMaterial color={whiteAccent} roughness={0.7} />
            </mesh>
            {/* Pink & White Sneaker */}
            <mesh position={[0, -0.52, 0.04]} castShadow>
              <boxGeometry args={[0.12, 0.1, 0.21]} />
              <meshStandardMaterial color={shoePink} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.56, 0.04]}>
              <boxGeometry args={[0.124, 0.02, 0.214]} />
              <meshStandardMaterial color={whiteAccent} />
            </mesh>
          </group>

          {/* Right Leg (Hip Joint at Y = 0.68, X = 0.11) */}
          <group ref={rightLegRef} position={[0.11, 0.68, 0]}>
            <mesh position={[0, -0.26, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.06, 0.46, 12]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>
            {/* White Ankle Sock */}
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[0.068, 0.068, 0.16, 12]} />
              <meshStandardMaterial color={whiteAccent} roughness={0.7} />
            </mesh>
            {/* Pink & White Sneaker */}
            <mesh position={[0, -0.52, 0.04]} castShadow>
              <boxGeometry args={[0.12, 0.1, 0.21]} />
              <meshStandardMaterial color={shoePink} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.56, 0.04]}>
              <boxGeometry args={[0.124, 0.02, 0.214]} />
              <meshStandardMaterial color={whiteAccent} />
            </mesh>
          </group>
        </group>
      </group>
    );
  }
);

GirlAvatar.displayName = 'GirlAvatar';
