import * as THREE from 'three';

// 1. French Oak Chevron / Herringbone Parquet for Museum Floor
export function createMuseumParquetTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.Texture() as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm rich oak base
  ctx.fillStyle = '#45220f';
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw herringbone / parquet wood planks
  const plankW = 128;
  const plankH = 32;

  for (let y = 0; y < 1024; y += plankH) {
    const row = Math.floor(y / plankH);
    for (let x = 0; x < 1024; x += plankW) {
      const isShifted = (row % 2 === 0);
      const px = isShifted ? x : x - plankW / 2;

      // Subtle oak hue variation per plank
      const lightness = 22 + ((x * 13 + y * 19) % 14);
      const hue = 26 + ((x * 7 + y * 11) % 8);
      ctx.fillStyle = `hsl(${hue}, 48%, ${lightness}%)`;
      ctx.fillRect(px + 2, y + 2, plankW - 4, plankH - 4);

      // Subtle wood grain lines
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.25)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 3; g++) {
        const gy = y + 4 + g * 8;
        ctx.beginPath();
        ctx.moveTo(px, gy);
        ctx.lineTo(px + plankW, gy + (Math.sin(g + x) * 2));
        ctx.stroke();
      }

      // Plank border shadow
      ctx.strokeStyle = '#230f06';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, y + 1, plankW - 2, plankH - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

// 2. High-Definition Weathered Industrial Brick Texture for Loft Walls
export function createBrickTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.Texture() as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Textured Cement Mortar Background
  ctx.fillStyle = '#3a3836';
  ctx.fillRect(0, 0, 1024, 1024);

  // Add mortar sand specks
  for (let i = 0; i < 4000; i++) {
    const mx = Math.random() * 1024;
    const my = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(200, 195, 185, 0.15)' : 'rgba(20, 20, 20, 0.2)';
    ctx.fillRect(mx, my, 2, 2);
  }

  const brickW = 128;
  const brickH = 48;
  const mortar = 8;

  let row = 0;
  for (let y = 0; y < 1024; y += brickH + mortar) {
    const offsetX = (row % 2 === 0) ? 0 : -(brickW + mortar) / 2;
    for (let x = offsetX; x < 1024 + brickW; x += brickW + mortar) {
      // Natural weathered terracotta, red, umber, and charcoal brick tones
      const seed = ((row * 37) + Math.floor(x / 100)) % 100;
      let hue = 14;
      let sat = 52;
      let light = 32;

      if (seed % 7 === 0) {
        // Deep burnt charcoal brick
        hue = 20;
        sat = 20;
        light = 22;
      } else if (seed % 5 === 0) {
        // Rich warm amber terracotta
        hue = 22;
        sat = 62;
        light = 38;
      } else {
        // Classic red brick
        hue = 10 + (seed % 8);
        sat = 48 + (seed % 15);
        light = 28 + (seed % 10);
      }

      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
      ctx.fillRect(x, y, brickW, brickH);

      // Distressed brick surface highlights and shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x, y + brickH - 4, brickW, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x, y, brickW, 3);

      // Micro weathering spots
      for (let s = 0; s < 4; s++) {
        const sx = x + 10 + (s * 25);
        const sy = y + 8 + ((s * 13) % (brickH - 16));
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(sx, sy, 12, 4);
      }
    }
    row++;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 4);
  return texture;
}

// 3. Elegant Vertical Fluted Wall Texture for Modernist Museum
export function createMuseumWallTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.Texture() as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Smooth warm archival museum plaster
  ctx.fillStyle = '#f1f3f7';
  ctx.fillRect(0, 0, 1024, 1024);

  // Vertical Architectural Paneling & Slat Fluting
  const panelW = 64;
  for (let x = 0; x < 1024; x += panelW) {
    // Left shadow of flute groove
    ctx.fillStyle = 'rgba(100, 116, 139, 0.18)';
    ctx.fillRect(x, 0, 4, 1024);

    // Deep center groove line
    ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.fillRect(x + 4, 0, 3, 1024);

    // Right highlight edge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(x + 7, 0, 3, 1024);

    // Architectural brass/bronze trim strip every 4 panels
    if (x % (panelW * 4) === 0) {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.45)';
      ctx.fillRect(x + panelW - 3, 0, 6, 1024);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
      ctx.fillRect(x + panelW - 1, 0, 2, 1024);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2);
  return texture;
}

// 4. Tropical Teak Louver / Slat Screen Texture for Sunset Pavilion
export function createTropicalTeakTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.Texture() as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Rich warm golden honey teak base
  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, 1024, 1024);

  // Horizontal Teak Timber Slats with warm ambient glow
  const slatH = 40;
  const gap = 8;

  for (let y = 0; y < 1024; y += slatH + gap) {
    // Slat wood body with golden amber gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + slatH);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 1024, slatH);

    // Wood grain lines
    ctx.strokeStyle = 'rgba(67, 20, 7, 0.3)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 4; g++) {
      const gy = y + 6 + g * 8;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(1024, gy + Math.sin(g * 2) * 3);
      ctx.stroke();
    }

    // Top bevel highlight catching sunset light
    ctx.fillStyle = 'rgba(254, 215, 170, 0.5)';
    ctx.fillRect(0, y, 1024, 3);

    // Bottom drop shadow
    ctx.fillStyle = 'rgba(41, 10, 4, 0.6)';
    ctx.fillRect(0, y + slatH, 1024, gap);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 4);
  return texture;
}

// 5. Nautical Teak Boardwalk / Deck Texture
export function createOceanDeckTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.Texture() as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep nautical teak base
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Deck Planks with black marine pitch caulking
  const plankH = 32;
  const caulk = 4;

  for (let y = 0; y < 1024; y += plankH + caulk) {
    const tone = 28 + (Math.floor(y / 36) % 4) * 3;
    ctx.fillStyle = `hsl(28, 65%, ${tone}%)`;
    ctx.fillRect(0, y, 1024, plankH);

    // Black caulking seam
    ctx.fillStyle = '#1c0c04';
    ctx.fillRect(0, y + plankH, 1024, caulk);

    // Subtle grain
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + 12);
    ctx.lineTo(1024, y + 14);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}
