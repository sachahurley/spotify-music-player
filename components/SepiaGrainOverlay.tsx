'use client';

import { useEffect, useRef } from 'react';

/**
 * Sepia Grain Overlay Component
 * 
 * Creates a slow, atmospheric film grain effect with a sepia/brown tint.
 * Now with smooth cross-fading between frames for a more professional feel.
 */
interface SepiaGrainOverlayProps {
  loopDuration?: number;
  autoStart?: boolean;
  opacity?: number;
}

class PerlinNoise {
  private perm: number[];
  private gradP: number[];

  constructor(seed: number = 0) {
    const p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
      247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
      57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
      74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
      60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
      65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
      200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
      52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
      207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
      119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
      129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
      218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];

    this.perm = new Array(512);
    this.gradP = new Array(512);
    
    for (let i = 0; i < 256; i++) {
      const idx = (i + seed) % 256;
      this.perm[i] = this.perm[i + 256] = p[idx];
      this.gradP[i] = this.gradP[i + 256] = (p[idx] % 12) * (1 / 11);
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const u = this.fade(fx);
    const v = this.fade(fy);
    const A = this.perm[X] + Y;
    const AA = this.perm[A] & 7;
    const AB = this.perm[A + 1] & 7;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] & 7;
    const BB = this.perm[B + 1] & 7;
    const grad2 = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];
    const dot = (g: number[], x: number, y: number) => g[0] * x + g[1] * y;
    const n00 = dot(grad2[AA], fx, fy);
    const n10 = dot(grad2[BA], fx - 1, fy);
    const n01 = dot(grad2[AB], fx, fy - 1);
    const n11 = dot(grad2[BB], fx - 1, fy - 1);
    const nx0 = this.lerp(n00, n10, u);
    const nx1 = this.lerp(n01, n11, u);
    return this.lerp(nx0, nx1, v);
  }
}

export default function SepiaGrainOverlay({ 
  loopDuration = 7.5,
  autoStart = true,
  opacity = 0.4
}: SepiaGrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const perlinNoiseRef = useRef<PerlinNoise | null>(null);
  const offscreenCanvasesRef = useRef<HTMLCanvasElement[]>([]);

  // Sepia tint color: Soft reddish-brown
  const sepiaColor = { r: 112, g: 66, b: 20 };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !autoStart) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    perlinNoiseRef.current = new PerlinNoise(0);

    const grainSize = 0.3; // Slightly smaller grain
    const contrast = 1.2; // Much lower contrast to reduce luminance "jumps"
    const updateRate = 0.5; // Very slow: 1 change every 2 seconds
    const frameInterval = 1000 / updateRate;
    const numFrames = 10; 

    let currentFrame = 0;

    const animate = (currentTime: number) => {
      if (lastUpdateRef.current === 0) lastUpdateRef.current = currentTime;
      
      const elapsedSinceLastUpdate = currentTime - lastUpdateRef.current;
      const progress = Math.min(elapsedSinceLastUpdate / frameInterval, 1);

      if (offscreenCanvasesRef.current.length > 0) {
        const currentIdx = currentFrame;
        const nextIdx = (currentFrame + 1) % offscreenCanvasesRef.current.length;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // DRAW SMOOTH CROSS-FADE
        ctx.save();
        // Draw the current frame fading out
        ctx.globalAlpha = 1 - progress;
        ctx.drawImage(offscreenCanvasesRef.current[currentIdx], 0, 0, canvas.width, canvas.height);
        
        // Draw the next frame fading in
        ctx.globalAlpha = progress;
        ctx.drawImage(offscreenCanvasesRef.current[nextIdx], 0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        if (progress >= 1) {
          currentFrame = nextIdx;
          lastUpdateRef.current = currentTime;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const generateFrames = () => {
      const bufferWidth = 400;
      const bufferHeight = 400;
      if (!perlinNoiseRef.current) return;

      const newCanvases: HTMLCanvasElement[] = [];
      const noise = perlinNoiseRef.current;

      for (let f = 0; f < numFrames; f++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = bufferWidth;
        tempCanvas.height = bufferHeight;
        const tempCtx = tempCanvas.getContext('2d')!;
        
        const imageData = tempCtx.createImageData(bufferWidth, bufferHeight);
        const data = imageData.data;
        const offset = f * 15;

        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % bufferWidth;
          const y = Math.floor((i / 4) / bufferWidth);
          const noiseValue = noise.noise2D((x * grainSize) + offset, (y * grainSize) + offset);
          
          const normalized = (noiseValue + 1) * 0.5;
          const intensity = Math.pow(normalized, 1 / contrast);
          
          data[i] = sepiaColor.r;
          data[i+1] = sepiaColor.g;
          data[i+2] = sepiaColor.b;
          data[i+3] = Math.floor(intensity * 255);
        }
        tempCtx.putImageData(imageData, 0, 0);
        newCanvases.push(tempCanvas);
      }
      offscreenCanvasesRef.current = newCanvases;
      
      if (autoStart && animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.min(rect.width || window.innerWidth, 1000);
      canvas.height = Math.min(rect.height || window.innerHeight, 1000);
      if (perlinNoiseRef.current && offscreenCanvasesRef.current.length === 0) {
        generateFrames();
      }
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [loopDuration, autoStart]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 5,
        mixBlendMode: 'soft-light', // Soft-light is much gentler than multiply
        opacity: opacity,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
