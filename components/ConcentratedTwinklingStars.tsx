'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Zone {
  left: number;   // Percentage (0-100)
  top: number;    // Percentage (0-100)
  width: number;  // Percentage (0-100)
  height: number; // Percentage (0-100)
}

interface ConcentratedTwinklingStarsProps {
  starCount?: number;
  starSize?: number;
  loopDuration?: number;
  zones: Zone[]; // Areas where stars are allowed to spawn
  marginLeft?: string;
  marginTop?: string;
}

/**
 * Concentrated Twinkling Stars Overlay
 * 
 * Similar to TwinklingStarsOverlay but only spawns stars within specific zones.
 * Useful for highlighting a specific figure or object in the artwork.
 */
export default function ConcentratedTwinklingStars({ 
  starCount = 40, 
  starSize = 2,
  loopDuration = 7,
  zones,
  marginLeft = '0px',
  marginTop = '0px'
}: ConcentratedTwinklingStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !zones.length) return;
    
    // ...

    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    starsRef.current = [];

    // Create star elements within zones
    const stars: { element: HTMLDivElement, x: number, y: number }[] = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      
      // Select a random zone
      const zone = zones[Math.floor(Math.random() * zones.length)];
      
      // Use different sizes for variety
      const currentStarSize = starSize * (0.5 + Math.random() * 1.0);
      
      // Organic clustering logic
      let x, y;
      const isTopCluster = i < starCount * 0.9;
      
      if (isTopCluster) {
        // Create an organic "cloud" shape at the top
        // Pick from the first 3 zones (Body + Arms) to spread left and right
        const upperZones = zones.slice(0, Math.min(3, zones.length));
        const selectedZone = upperZones[Math.floor(Math.random() * upperZones.length)];
        
        // Horizontal: More spread out (uniform) instead of being centred
        const horizontalBias = Math.random();
        x = selectedZone.left + (horizontalBias * selectedZone.width);
        
        // Vertical: Less aggressive bias at the very top (pow 2 instead of 3)
        const verticalBias = Math.pow(Math.random(), 2); 
        y = selectedZone.top + (verticalBias * selectedZone.height * 0.8);
      } else {
        x = zone.left + Math.random() * zone.width;
        y = zone.top + Math.random() * zone.height;
      }

      star.style.position = 'absolute';
      star.style.width = `${currentStarSize}px`;
      star.style.height = `${currentStarSize}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      
      const glowOpacity = 0.4 + Math.random() * 0.5;
      star.style.boxShadow = `0 0 ${currentStarSize * 2}px rgba(255, 255, 255, ${glowOpacity}), 0 0 ${currentStarSize * 4}px rgba(255, 255, 255, ${glowOpacity * 0.5})`;
      
      star.style.opacity = '0';
      star.style.transform = 'scale(0.7)';
      star.style.willChange = 'opacity, transform';
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      container.appendChild(star);
      starsRef.current.push(star);
      stars.push({ element: star, x, y });
    }

    // Jitter the top 50 stars to reduce overlap density
    const sortedByTop = [...stars].sort((a, b) => a.y - b.y);
    const topStars = sortedByTop.slice(0, 50);
    
    topStars.forEach(s => {
      // Apply a 2-4px random jitter in any direction (up, down, diagonal)
      // Pick a random distance between 2 and 4
      const distance = 2 + Math.random() * 2;
      // Pick a random angle (0 to 360 degrees)
      const angle = Math.random() * Math.PI * 2;
      
      const jitterX = Math.cos(angle) * distance;
      const jitterY = Math.sin(angle) * distance;
      
      s.element.style.transform = `translate(${jitterX}px, ${jitterY}px) scale(0.7)`;
    });

    const timeline = gsap.timeline({
      repeat: -1,
      paused: false
    });

    starsRef.current.forEach((star, index) => {
      const fadeInDuration = 1.5 + Math.random() * 1.5;
      const fadeOutDuration = 1.5 + Math.random() * 1.5;
      const peakOpacity = 0.6 + Math.random() * 0.4;
      const holdDuration = 0.5 + Math.random() * 1.0;
      const totalDuration = fadeInDuration + holdDuration + fadeOutDuration;
      
      let adjFadeIn = fadeInDuration;
      let adjHold = holdDuration;
      let adjFadeOut = fadeOutDuration;
      
      if (totalDuration > loopDuration * 0.95) {
        const scale = (loopDuration * 0.95) / totalDuration;
        adjFadeIn *= scale;
        adjHold *= scale;
        adjFadeOut *= scale;
      }
      
      const baseStartTime = (index * (loopDuration / starCount)) % loopDuration;
      const startTime = Math.max(0, Math.min(loopDuration - (adjFadeIn + adjHold + adjFadeOut), baseStartTime));
      
      timeline.set(star, { opacity: 0, scale: 0.7 }, 0);
      
      timeline.to(star, {
        opacity: peakOpacity,
        scale: 1.4,
        duration: adjFadeIn,
        ease: 'sine.inOut'
      }, startTime);
      
      timeline.to(star, {
        opacity: peakOpacity,
        scale: 1.4,
        duration: adjHold,
        ease: 'none'
      }, startTime + adjFadeIn);
      
      timeline.to(star, {
        opacity: 0,
        scale: 0.7,
        duration: adjFadeOut,
        ease: 'sine.inOut'
      }, startTime + adjFadeIn + adjHold);
    });

    timelineRef.current = timeline;

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      starsRef.current = [];
    };
  }, [starCount, starSize, loopDuration, zones]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 10,
        marginLeft: marginLeft,
        marginTop: marginTop
      }}
    />
  );
}
