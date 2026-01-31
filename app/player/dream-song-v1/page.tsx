'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';

export default function DreamSongV1Page() {
  const song = getSongById('song-2');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute left-0 top-[100px] right-0 bottom-[400px] w-full flex items-center justify-center z-10">
        <div className="relative w-full flex items-center justify-center px-4" style={{ maxWidth: '375px' }}>
          <AnimatedAlbumCover 
            isPlaying={true} 
            svgPath={assetPath('/assets/novel-tea-final.svg')} 
          />
        </div>
      </div>
    </MusicPlayerUI>
  );
}
