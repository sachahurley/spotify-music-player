'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Blur Animation Component
 * 
 * Creates a smooth, looping blur animation effect.
 * Perfect for ambient, dreamy visual effects.
 */
interface BlurAnimationProps {
  /**
   * Target element reference to apply blur to
   * If not provided, will apply to the component's container
   */
  targetRef?: React.RefObject<HTMLElement | null>;
  blurAmount?: number;
  loopDuration?: number;
  autoStart?: boolean;
}

export default function BlurAnimation({ 
  targetRef,
  blurAmount = 4,
  loopDuration = 7,
  autoStart = true
}: BlurAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      // Determine which element to animate
      const targetElement = targetRef?.current || containerRef.current;
      
      if (!targetElement) {
        // If not found yet, try again in a bit (handles ref attachment timing)
        timeoutId = setTimeout(startAnimation, 50);
        return;
      }

      // Kill existing animation if any
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create GSAP timeline for seamless looping
      const timeline = gsap.timeline({
        repeat: -1,
        paused: !autoStart
      });

      const blurInDuration = loopDuration / 2;
      const blurOutDuration = loopDuration / 2;

      timeline.set(targetElement, {
        filter: 'blur(0px)',
        willChange: 'filter'
      }, 0);

      timeline.to(targetElement, {
        filter: `blur(${blurAmount}px)`,
        duration: blurInDuration,
        ease: 'power1.inOut'
      }, 0);

      timeline.to(targetElement, {
        filter: 'blur(0px)',
        duration: blurOutDuration,
        ease: 'power1.inOut'
      }, blurInDuration);

      timelineRef.current = timeline;
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      const targetElement = targetRef?.current || containerRef.current;
      if (targetElement) {
        gsap.set(targetElement, { filter: 'blur(0px)' });
      }
    };
  }, [targetRef, blurAmount, loopDuration, autoStart]);

  // If targetRef is provided, we don't render a container
  if (targetRef) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
