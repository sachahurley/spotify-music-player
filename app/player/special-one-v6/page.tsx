'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import LensFlareAnimation from '@/components/LensFlareAnimation';

export default function SpecialOneV6Page() {
  const router = useRouter();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const song = getSongById('song-11');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  const handleExport = () => {
    // Reuse existing export for now
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
        
        {/* Cinematic Lens Flare Animation - 7.5 second loop */}
        <LensFlareAnimation 
          loopDuration={7.5}
          autoStart={true}
        />
      </div>
    </MusicPlayerUI>
  );
}
