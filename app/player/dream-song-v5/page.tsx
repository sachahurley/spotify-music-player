'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import NaturalSplitEffect from '@/components/NaturalSplitEffect';

export default function DreamSongV5Page() {
  const song = getSongById('song-15');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        {/* Full screen background with Natural Split (Ghosting) effect */}
        <NaturalSplitEffect 
          src={assetPath('/assets/novel-tea-final-v2.svg')}
          intensity={10}
          loopDuration={7.5}
          ghostOpacity={0.25}
        />
        
        {/* Dark Scrim Overlay - Standard nighttime feel */}
        <div className="absolute inset-0 bg-black/50 z-[15] pointer-events-none" />
      </div>
    </MusicPlayerUI>
  );
}
