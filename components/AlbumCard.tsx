'use client';

import Link from 'next/link';
import { Album } from '@/lib/data';

interface AlbumCardProps {
  album: Album;
}

/**
 * AlbumCard Component
 * 
 * Displays a single album with its cover art, title, and artist.
 * Clicking on the card navigates to the album detail page.
 * 
 * Props:
 * - album: The album object containing id, title, artist, coverImage, and songs
 */
export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link 
      href={`/album/${album.id}`}
      className="block group cursor-pointer transition-transform hover:scale-105"
    >
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        {/* Album Cover Image */}
        <div className="aspect-square w-full bg-gray-700 rounded-lg overflow-hidden">
          {album.coverImage ? (
            <img
              src={album.coverImage}
              alt={`${album.title} by ${album.artist}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Cover
            </div>
          )}
        </div>
        
        {/* Album Title */}
        <h3 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
          {album.title}
        </h3>
        
        {/* Artist Name */}
        <p className="text-sm text-gray-400 truncate">
          {album.artist}
        </p>
      </div>
    </Link>
  );
}
