'use client';

import Link from 'next/link';
import { Song } from '@/lib/data';

interface SongListProps {
  songs: Song[];
}

/**
 * SongList Component
 * 
 * Displays a list of songs from an album.
 * Each song is clickable and navigates to the music player page.
 * 
 * Props:
 * - songs: Array of song objects to display
 */
export default function SongList({ songs }: SongListProps) {
  // Helper function to format duration (seconds) to MM:SS format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No songs in this album.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <Link
          key={song.id}
          href={`/player/${song.id}`}
          className="block group"
        >
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            {/* Track Number */}
            <span className="text-gray-400 text-sm w-8 text-right group-hover:text-white transition-colors">
              {index + 1}
            </span>
            
            {/* Song Title */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                {song.title}
              </h4>
            </div>
            
            {/* Duration */}
            <span className="text-gray-400 text-sm">
              {formatDuration(song.duration)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
