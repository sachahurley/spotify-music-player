import { notFound } from 'next/navigation';
import { getSongById, albums } from '@/lib/data';
import PlayerPageClient from '@/components/PlayerPageClient';

// Generate static params for all songs
export function generateStaticParams() {
  const allSongIds: { id: string }[] = [];
  for (const album of albums) {
    for (const song of album.songs) {
      allSongIds.push({ id: song.id });
    }
  }
  return allSongIds;
}

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Music Player Page - Now Playing Screen
 * Server component that validates the song ID and renders the client component.
 *
 * Route: /player/[id]
 */
export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const song = getSongById(id);

  // If song not found, show 404
  if (!song) {
    notFound();
  }

  return <PlayerPageClient id={id} />;
}
