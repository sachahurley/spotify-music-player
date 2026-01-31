'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Twinkling Stars Overlay Component
 * 
 * Creates a subtle, ambient twinkling star effect over an image.
 */
interface TwinklingStarsOverlayProps {
  starCount?: number;
  starSize?: number;
  loopDuration?: number;
}

export default function TwinklingStarsOverlay({ 
  starCount = 25, 
  starSize = 2,
  loopDuration = 7 
}: TwinklingStarsOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any old stars first
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    starsRef.current = [];

    // Create star elements
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = `${starSize}px`;
      star.style.height = `${starSize}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      star.style.boxShadow = `0 0 ${starSize * 2}px rgba(255, 255, 255, 0.9), 0 0 ${starSize * 4}px rgba(255, 255, 255, 0.5)`;
      star.style.opacity = '0';
      star.style.transform = 'scale(0.7)';
      star.style.willChange = 'opacity, transform';
      
      const margin = 5; 
      const x = margin + Math.random() * (100 - margin * 2);
      const y = margin + Math.random() * (100 - margin * 2);
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      container.appendChild(star);
      starsRef.current.push(star);
    }

    const timeline = gsap.timeline({
      repeat: -1,
      paused: false
    });

    starsRef.current.forEach((star, index) => {
      const fadeInDuration = 2 + Math.random() * 1;
      const fadeOutDuration = 2 + Math.random() * 1;
      const peakOpacity = 0.5 + Math.random() * 0.3;
      const holdDuration = 0.2 + Math.random() * 0.6;
      const totalDuration = fadeInDuration + holdDuration + fadeOutDuration;
      
      let adjFadeIn = fadeInDuration;
      let adjHold = holdDuration;
      let adjFadeOut = fadeOutDuration;
      
      if (totalDuration > loopDuration * 0.9) {
        const scale = (loopDuration * 0.9) / totalDuration;
        adjFadeIn *= scale;
        adjHold *= scale;
        adjFadeOut *= scale;
      }
      
      const baseStartTime = (index * (loopDuration / starCount)) % loopDuration;
      const startTime = Math.max(0, Math.min(loopDuration - (adjFadeIn + adjHold + adjFadeOut), baseStartTime));
      
      timeline.set(star, { opacity: 0, scale: 0.7 }, 0);
      
      timeline.to(star, {
        opacity: peakOpacity,
        scale: 1.3,
        duration: adjFadeIn,
        ease: 'sine.inOut'
      }, startTime);
      
      timeline.to(star, {
        opacity: peakOpacity,
        scale: 1.3,
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
  }, [starCount, starSize, loopDuration]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}
