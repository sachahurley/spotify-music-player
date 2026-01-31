'use client';

import { getSongById, getAlbumById } from '@/lib/data';
import { assetPath } from '@/lib/basePath';
import MusicPlayerUI from '@/components/MusicPlayerUI';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';
import ConcentratedTwinklingStars from '@/components/ConcentratedTwinklingStars';

export default function DreamSongV7Page() {
  const song = getSongById('song-17');
  const album = song ? getAlbumById(song.albumId) : undefined;
  
  if (!song) return null;

  // Targeted zones for the person figure
  // Values are percentages (0-100) of the background area
  const figureZones = [
    { left: 40, top: 35, width: 20, height: 25 }, // Chest and Body
    { left: 32, top: 40, width: 8, height: 15 },  // Left Arm (upper)
    { left: 60, top: 40, width: 8, height: 15 },  // Right Arm (upper)
    { left: 42, top: 60, width: 16, height: 35 }, // Legs
  ];

  return (
    <MusicPlayerUI song={song} album={album}>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden">
        {/* Full screen background nighttime asset */}
        <AnimatedAlbumCover 
          isPlaying={true} 
          svgPath={assetPath('/assets/novel-tea-final-v2.svg')} 
          fullScreen={true} 
        />
        
        {/* Dark Scrim Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[5] pointer-events-none" />
        
        {/* Main sparkle cluster */}
        <ConcentratedTwinklingStars 
          starCount={50} 
          starSize={2.5} 
          zones={figureZones} 
          marginLeft="160px"
          marginTop="180px"
        />

        {/* 20 additional sparkles in a cluster up 20px and to the right 20px */}
        <ConcentratedTwinklingStars 
          starCount={20} 
          starSize={2.5} 
          zones={figureZones} 
          marginLeft="180px" // 160 + 20
          marginTop="160px"  // 180 - 20
        />
      </div>
    </MusicPlayerUI>
  );
}
