'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import BlurAnimation from '@/components/BlurAnimation';

export default function SpecialOneV3Page() {
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const song = getSongById('song-8');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  // Circular Pan Animation
  useEffect(() => {
    if (!backgroundRef.current || !song) return;

    const backgroundElement = backgroundRef.current;
    
    // Motion parameters
    const centerX = 50; 
    const centerY = 50; 
    const radius = 3; 
    const duration = 7.5; 

    const animValues = { angle: 0 };

    const updatePosition = () => {
      const x = centerX + radius * Math.sin(animValues.angle);
      const y = centerY - radius * Math.cos(animValues.angle);
      backgroundElement.style.backgroundPosition = `calc(${x}% + 50px) ${y}%`;
    };

    updatePosition();

    const timeline = gsap.timeline({
      repeat: -1,
      paused: false,
      onUpdate: updatePosition
    });

    timeline.to(animValues, {
      angle: Math.PI * 2,
      duration: duration,
      ease: 'none'
    }, 0);

    return () => {
      timeline.kill();
    };
  }, []);

  if (!song) return null;

  const handleExport = () => {
    router.push('/export/special-one-v3');
  };

  return (
    <MusicPlayerUI 
      song={song} 
      album={album} 
      showExportButton={true} 
      onExport={handleExport}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Background Image Layer */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${assetPath('/images/special-one-layers/special-one-all.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'calc(50% + 50px) center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        
        {/* Blur Animation */}
        <BlurAnimation
          targetRef={backgroundRef}
          blurAmount={4}
          loopDuration={7.5}
          autoStart={true}
        />
        
        {/* Noise Overlay */}
        <div
          className="absolute inset-0 w-full h-full special-one-noise-overlay"
          style={{
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
    </MusicPlayerUI>
  );
}
