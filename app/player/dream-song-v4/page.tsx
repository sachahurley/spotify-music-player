'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import ChromaticAberration from '@/components/ChromaticAberration';

export default function DreamSongV4Page() {
  const song = getSongById('song-14');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        {/* Night sky background with RGB split effect */}
        <ChromaticAberration 
          src={assetPath('/assets/novel-tea-final-v2.svg')}
          intensity={6}
          loopDuration={7.5}
          redOpacity={0.4} // Restore red for this version
          blueOpacity={0.6}
        />
        
        {/* Dark Scrim Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[5] pointer-events-none" />
      </div>
    </MusicPlayerUI>
  );
}
