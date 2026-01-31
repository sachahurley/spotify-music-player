'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

/**
 * Natural Split Effect Component
 * 
 * Creates a "ghosting" or "double vision" effect by layering multiple 
 * copies of the same image without any color modification.
 * The layers subtly drift apart and back together.
 */
interface NaturalSplitEffectProps {
  src: string;
  intensity?: number;
  loopDuration?: number;
  autoStart?: boolean;
  ghostOpacity?: number;
}

export default function NaturalSplitEffect({ 
  src, 
  intensity = 8, 
  loopDuration = 7.5,
  autoStart = true,
  ghostOpacity = 0.25
}: NaturalSplitEffectProps) {
  const leftGhostRef = useRef<HTMLDivElement>(null);
  const rightGhostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftGhostRef.current || !rightGhostRef.current) return;

    // Create GSAP timeline for the "breathing" ghost split
    const tl = gsap.timeline({
      repeat: -1,
      paused: !autoStart,
    });

    // Animate ghost layers in opposite directions
    // One moves left, one moves right
    tl.to(leftGhostRef.current, {
      x: -intensity,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, 0);

    tl.to(rightGhostRef.current, {
      x: intensity,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, 0);

    // Return to 0 for a seamless loop
    tl.to([leftGhostRef.current, rightGhostRef.current], {
      x: 0,
      duration: loopDuration / 2,
      ease: 'sine.inOut',
    }, loopDuration / 2);

    return () => {
      tl.kill();
    };
  }, [intensity, loopDuration, autoStart]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* BASE LAYER (Solid and sharp) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
          priority
        />
      </div>

      {/* LEFT GHOST LAYER (Subtle echo) */}
      <div 
        ref={leftGhostRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen"
        style={{ opacity: ghostOpacity }}
      >
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
        />
      </div>

      {/* RIGHT GHOST LAYER (Subtle echo) */}
      <div 
        ref={rightGhostRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-30 mix-blend-screen"
        style={{ opacity: ghostOpacity }}
      >
        <Image 
          src={src} 
          alt="" 
          fill 
          className="object-cover scale-[1.12]" 
        />
      </div>
    </div>
  );
}
