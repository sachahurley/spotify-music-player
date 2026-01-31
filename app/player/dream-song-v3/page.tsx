'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';
import ChromaticAberration from '@/components/ChromaticAberration';

export default function DreamSongV3Page() {
  const song = getSongById('song-12');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        {/* Full screen background with Chromatic Aberration effect */}
        <ChromaticAberration 
          src={assetPath('/assets/novel-tea-final-v2.svg')}
          intensity={6}
          loopDuration={7.5}
          redOpacity={0}
          blueOpacity={0.7}
        />
        
        {/* Dark Scrim Overlay - Made darker */}
        <div className="absolute inset-0 bg-black/75 z-[5] pointer-events-none" />
      </div>
    </MusicPlayerUI>
  );
}
