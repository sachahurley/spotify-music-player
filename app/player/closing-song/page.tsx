'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import MusicPlayerUI from '@/components/MusicPlayerUI';

export default function ClosingSongPage() {
  const song = getSongById('song-5');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute left-0 top-[100px] right-0 bottom-[400px] w-full flex items-center justify-center z-10">
        <div className="relative w-full flex items-center justify-center px-4" style={{ maxWidth: '375px' }}>
          <div className="w-full aspect-square flex items-center justify-center bg-gray-800 rounded-lg">
            <span className="text-gray-500">Closing Song Art Placeholder</span>
          </div>
        </div>
      </div>
    </MusicPlayerUI>
  );
}
