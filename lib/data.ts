// Type definitions for albums and songs
export interface Song {
  id: string;
  title: string;
  duration: number; // Duration in seconds
  audioUrl: string;
  albumId: string;
  playCount?: number; // Number of plays for display
  coverArt?: string; // Cover art image URL
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  monthlyListeners: number;
  coverImage?: string; // Header image
  popularSongs: Song[];
}

// Mock data - Sample albums and songs
// This will be replaced with real data when you add audio files
export const albums: Album[] = [
  {
    id: 'album-1',
    title: 'Midnight Dreams',
    artist: 'Jeff Kolhede',
    coverImage: '/placeholder-album-cover.jpg',
    songs: [
      {
        id: 'song-1',
        title: 'Special One',
        duration: 180, // 3 minutes
        audioUrl: '/audio/song-1.mp3',
        albumId: 'album-1',
      },
      {
        id: 'song-2',
        title: 'Dream Song',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
      },
      {
        id: 'song-6',
        title: 'Dream Song v2',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
      },
      {
        id: 'song-3',
        title: 'Ranger',
        duration: 195, // 3.25 minutes
        audioUrl: '/audio/song-3.mp3',
        albumId: 'album-1',
      },
    ],
  },
  {
    id: 'album-2',
    title: 'Sunset Vibes',
    artist: 'Jeff Kolhede',
    coverImage: '/placeholder-album-cover.jpg',
    songs: [
      {
        id: 'song-4',
        title: 'Answer (Part 2)',
        duration: 165, // 2.75 minutes
        audioUrl: '/audio/song-4.mp3',
        albumId: 'album-2',
      },
      {
        id: 'song-5',
        title: 'Closing Song',
        duration: 240, // 4 minutes
        audioUrl: '/audio/song-5.mp3',
        albumId: 'album-2',
      },
    ],
  },
];

// Artist data for the homepage
export const artist: Artist = {
  id: 'artist-1',
  name: 'Jeff Kolhede',
  monthlyListeners: 37453089,
  popularSongs: [
    {
      id: 'song-1',
      title: 'Special One',
      duration: 180,
      audioUrl: '/audio/song-1.mp3',
      albumId: 'album-1',
      playCount: 118067885,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-2',
      title: 'Dream Song',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      playCount: 24022385,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-6',
      title: 'Dream Song v2',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      playCount: 20000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-3',
      title: 'Ranger',
      duration: 195,
      audioUrl: '/audio/song-3.mp3',
      albumId: 'album-1',
      playCount: 18543210,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-4',
      title: 'Answer (Part 2)',
      duration: 165,
      audioUrl: '/audio/song-4.mp3',
      albumId: 'album-2',
      playCount: 15234567,
      coverArt: '/placeholder-album-cover.jpg',
    },
  ],
};

// Helper functions to get data
export function getAllAlbums(): Album[] {
  return albums;
}

export function getAlbumById(id: string): Album | undefined {
  return albums.find((album) => album.id === id);
}

export function getSongById(id: string): Song | undefined {
  for (const album of albums) {
    const song = album.songs.find((song) => song.id === id);
    if (song) return song;
  }
  return undefined;
}

export function getSongsByAlbumId(albumId: string): Song[] {
  const album = getAlbumById(albumId);
  return album ? album.songs : [];
}

export function getArtist(): Artist {
  return artist;
}

export function getFirstSong(): Song | undefined {
  return artist.popularSongs.length > 0 ? artist.popularSongs[0] : undefined;
}
