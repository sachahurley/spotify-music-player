'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getSongById, getAlbumById, getArtist } from '@/lib/data';
import AnimatedAlbumCover from '@/components/AnimatedAlbumCover';

interface MusicPlayerModalProps {
  songId: string | null;
  onClose: () => void;
  onSongChange?: (songId: string) => void;
}

/**
 * Music Player Modal Component
 * 
 * A modal overlay that slides up from the bottom when opened
 * and slides down when closed. Renders the music player UI.
 */
export default function MusicPlayerModal({ songId, onClose, onSongChange }: MusicPlayerModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // UI visibility toggle state
  const [isUIVisible, setIsUIVisible] = useState(true);

  // Get song data
  const song = songId ? getSongById(songId) : null;
  const album = song ? getAlbumById(song.albumId) : null;

  // Trigger slide-up animation when songId changes (modal opens)
  useEffect(() => {
    if (songId && song) {
      setIsExiting(false);
      setIsAnimating(false);
      setDuration(song.duration);
      setCurrentTime(0);
      setIsPlaying(false);
      
      // Small delay to ensure smooth animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [songId, song]);

  // Initialize audio element
  useEffect(() => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      const audioDuration = audio.duration;
      if (audioDuration && !isNaN(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      } else {
        setDuration(song.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    setDuration(song.duration);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song?.audioUrl, song?.duration]);

  // Handle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max(0, duration - currentTime);

  // Handle dismiss - slide down animation then close
  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Set exiting state to keep backdrop visible during animation
    setIsExiting(true);
    // Trigger slide-down animation
    setIsAnimating(false);
    
    // Wait for animation to complete before closing modal
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 500); // Match animation duration
  };

  // Toggle UI visibility
  const toggleUIVisibility = () => {
    setIsUIVisible(!isUIVisible);
  };

  // Get list of songs from artist's popular songs
  const artist = getArtist();
  const songList = artist.popularSongs;
  const currentIndex = song ? songList.findIndex(s => s.id === song.id) : -1;

  // Handle previous song
  const handlePrevious = () => {
    if (currentIndex > 0 && song) {
      const previousSong = songList[currentIndex - 1];
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      // Change to previous song without closing modal
      if (onSongChange) {
        onSongChange(previousSong.id);
      }
    }
  };

  // Handle next song
  const handleNext = () => {
    if (currentIndex < songList.length - 1 && song) {
      const nextSong = songList[currentIndex + 1];
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      // Change to next song without closing modal
      if (onSongChange) {
        onSongChange(nextSong.id);
      }
    }
  };

  // Don't render if no song is selected
  if (!songId || !song) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50" style={{ willChange: 'transform', pointerEvents: 'auto' }}>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-out ${
          isAnimating ? 'opacity-50' : isExiting ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleDismiss}
        style={{
          pointerEvents: isAnimating || isExiting ? 'auto' : 'none',
          willChange: 'opacity',
          transition: 'opacity 500ms ease-out',
        }}
      />
      
      {/* Player modal - slides up from bottom */}
      <div 
        ref={playerRef}
        className={`fixed inset-0 bg-[#111] z-50 w-full max-w-[375px] mx-auto overflow-x-hidden transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
          willChange: 'transform',
        }}
      >
        {/* Top Section - Dismiss Icon and Title */}
        {isUIVisible && (
        <div className="absolute flex items-center justify-between left-0 top-0 w-full pt-[50px] px-[16px] pb-[16px]">
          {/* Dismiss Icon (Chevron Down - pointing down) */}
          <button
            onClick={handleDismiss}
            className="relative shrink-0 w-[24px] h-[24px] flex items-center justify-center"
            aria-label="Dismiss"
          >
            <Image 
              src="/icons/chevron-down-icon.svg" 
              alt="Dismiss" 
              width={24} 
              height={24} 
              className="w-full h-full" 
            />
          </button>

          {/* Novel tea Text - Centered */}
          <p 
            className="absolute left-1/2 -translate-x-1/2 text-white text-[18px] font-medium leading-[22px]"
            style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Novel tea
          </p>

          {/* Spacer to balance the layout */}
          <div className="w-[24px]" />
        </div>
        )}

        {/* Middle Content Area - Album Art Space */}
        <div className="absolute left-0 top-[100px] right-0 bottom-[400px] w-full flex items-center justify-center">
          {/* Show SVG art for Dream Song (song-2) and Dream Song v2 (song-6) */}
          {song.id === 'song-2' ? (
            <div className="relative w-full flex items-center justify-center px-4" style={{ maxWidth: '375px' }}>
              <AnimatedAlbumCover isPlaying={isPlaying} svgPath="/assets/novel-tea-final.svg" />
            </div>
          ) : song.id === 'song-6' ? (
            <div className="relative w-full flex items-center justify-center px-4" style={{ maxWidth: '375px' }}>
              <AnimatedAlbumCover isPlaying={isPlaying} svgPath="/assets/novel-tea-final-v2.svg" />
            </div>
          ) : (
            // Placeholder for other songs
            <div className="relative w-full flex items-center justify-center px-4" style={{ maxWidth: '375px' }}>
              <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                {/* Placeholder - will be replaced with unique asset for each song */}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Song Info and Controls */}
        {isUIVisible && (
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[375px] px-[16px]">
          {/* Song Title */}
          <p 
            className="text-white text-[24px] font-bold mb-0 leading-[28px]"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {song.title}
          </p>

          {/* Artist Name and Plus Icon Row */}
          <div className="flex items-center justify-between mb-[16px]">
            <p 
              className="text-white text-[16px] opacity-90 leading-[20px]"
              style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {album?.artist || 'Artist'}
            </p>
            
            {/* Plus Icon in Circle */}
            <button
              className="relative shrink-0 w-[32px] h-[32px] flex items-center justify-center opacity-90"
              aria-label="Add to playlist"
            >
              <Image 
                src="/icons/plus-icon.svg" 
                alt="Add" 
                width={24} 
                height={24} 
                className="w-full h-full" 
              />
            </button>
          </div>

          {/* Progress Bar Section */}
          <div className="mb-[24px]">
            {/* Progress Bar */}
            <div className="relative w-full h-[4px] bg-white/30 rounded-full mb-[6px]">
              <div 
                className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Timestamps */}
            <div className="flex justify-between">
              <span 
                className="text-white text-[12px] opacity-70 leading-[14px]"
                style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {formatTime(currentTime)}
              </span>
              <span 
                className="text-white text-[12px] opacity-70 leading-[14px]"
                style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                -{formatTime(remainingTime)}
              </span>
            </div>
          </div>

          {/* Main Playback Controls */}
          <div className="flex items-center justify-between mb-[24px]">
            {/* Shuffle */}
            <button
              className="relative shrink-0 w-[24px] h-[24px] opacity-70"
              aria-label="Shuffle"
            >
              <Image 
                src="/icons/shuffle-icon.svg" 
                alt="Shuffle" 
                width={24} 
                height={24} 
                className="w-full h-full" 
              />
            </button>

            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`relative shrink-0 w-[36px] h-[36px] transition-opacity ${
                currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              aria-label="Previous"
            >
              <Image 
                src="/icons/previous-icon.svg" 
                alt="Previous" 
                width={36} 
                height={36} 
                className="w-full h-full" 
              />
            </button>

            {/* Play/Pause Button (Center, Larger) */}
            <button
              onClick={togglePlayPause}
              className="relative shrink-0 w-[64px] h-[64px] rounded-full bg-white flex items-center justify-center shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <div className="w-[32px] h-[32px] flex items-center justify-center">
                {isPlaying ? (
                  // Pause icon
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="black"/>
                    <rect x="14" y="4" width="4" height="16" fill="black"/>
                  </svg>
                ) : (
                  // Play icon
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="black"/>
                  </svg>
                )}
              </div>
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentIndex === songList.length - 1}
              className={`relative shrink-0 w-[36px] h-[36px] transition-opacity ${
                currentIndex === songList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              aria-label="Next"
            >
              <Image 
                src="/icons/next-icon.svg" 
                alt="Next" 
                width={36} 
                height={36} 
                className="w-full h-full" 
              />
            </button>

            {/* More Options */}
            <button
              className="relative shrink-0 w-[24px] h-[24px] opacity-70"
              aria-label="More options"
            >
              <Image 
                src="/icons/more-options-icon.svg" 
                alt="More options" 
                width={24} 
                height={24} 
                className="w-full h-full" 
              />
            </button>
          </div>

          {/* Utility Icons Row */}
          <div className="flex items-center justify-between px-[60px]">
            {/* Bluetooth Icon */}
            <button
              className="relative shrink-0 w-[24px] h-[24px]"
              aria-label="Connect to Bluetooth"
            >
              <Image 
                src="/icons/speaker-icon.svg" 
                alt="Bluetooth" 
                width={24} 
                height={24} 
                className="w-full h-full" 
              />
            </button>

            {/* Share Icon */}
            <button
              className="relative shrink-0 w-[24px] h-[24px]"
              aria-label="Share"
            >
              <Image 
                src="/icons/share-icon.svg" 
                alt="Share" 
                width={24} 
                height={24} 
                className="w-full h-full" 
              />
            </button>
          </div>
        </div>
        )}

        {/* Eye Icon - Always visible, centered */}
        <div className="fixed bottom-[52px] left-1/2 -translate-x-1/2 z-50 w-full max-w-[375px] flex justify-center px-[16px] pointer-events-none">
          <button
            onClick={toggleUIVisibility}
            className={`relative shrink-0 w-[32px] h-[32px] pointer-events-auto flex items-center justify-center ${isUIVisible ? 'opacity-100' : 'opacity-10'}`}
            aria-label="Toggle UI visibility"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
          >
            {/* Simple eye icon using SVG */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {isUIVisible ? (
                // Eye slash (hide)
                <>
                  <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10.5 10.677a2 2 0 002.823 2.823" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c3.6 0 6.991 2.807 9 6a15.7 15.7 0 01-2.808 3.374" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              ) : (
                // Eye (show)
                <>
                  <path d="M12 5C7.5 5 3.73 7.61 1 12c2.73 4.39 6.5 7 11 7s8.27-2.61 11-7c-2.73-4.39-6.5-7-11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Home Indicator - Fixed to bottom */}
        <div className="fixed bottom-0 flex flex-col items-center justify-center left-1/2 -translate-x-1/2 pb-[9px] pt-[20px] px-[120px] w-full max-w-[375px]">
          <div className="bg-white h-[5px] rounded-[5px] shrink-0 w-[134px]" />
        </div>

        {/* Hidden audio element */}
        {song && (
          <audio 
            ref={audioRef} 
            src={song.audioUrl} 
            preload="metadata"
          />
        )}
      </div>
    </div>
  );
}
