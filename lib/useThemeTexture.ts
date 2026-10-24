'use client';

import { useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Loads a texture from a local or remote URL with sRGB color space and smooth filtering.
 */
export function useThemeTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      url,
      (tex) => {
        if (!isMounted) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load theme texture ${url}:`, err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}
