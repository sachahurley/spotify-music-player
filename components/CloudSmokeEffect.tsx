'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloud/Smoke Effect Component
 * 
 * Highly optimized using CSS filters and a smaller, scaled-up canvas.
 * Creates a slow, drifting atmospheric effect.
 */
interface CloudSmokeEffectProps {
  opacity?: number;
}

export default function CloudSmokeEffect({ opacity = 0.4 }: CloudSmokeEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      style={{ opacity }}
    >
      {/* Layer 1: Slow drifting clouds - Increased visibility */}
      <div 
        className="absolute inset-[-50%] w-[200%] h-[200%] animate-smoke-drift-slow"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          filter: 'blur(50px)',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Layer 2: Faster, smaller puffs - Increased visibility */}
      <div 
        className="absolute inset-[-50%] w-[200%] h-[200%] animate-smoke-drift-fast opacity-70"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 45%)
          `,
          filter: 'blur(35px)',
          mixBlendMode: 'screen',
        }}
      />

      <style jsx global>{`
        @keyframes smoke-drift-slow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes smoke-drift-fast {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-smoke-drift-slow {
          animation: smoke-drift-slow 20s ease-in-out infinite;
        }
        .animate-smoke-drift-fast {
          animation: smoke-drift-fast 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
