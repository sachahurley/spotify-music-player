'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import SepiaGrainOverlay from '@/components/SepiaGrainOverlay';

export default function SpecialOneV4Page() {
  const song = getSongById('song-9');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  return (
    <MusicPlayerUI song={song} album={album}>
      {/* Super Simple Solid Light Blue Background */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ backgroundColor: '#87CEEB', zIndex: 1 }} 
      />

      {/* Slow, Atmospheric Sepia Film Grain Overlay */}
      <SepiaGrainOverlay 
        loopDuration={7.5} 
        autoStart={true} 
        opacity={0.8} 
      />
    </MusicPlayerUI>
  );
}
