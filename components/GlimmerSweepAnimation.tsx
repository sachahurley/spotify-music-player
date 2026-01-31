'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Glimmer Sweep Animation Component
 * 
 * Creates a subtle white shimmer/glow that slowly sweeps across the image.
 * Like a gentle wave of light moving horizontally or diagonally.
 * 
 * HOW IT WORKS:
 * 1. Creates a gradient overlay with white shimmer effect
 * 2. Animates the gradient position to create a sweeping motion
 * 3. Smooth, continuous motion that loops seamlessly
 * 4. Elegant and minimal effect
 * 
 * FEATURES:
 * - Subtle white shimmer/glow
 * - Smooth horizontal or diagonal sweep
 * - Seamless 7.5 second loop
 * - Elegant and minimal design
 */
interface GlimmerSweepAnimationProps {
  /**
   * Duration of the complete loop in seconds
   * Default: 7.5 seconds
   */
  loopDuration?: number;
  
  /**
   * Direction of the sweep
   * 'horizontal' = left to right
   * 'diagonal' = top-left to bottom-right
   */
  direction?: 'horizontal' | 'diagonal';
  
  /**
   * Intensity of the shimmer (0-1)
   * Higher = more visible glow
   */
  intensity?: number;
}

export default function GlimmerSweepAnimation({ 
  loopDuration = 7.5,
  direction = 'horizontal',
  intensity = 0.4
}: GlimmerSweepAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !gradientRef.current) return;

    // Create GSAP timeline for seamless looping
    const timeline = gsap.timeline({
      repeat: -1, // Loop forever
      paused: false // Start immediately
    });

    // Determine gradient direction and start/end positions
    let startX: string;
    let startY: string;
    let endX: string;
    let endY: string;

    if (direction === 'diagonal') {
      // Diagonal sweep: top-left to bottom-right
      startX = '-100%';
      startY = '-100%';
      endX = '200%';
      endY = '200%';
    } else {
      // Horizontal sweep: left to right
      startX = '-100%';
      startY = '0%';
      endX = '200%';
      endY = '0%';
    }

    // Set initial position (off-screen, before the sweep starts)
    timeline.set(gradientRef.current, {
      backgroundPosition: `${startX} ${startY}`,
      opacity: 0,
      willChange: 'background-position, opacity'
    }, 0);

    // Sweep animation - smooth continuous motion
    // The gradient moves across the entire screen over the loop duration
    timeline.to(gradientRef.current, {
      backgroundPosition: `${endX} ${endY}`,
      opacity: intensity,
      duration: loopDuration,
      ease: 'none' // Linear easing for smooth, constant motion
    }, 0);

    // Fade in slightly at the start for smooth entry
    timeline.to(gradientRef.current, {
      opacity: intensity,
      duration: 0.3,
      ease: 'sine.out'
    }, 0);

    // Fade out slightly at the end for smooth exit
    timeline.to(gradientRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'sine.in'
    }, loopDuration - 0.3);

    timelineRef.current = timeline;

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      // Reset on cleanup
      if (gradientRef.current) {
        gsap.set(gradientRef.current, {
          backgroundPosition: `${startX} ${startY}`,
          opacity: 0
        });
      }
    };
  }, [loopDuration, direction, intensity]);

  // Create gradient for the shimmer effect
  // White gradient: transparent → white → transparent
  // Ultra-smooth, very gradual edges with extended fade zones
  const gradientStyle = direction === 'diagonal' 
    ? 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0.05) 15%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0.35) 35%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.85) 48%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.85) 52%, rgba(255, 255, 255, 0.6) 58%, rgba(255, 255, 255, 0.35) 65%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0) 95%, transparent 100%)'
    : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0.05) 15%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0.35) 35%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.85) 48%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.85) 52%, rgba(255, 255, 255, 0.6) 58%, rgba(255, 255, 255, 0.35) 65%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0) 95%, transparent 100%)';

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{
        zIndex: 2, // Above background but below UI
      }}
    >
      {/* Gradient overlay that sweeps across */}
      <div
        ref={gradientRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: gradientStyle,
          backgroundSize: direction === 'diagonal' ? '300% 300%' : '300% 100%',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'screen', // Creates a glowing effect
          willChange: 'background-position, opacity',
        }}
      />
    </div>
  );
}
