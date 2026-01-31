'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';
import TwinklingStarsOverlay from '@/components/TwinklingStarsOverlay';
import AnimatedNoiseOverlay from '@/components/AnimatedNoiseOverlay';

export default function DreamSongV2Page() {
  const song = getSongById('song-6');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        <AnimatedAlbumCover 
          isPlaying={true} 
          svgPath={assetPath('/assets/novel-tea-final-v2.svg')} 
          fullScreen={true} 
        />
        {/* Dark Scrim Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none" />
        
        {/* Twinkling Stars Overlay */}
        <TwinklingStarsOverlay starCount={30} starSize={3} loopDuration={7} />
      </div>
    </MusicPlayerUI>
  );
}
