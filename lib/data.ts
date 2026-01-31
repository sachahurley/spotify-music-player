// Type definitions for albums and songs
export interface Song {
  id: string;
  title: string;
  duration: number; // Duration in seconds
  audioUrl: string;
  albumId: string;
  route: string; // Path to the song's dedicated page
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
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v1',
      },
      {
        id: 'song-2',
        title: 'Dream Song',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v1',
      },
      {
        id: 'song-6',
        title: 'Dream Song v2',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v2',
      },
      {
        id: 'song-12',
        title: 'Dream Song v3',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v3',
      },
      {
        id: 'song-14',
        title: 'Dream Song v4',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v4',
      },
      {
        id: 'song-15',
        title: 'Dream Song v5',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v5',
      },
      {
        id: 'song-16',
        title: 'Dream Song v6',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v6',
      },
      {
        id: 'song-17',
        title: 'Dream Song v7',
        duration: 210, // 3.5 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/dream-song-v7',
      },
      {
        id: 'song-3',
        title: 'Ranger',
        duration: 195, // 3.25 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/ranger',
      },
      {
        id: 'song-7',
        title: 'Special One v2',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v2',
      },
      {
        id: 'song-8',
        title: 'Special One v3',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v3',
      },
      {
        id: 'song-9',
        title: 'Special One v4',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3', // Using existing audio file
        albumId: 'album-1',
        route: '/player/special-one-v4',
      },
      {
        id: 'song-10',
        title: 'Special One v5',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v5',
      },
      {
        id: 'song-11',
        title: 'Special One v6',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v6',
      },
      {
        id: 'song-13',
        title: 'Special One v7',
        duration: 180, // 3 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-1',
        route: '/player/special-one-v7',
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
        route: '/player/answer-part-2',
      },
      {
        id: 'song-5',
        title: 'Closing Song',
        duration: 240, // 4 minutes
        audioUrl: '/audio/dream-song.mp3',
        albumId: 'album-2',
        route: '/player/closing-song',
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
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v1',
      playCount: 118067885,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-7',
      title: 'Special One v2',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v2',
      playCount: 100000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-8',
      title: 'Special One v3',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v3',
      playCount: 95000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-9',
      title: 'Special One v4',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3', // Using existing audio file
      albumId: 'album-1',
      route: '/player/special-one-v4',
      playCount: 90000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-10',
      title: 'Special One v5',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v5',
      playCount: 85000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-11',
      title: 'Special One v6',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v6',
      playCount: 80000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-13',
      title: 'Special One v7',
      duration: 180,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/special-one-v7',
      playCount: 75000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-2',
      title: 'Dream Song',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v1',
      playCount: 24022385,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-6',
      title: 'Dream Song v2',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v2',
      playCount: 20000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-12',
      title: 'Dream Song v3',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v3',
      playCount: 18000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-14',
      title: 'Dream Song v4',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v4',
      playCount: 17000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-15',
      title: 'Dream Song v5',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v5',
      playCount: 16000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-16',
      title: 'Dream Song v6',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v6',
      playCount: 15000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-17',
      title: 'Dream Song v7',
      duration: 210,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/dream-song-v7',
      playCount: 14000000,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-3',
      title: 'Ranger',
      duration: 195,
      audioUrl: '/audio/dream-song.mp3',
      albumId: 'album-1',
      route: '/player/ranger',
      playCount: 18543210,
      coverArt: '/placeholder-album-cover.jpg',
    },
    {
      id: 'song-4',
      title: 'Answer (Part 2)',
      duration: 165,
      audioUrl: '/audio/song-4.mp3',
      albumId: 'album-2',
      route: '/player/answer-part-2',
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
