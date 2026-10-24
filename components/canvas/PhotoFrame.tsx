'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PhotoItem } from '@/lib/types';

interface PhotoFrameProps {
  photo: PhotoItem;
  position: [number, number, number];
  rotation: [number, number, number];
  onInspect: (photo: PhotoItem) => void;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  photo,
  position,
  rotation,
  onInspect,
}) => {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspectSize, setAspectSize] = useState<{
    photoWidth: number;
    photoHeight: number;
    frameWidth: number;
    frameHeight: number;
  }>({
    photoWidth: 2.0,
    photoHeight: 2.6,
    frameWidth: 2.4,
    frameHeight: 3.2,
  });

  const plaqueRef = useRef<THREE.Group>(null);

  // Safely load texture and preserve native aspect ratio
  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      photo.url,
      (tex) => {
        if (!isMounted) return;

        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = 8; // Optimal sharpness without GPU tile bugs
        tex.needsUpdate = true;
        setTexture(tex);

        // Calculate aspect ratio without stretching
        const img = tex.image;
        if (img && img.width && img.height) {
          const imgAspect = img.width / img.height;
          const maxDim = 2.6; // Max primary dimension

          let pw: number;
          let ph: number;

          if (imgAspect >= 1) {
            // Landscape orientation
            pw = Math.min(2.8, maxDim * imgAspect);
            ph = pw / imgAspect;
            if (ph > 2.6) {
              ph = 2.6;
              pw = ph * imgAspect;
            }
          } else {
            // Portrait orientation (standard phone photos)
            ph = 2.6;
            pw = ph * imgAspect;
            if (pw > 2.2) {
              pw = 2.2;
              ph = pw / imgAspect;
            }
          }

          // Frame dimensions with uniform elegant border
          const borderPadding = 0.36;
          setAspectSize({
            photoWidth: pw,
            photoHeight: ph,
            frameWidth: pw + borderPadding,
            frameHeight: ph + borderPadding + 0.15,
          });
        }
      },
      undefined,
      (err) => {
        console.warn(`Could not load image texture for "${photo.title}":`, err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [photo.url, photo.title]);

  useFrame((state) => {
    if (plaqueRef.current && hovered) {
      plaqueRef.current.position.z = 0.12 + Math.sin(state.clock.elapsedTime * 6) * 0.01;
    }
  });

  const { photoWidth, photoHeight, frameWidth, frameHeight } = aspectSize;

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onInspect(photo);
      }}
    >
      {/* Targeted Frame Spotlight */}
      <spotLight
        position={[0, 2.5, 1.4]}
        target-position={[0, 0, 0]}
        intensity={hovered ? 3.0 : 2.0}
        angle={0.7}
        penumbra={0.6}
        color="#fffbeb"
        distance={7}
      />

      {/* 1. Outer Wooden Moulding Frame (Recessed cleanly at z = -0.03) */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#d97706' : '#1c1917'}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Thin Brass Inset Trim (z = 0.005) */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[frameWidth - 0.06, frameHeight - 0.06]} />
        <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 3. Passe-partout Archival White Matting (z = 0.015) */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[frameWidth - 0.12, frameHeight - 0.12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>

      {/* 4. The Photograph Canvas (z = 0.035 with PolygonOffset to eliminate Z-fighting) */}
      <mesh position={[0, 0.04, 0.035]}>
        <planeGeometry args={[photoWidth, photoHeight]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-4}
            polygonOffsetUnits={-4}
          />
        ) : (
          <meshStandardMaterial color="#334155" roughness={0.8}>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.12}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
              maxWidth={photoWidth * 0.9}
            >
              {photo.title || 'Loading Memory...'}
            </Text>
          </meshStandardMaterial>
        )}
      </mesh>

      {/* 5. Floating Museum Plaque (positioned underneath the dynamic frame) */}
      <group
        ref={plaqueRef}
        position={[0, -frameHeight / 2 - 0.35, 0.05]}
      >
        {/* Metal Plate */}
        <mesh>
          <boxGeometry args={[Math.min(1.8, frameWidth * 0.8), 0.45, 0.02]} />
          <meshStandardMaterial
            color={hovered ? '#fef3c7' : '#e2e8f0'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Title & Date Text on Plaque */}
        <Text
          position={[0, 0.07, 0.02]}
          fontSize={0.075}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          maxWidth={frameWidth * 0.75}
        >
          {photo.title.toUpperCase()}
        </Text>

        <Text
          position={[0, -0.09, 0.02]}
          fontSize={0.055}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          {photo.date || 'Tap or click to view'}
        </Text>
      </group>
    </group>
  );
};
