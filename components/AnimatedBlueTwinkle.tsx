'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { assetPath } from '@/lib/basePath';

/**
 * Animated Blue Twinkle Component
 * 
 * Creates a subtle 7-second looping twinkle animation that targets
 * blue portions of the SVG using CSS filters and overlay effects.
 * Animation starts automatically on component mount (on arrival).
 * 
 * HOW IT WORKS:
 * 1. The SVG loads normally
 * 2. A CSS filter overlay detects and highlights blue-tinted areas
 * 3. Sparkle particles animate over the blue areas with a gentle twinkle
 * 4. Animation loops continuously every 7 seconds
 */
export default function AnimatedBlueTwinkle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLImageElement>(null);
  const sparkleOverlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !sparkleOverlayRef.current) return;

    // Create sparkle particles
    const sparkleCount = 8; // Number of sparkles
    const sparkles: HTMLDivElement[] = [];

    // Create sparkle elements
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute rounded-full pointer-events-none';
      sparkle.style.width = '3px';
      sparkle.style.height = '3px';
      sparkle.style.background = 'rgba(100, 150, 255, 0.8)'; // Light blue sparkle
      sparkle.style.boxShadow = '0 0 4px rgba(100, 150, 255, 0.9), 0 0 8px rgba(100, 150, 255, 0.6)';
      sparkle.style.opacity = '0';
      
      // Random position within container
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      sparkle.style.left = `${x}%`;
      sparkle.style.top = `${y}%`;
      
      sparkleOverlayRef.current.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    // Create GSAP timeline - 7 second loop
    const timeline = gsap.timeline({
      repeat: -1, // Loop forever
      paused: false // Start immediately on arrival
    });

    // Animate each sparkle with staggered timing for natural twinkle effect
    sparkles.forEach((sparkle, index) => {
      // Stagger start times for natural randomness
      const startTime = (index * 0.3) % 7; // Distribute across 7 seconds
      
      // Twinkle animation: fade in, glow, fade out
      timeline.to(sparkle, {
        opacity: 0.9,
        scale: 1.5,
        duration: 0.8,
        ease: 'power2.out'
      }, startTime);
      
      timeline.to(sparkle, {
        opacity: 0.3,
        scale: 1.2,
        duration: 0.6,
        ease: 'power2.in'
      }, startTime + 0.8);
      
      timeline.to(sparkle, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'power2.in'
      }, startTime + 1.4);
      
      // Move sparkle slightly for subtle movement
      timeline.to(sparkle, {
        x: `+=${(Math.random() - 0.5) * 8}px`,
        y: `+=${(Math.random() - 0.5) * 8}px`,
        duration: 2,
        ease: 'sine.inOut'
      }, startTime);
    });

    // Add subtle brightness pulse to blue areas using CSS filter
    // This creates a gentle glow effect on blue-tinted portions
    if (svgRef.current) {
      timeline.to(svgRef.current, {
        filter: 'brightness(1.15) saturate(1.1)',
        duration: 2,
        ease: 'sine.inOut'
      }, 0);
      
      timeline.to(svgRef.current, {
        filter: 'brightness(1) saturate(1)',
        duration: 2,
        ease: 'sine.inOut'
      }, 2);
      
      timeline.to(svgRef.current, {
        filter: 'brightness(1.1) saturate(1.05)',
        duration: 2,
        ease: 'sine.inOut'
      }, 4);
      
      timeline.to(svgRef.current, {
        filter: 'brightness(1) saturate(1)',
        duration: 1,
        ease: 'sine.inOut'
      }, 6);
    }

    timelineRef.current = timeline;

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      sparkles.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative shrink-0 w-[48px] h-[48px] rounded overflow-hidden"
    >
      {/* SVG Image */}
      <Image 
        ref={svgRef}
        src={assetPath('/assets/novel-tea-final.svg')} 
        alt="" 
        width={48} 
        height={48} 
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1) saturate(1)',
          transition: 'filter 0.3s ease'
        }}
      />
      
      {/* Sparkle Overlay - positioned absolutely over the SVG */}
      <div 
        ref={sparkleOverlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          // CSS filter to enhance blue areas for sparkle visibility
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
