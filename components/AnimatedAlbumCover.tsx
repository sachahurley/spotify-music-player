'use client';

import Image from 'next/image';

interface AnimatedAlbumCoverProps {
  isPlaying?: boolean; // Kept for compatibility but not used
  svgPath?: string; // Optional SVG path, defaults to original
}

/**
 * Album Cover Component
 * 
 * Displays the static SVG album cover image.
 */
export default function AnimatedAlbumCover({ isPlaying, svgPath = '/assets/novel-tea-final.svg' }: AnimatedAlbumCoverProps) {
  return (
    <div 
      className="relative w-full flex items-center justify-center"
      style={{ 
        maxWidth: '100%',
        overflow: 'visible'
      }}
    >
      {/* The Album Cover Image */}
      <Image
        src={svgPath}
        alt="Novel tea Album Cover"
        width={864}
        height={864}
        className="w-full h-auto object-contain block"
        style={{
          maxWidth: '100%'
        }}
      />
    </div>
  );
}
