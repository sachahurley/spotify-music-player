'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import BlurAnimation from '@/components/BlurAnimation';
import AnimatedNoiseOverlay from '@/components/AnimatedNoiseOverlay';

export default function SpecialOneV5Page() {
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const song = getSongById('song-10');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  const handleExport = () => {
    // For now, reuse the v1 export or we can create a v5 export later
    router.push('/export/special-one');
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
        
        {/* Blur Animation - 15 second slow breathing loop */}
        <BlurAnimation
          targetRef={backgroundRef}
          blurAmount={8}
          loopDuration={15}
          autoStart={true}
        />
      </div>
    </MusicPlayerUI>
  );
}
