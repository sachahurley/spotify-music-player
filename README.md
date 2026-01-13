# Spotify Music Player

A prototype Spotify Music Player application built with Next.js, featuring album browsing, music playback, and 7.5-second loopable MP4 video generation.

## Features

- **Album Browsing**: View all available albums on the homepage
- **Album Details**: See all songs in an album
- **Music Player**: Full-featured audio player with play/pause, progress bar, and volume controls
- **Video Generation**: Create 7.5-second loopable MP4 videos by combining graphics assets with audio

## Project Structure

```
spotify-music-player/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage (album list)
│   ├── album/[id]/        # Album detail pages
│   ├── player/[id]/       # Music player pages
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── not-found.tsx     # 404 page
├── components/
│   ├── AlbumCard.tsx     # Album display component
│   ├── SongList.tsx      # List of songs in album
│   ├── MusicPlayer.tsx   # Audio player controls
│   └── VideoGenerator.tsx # Video creation interface
├── lib/
│   ├── audio.ts          # Audio utilities (placeholder)
│   ├── video.ts          # Video generation utilities
│   └── data.ts           # Mock album/song data
└── public/
    ├── audio/            # Song files (.mp3) - add your audio files here
    └── assets/           # Graphics assets for videos - add your assets here
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your audio files to `public/audio/` directory
3. Update `lib/data.ts` with your actual album and song data

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Albums and Songs

1. Place audio files (MP3 format) in the `public/audio/` directory
2. Update the `albums` array in `lib/data.ts` with your album and song information
3. Add album cover images to the `public/` directory and reference them in your data

### Generating Videos

1. Navigate to a song's player page
2. Use the VideoGenerator component (you can add it to any page)
3. Upload graphics assets (PNG, JPG, GIF, WebP)
4. Click "Generate & Download MP4" to create your 7.5-second video

**Note**: The current video generation creates WebM format videos. For true MP4 format, you may need to:
- Use FFmpeg.wasm library
- Set up a backend API with FFmpeg
- Use mp4box.js for browser-based MP4 creation

## Customization

### Styling

The project uses Tailwind CSS for styling. You can customize colors and styles in:
- `app/globals.css` - Global styles and CSS variables
- Component files - Tailwind classes

### Video Animation

Customize the animation logic in `lib/video.ts` in the `renderFrame` function. This is where you'll implement your specific motion graphics based on your uploaded assets.

## Next Steps

1. **Connect Figma Designs**: Use the Figma MCP server to import your UI designs
2. **Add Real Audio**: Replace mock data with actual song files
3. **Customize Video Animation**: Update the `renderFrame` function in `lib/video.ts` with your animation logic
4. **MP4 Conversion**: Implement proper MP4 conversion (currently outputs WebM)

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HTML5 Canvas API** - Graphics rendering
- **MediaRecorder API** - Video recording
- **HTML5 Audio API** - Audio playback

## Notes

- The video generation currently outputs WebM format. For MP4, consider using FFmpeg.wasm or a backend solution.
- Audio synchronization in videos requires additional implementation (currently video-only).
- The animation in `renderFrame` is a placeholder - customize it based on your needs.
