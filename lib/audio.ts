/**
 * Audio Utilities
 * 
 * Helper functions for audio processing and manipulation.
 * This file can be expanded with additional audio utilities as needed.
 */

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse MM:SS format to seconds
 */
export function parseDuration(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

/**
 * Load an audio file and return an Audio element
 */
export async function loadAudioFile(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = (error) => reject(new Error(`Failed to load audio: ${error}`));
    
    audio.src = url;
    audio.load();
  });
}
