'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Lens Flare Animation Component
 * 
 * Creates a cinematic lens flare effect that moves across the screen.
 * Uses radial gradients and screen blend mode for a realistic light effect.
 */
interface LensFlareAnimationProps {
  loopDuration?: number;
  autoStart?: boolean;
}

export default function LensFlareAnimation({ 
  loopDuration = 7.5,
  autoStart = true 
}: LensFlareAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!flareRef.current) return;

    const flare = flareRef.current;

    // Create GSAP timeline for the light movement
    const tl = gsap.timeline({
      repeat: -1,
      paused: !autoStart,
    });

    // Path: From top-left off-screen to bottom-right off-screen
    // We animate through the center to create a "sweep" effect
    // Path: From close button (top-left) to plus icon (bottom-right)
    // Both points are off-screen to start and end
    tl.set(flare, {
      xPercent: -50,
      yPercent: -50,
      left: "-20%",
      top: "10%", // Near top-left (close button height)
      opacity: 0,
      scale: 0.5,
    });

    tl.to(flare, {
      left: "50%",
      top: "45%", // Passing through center
      scale: 1.2,
      duration: loopDuration / 2,
      ease: "sine.inOut",
    }, 0);

    // Speed up the fade in: Reach full opacity in 1.5 seconds instead of the full half-loop
    tl.to(flare, {
      opacity: 0.8,
      duration: 1.5,
      ease: "power1.out",
    }, 0);

    tl.to(flare, {
      left: "120%",
      top: "80%", // Near bottom-right (plus icon area)
      opacity: 0,
      scale: 0.8,
      duration: loopDuration / 2,
      ease: "sine.inOut",
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [loopDuration, autoStart]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* The Lens Flare Light Source */}
      <div
        ref={flareRef}
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          // Multiple radial gradients to simulate lens optics
          background: `
            radial-gradient(circle at center, white 0%, rgba(255, 255, 255, 0.8) 5%, rgba(255, 230, 150, 0.4) 15%, transparent 60%),
            radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 40% 40%, rgba(100, 200, 255, 0.1) 0%, transparent 20%)
          `,
          filter: 'blur(30px)',
          mixBlendMode: 'screen', // Only brightens the image behind it
          pointerEvents: 'none',
          willChange: 'transform, left, top',
        }}
      >
        {/* Optical "Ghost" - A secondary smaller ring that follows the light */}
        <div 
          className="absolute w-[80px] h-[80px] rounded-full border border-white/10"
          style={{
            left: '120%',
            top: '120%',
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 80%)',
            filter: 'blur(5px)',
          }}
        />
      </div>
    </div>
  );
}
