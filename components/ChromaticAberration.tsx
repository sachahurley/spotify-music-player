'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

/**
 * Chromatic Aberration Component
 * 
 * Creates a cinematic RGB split effect by layering red, green, and blue 
 * versions of an image and subtly offsetting them over time.
 */
interface ChromaticAberrationProps {
  src: string;
  intensity?: number;
  loopDuration?: number;
  autoStart?: boolean;
  redOpacity?: number;
  blueOpacity?: number;
}

export default function ChromaticAberration({ 
  src, 
  intensity = 4, 
  loopDuration = 7.5,
  autoStart = true,
  redOpacity = 0.4,
  blueOpacity = 0.6
}: ChromaticAberrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const redLayerRef = useRef<HTMLDivElement>(null);
  const blueLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!redLayerRef.current || !blueLayerRef.current) return;

    // Create GSAP timeline for the "breathing" color split
    const tl = gsap.timeline({
      repeat: -1,
      paused: !autoStart,
    });

    // Animate Red and Blue layers in opposite directions
    // Red moves left, Blue moves right
    tl.to(redLayerRef.current, {
      x: -intensity,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, 0);

    tl.to(blueLayerRef.current, {
      x: intensity,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, 0);

    // Return to 0
    tl.to([redLayerRef.current, blueLayerRef.current], {
      x: 0,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, loopDuration / 2);

    return () => {
      tl.kill();
    };
  }, [intensity, loopDuration, autoStart]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {/* BASE LAYER (Green/Standard) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
        />
      </div>

      {/* RED LAYER (Screen blend) */}
      <div 
        ref={redLayerRef} 
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none z-10"
        style={{ opacity: redOpacity }}
      >
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
          style={{ filter: 'url(#red-filter)' }} 
        />
      </div>

      {/* BLUE LAYER (Screen blend) */}
      <div 
        ref={blueLayerRef} 
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none z-20"
        style={{ opacity: blueOpacity }}
      >
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
          style={{ filter: 'url(#blue-filter)' }} 
        />
      </div>

      {/* SVG Filters for RGB Extraction */}
      <svg className="hidden">
        <defs>
          <filter id="red-filter">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="blue-filter">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
