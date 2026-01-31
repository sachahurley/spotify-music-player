'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Song, Album, getArtist } from '@/lib/data';
import { assetPath } from '@/lib/basePath';

interface MusicPlayerUIProps {
  song: Song;
  album?: Album;
  children?: ReactNode;
  onExport?: () => void;
  showExportButton?: boolean;
}

/**
 * Shared Music Player UI Component
 * 
 * Handles common functionality for all player pages:
 * - Audio playback logic (play/pause, progress, timestamps)
 * - Navigation (dismiss, previous, next)
 * - UI visibility toggle (eye icon)
 * - Common controls and layout
 * 
 * Each page provides its own unique background/middle content as children.
 */
export default function MusicPlayerUI({ 
  song, 
  album, 
  children, 
  onExport,
  showExportButton = false 
}: MusicPlayerUIProps) {
  const router = useRouter();
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  // UI visibility toggle state
  const [isUIVisible, setIsUIVisible] = useState(true);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song.audioUrl, song.duration]);

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

  // Handle dismiss - navigate to home screen
  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    router.replace('/');
  };

  // Toggle UI visibility
  const toggleUIVisibility = () => {
    setIsUIVisible(!isUIVisible);
  };

  // Get list of songs from artist's popular songs for next/prev
  const artist = getArtist();
  const songList = artist.popularSongs;
  const currentIndex = songList.findIndex(s => s.id === song.id);

  // Handle previous song
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousSong = songList[currentIndex - 1];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      // Use the new route property for navigation
      router.push(previousSong.route);
    }
  };

  // Handle next song
  const handleNext = () => {
    if (currentIndex < songList.length - 1) {
      const nextSong = songList[currentIndex + 1];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      // Use the new route property for navigation
      router.push(nextSong.route);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex justify-center">
      <div className="relative w-full max-w-[375px] h-full bg-black overflow-hidden">
        {/* Background/Middle Content Area provided by parent */}
        {children}

        {/* Top Section - Close Icon and Title */}
        {isUIVisible && (
          <div className="absolute flex items-center justify-between left-0 top-0 w-full pt-[50px] px-[16px] pb-[16px] z-20">
            <button
              onClick={handleDismiss}
              className="relative shrink-0 w-[24px] h-[24px] flex items-center justify-center text-white"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="absolute left-1/2 -translate-x-1/2 text-white text-[18px] font-medium leading-[22px]">
              Novel tea
            </p>

            <div className="w-[24px]" />
          </div>
        )}

        {/* Bottom Section - Song Info and Controls */}
        {isUIVisible && (
          <div className="absolute bottom-[60px] left-0 w-full px-[16px] z-20">
            <p className="text-white text-[24px] font-bold mb-0 leading-[28px]">
              {song.title}
            </p>

            <div className="flex items-center justify-between mb-[16px]">
              <p className="text-white text-[16px] opacity-90 leading-[20px]">
                {album?.artist || 'Artist'}
              </p>

              <button className="relative shrink-0 w-[32px] h-[32px] flex items-center justify-center opacity-90">
                <Image src={assetPath('/icons/plus-icon.svg')} alt="Add" width={24} height={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-[24px]">
              <div className="relative w-full h-[4px] bg-white/30 rounded-full mb-[6px]">
                <div
                  className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-white text-[12px] opacity-70">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(remainingTime)}</span>
              </div>
            </div>

            {/* Main Playback Controls */}
            <div className="flex items-center justify-between mb-[24px]">
              <button className="relative shrink-0 w-[24px] h-[24px] opacity-70">
                <Image src={assetPath('/icons/shuffle-icon.svg')} alt="Shuffle" width={24} height={24} />
              </button>

              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`relative shrink-0 w-[36px] h-[36px] ${currentIndex === 0 ? 'opacity-30' : 'hover:opacity-80'}`}
              >
                <Image src={assetPath('/icons/previous-icon.svg')} alt="Previous" width={36} height={36} />
              </button>

              <button
                onClick={togglePlayPause}
                className="relative shrink-0 w-[64px] h-[64px] rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                {isPlaying ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === songList.length - 1}
                className={`relative shrink-0 w-[36px] h-[36px] ${currentIndex === songList.length - 1 ? 'opacity-30' : 'hover:opacity-80'}`}
              >
                <Image src={assetPath('/icons/next-icon.svg')} alt="Next" width={36} height={36} />
              </button>

              <button className="relative shrink-0 w-[24px] h-[24px] opacity-70">
                <Image src={assetPath('/icons/more-options-icon.svg')} alt="More" width={24} height={24} />
              </button>
            </div>

            {/* Utility Icons */}
            <div className="flex items-center justify-between px-[60px]">
              <button className="relative shrink-0 w-[24px] h-[24px]">
                <Image src={assetPath('/icons/speaker-icon.svg')} alt="Bluetooth" width={24} height={24} />
              </button>
              <button className="relative shrink-0 w-[24px] h-[24px]">
                <Image src={assetPath('/icons/share-icon.svg')} alt="Share" width={24} height={24} />
              </button>
            </div>
          </div>
        )}

        {/* Eye and Export Buttons */}
        <div className="absolute bottom-[52px] left-0 w-full flex justify-center items-center gap-3 px-[16px] z-30 pointer-events-none">
          {showExportButton && onExport && (
            <button
              onClick={onExport}
              className="relative shrink-0 w-[36px] h-[36px] pointer-events-auto flex items-center justify-center bg-green-500/40 border border-green-500/60 rounded-full text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          )}
          
          <button
            onClick={toggleUIVisibility}
            className={`relative shrink-0 w-[32px] h-[32px] pointer-events-auto flex items-center justify-center bg-white/10 rounded-full text-white ${isUIVisible ? 'opacity-100' : 'opacity-10'}`}
          >
            {isUIVisible ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3L21 21M10.5 10.677a2 2 0 002.823 2.823M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c3.6 0 6.991 2.807 9 6a15.7 15.7 0 01-2.808 3.374" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5C7.5 5 3.73 7.61 1 12c2.73 4.39 6.5 7 11 7s8.27-2.61 11-7c-2.73-4.39-6.5-7-11-7z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 pb-[9px] pt-[20px] w-full flex justify-center z-20 pointer-events-none">
          <div className="bg-white h-[5px] rounded-[5px] w-[134px]" />
        </div>
      </div>

      <audio ref={audioRef} src={assetPath(song.audioUrl)} preload="metadata" />
    </div>
  );
}
