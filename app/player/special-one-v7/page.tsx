'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import ChromaticAberration from '@/components/ChromaticAberration';

export default function SpecialOneV7Page() {
  const song = getSongById('song-13');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Special One background image with Chromatic Aberration effect */}
        <ChromaticAberration 
          src={assetPath('/images/special-one-layers/special-one-all.png')}
          intensity={6}
          loopDuration={7.5}
          redOpacity={0}
          blueOpacity={0.7}
        />
        
        {/* Dark Scrim Overlay - Using the same dark cinematic feel as Dream Song v3 */}
        <div className="absolute inset-0 bg-black/75 z-[5] pointer-events-none" />
      </div>
    </MusicPlayerUI>
  );
}
