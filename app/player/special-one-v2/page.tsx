'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import GlimmerSweepAnimation from '@/components/GlimmerSweepAnimation';

export default function SpecialOneV2Page() {
  const song = getSongById('song-7');
  
  if (!song) return null;
  const album = getAlbumById(song.albumId);

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${assetPath('/images/special-one-layers/special-one-all.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'calc(50% + 50px) center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        
        {/* Glimmer Sweep Animation */}
        <GlimmerSweepAnimation 
          loopDuration={7.5}
          direction="diagonal"
          intensity={0.8}
        />
      </div>
    </MusicPlayerUI>
  );
}
