'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';
import CloudSmokeEffect from '@/components/CloudSmokeEffect';

export default function DreamSongV6Page() {
  const song = getSongById('song-16');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        {/* Night sky background asset */}
        <AnimatedAlbumCover 
          isPlaying={true} 
          svgPath={assetPath('/assets/novel-tea-final-v2.svg')} 
          fullScreen={true} 
        />
        
        {/* Dark Scrim Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[10] pointer-events-none" />
        
        {/* New Cloud/Smoke Atmospheric Effect - Increased opacity */}
        <CloudSmokeEffect opacity={0.8} />
      </div>
    </MusicPlayerUI>
  );
}
