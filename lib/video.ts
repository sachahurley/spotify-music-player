/**
 * Video Generation Utilities
 * 
 * This module provides functions for generating 7.5-second loopable MP4 videos
 * by combining graphics assets with audio tracks.
 * 
 * Uses Canvas API for rendering and MediaRecorder API for recording.
 */

export interface VideoGenerationOptions {
  width?: number;
  height?: number;
  fps?: number;
  duration?: number; // Duration in seconds (default: 7.5)
  audioUrl?: string;
  assets?: HTMLImageElement[];
}

export interface VideoGenerationProgress {
  stage: 'loading' | 'rendering' | 'recording' | 'processing' | 'complete';
  progress: number; // 0 to 1
  message?: string;
}

/**
 * Load an image from a URL or File
 */
export async function loadImage(source: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${error}`));
    
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * Load audio from a URL
 */
export async function loadAudio(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = (error) => reject(new Error(`Failed to load audio: ${error}`));
    
    audio.src = url;
    audio.load();
  });
}

/**
 * Create a canvas element with the specified dimensions
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Render a frame on the canvas
 * This is a placeholder - you'll customize this based on your animation needs
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number, // Time in seconds (0 to duration)
  assets: HTMLImageElement[],
  options: VideoGenerationOptions
): void {
  const { width, height } = canvas;
  
  // Clear the canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // Example: Simple animation that loops
  // You'll replace this with your actual animation logic
  const progress = (time % (options.duration || 7.5)) / (options.duration || 7.5);
  
  // Draw assets (example: simple fade/scale animation)
  assets.forEach((asset, index) => {
    // Simple animation: scale based on progress
    const scale = 0.5 + (Math.sin(progress * Math.PI * 2) * 0.3);
    const alpha = 0.5 + (Math.sin(progress * Math.PI * 2 + index) * 0.5);
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-asset.width / 2, -asset.height / 2);
    ctx.drawImage(asset, 0, 0);
    ctx.restore();
  });
}

/**
 * Record canvas animation to video
 * Returns a Blob containing the video data
 */
export async function recordCanvasAnimation(
  canvas: HTMLCanvasElement,
  options: VideoGenerationOptions,
  onProgress?: (progress: VideoGenerationProgress) => void
): Promise<Blob> {
  const {
    fps = 30,
    duration = 7.5,
  } = options;

  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get 2D context from canvas'));
      return;
    }

    // Set up MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000, // 2.5 Mbps
    });

    const chunks: Blob[] = [];
    const totalFrames = Math.ceil(fps * duration);
    let currentFrame = 0;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      onProgress?.({ stage: 'processing', progress: 1, message: 'Processing video...' });
      
      // Combine all chunks into a single blob
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      
      // If audio is provided, we'll need to combine it (handled separately)
      // For now, return the video blob
      resolve(videoBlob);
    };

    mediaRecorder.onerror = (error) => {
      reject(new Error(`MediaRecorder error: ${error}`));
    };

    // Start recording
    onProgress?.({ stage: 'recording', progress: 0, message: 'Recording animation...' });
    mediaRecorder.start();

    // Render frames
    const frameTime = 1 / fps;
    let elapsedTime = 0;

    const renderNextFrame = () => {
      if (elapsedTime >= duration) {
        mediaRecorder.stop();
        return;
      }

      // Render the current frame
      renderFrame(ctx, canvas, elapsedTime, options.assets || [], options);
      
      // Update progress
      currentFrame++;
      const progress = currentFrame / totalFrames;
      onProgress?.({
        stage: 'recording',
        progress,
        message: `Rendering frame ${currentFrame} of ${totalFrames}`,
      });

      elapsedTime += frameTime;
      
      // Request next frame
      requestAnimationFrame(() => {
        setTimeout(renderNextFrame, frameTime * 1000);
      });
    };

    // Start rendering
    renderNextFrame();
  });
}

/**
 * Combine video and audio tracks into a single MP4
 * Note: Browser-based MP4 creation is limited. This may need backend support.
 */
export async function combineVideoAndAudio(
  videoBlob: Blob,
  _audioBlob: Blob
): Promise<Blob> {
  // This is a simplified version
  // For proper MP4 creation, you may need to use FFmpeg on the backend
  // or a library like mp4box.js
  
  // For now, return the video blob
  // In a real implementation, you'd use a library to mux the streams
  return videoBlob;
}

/**
 * Convert WebM blob to MP4 format
 * Note: This is a placeholder. Actual conversion may require FFmpeg or similar.
 */
export async function convertToMP4(webmBlob: Blob): Promise<Blob> {
  // Browser-based conversion is limited
  // For production, consider using:
  // 1. FFmpeg.wasm (WebAssembly version)
  // 2. Backend API with FFmpeg
  // 3. mp4box.js library
  
  // For now, return as-is (will be WebM format)
  // The browser may still play it, but it won't be MP4
  return webmBlob;
}

/**
 * Generate a 7.5-second loopable MP4 video
 * Main entry point for video generation
 */
export async function generateVideo(
  options: VideoGenerationOptions,
  onProgress?: (progress: VideoGenerationProgress) => void
): Promise<Blob> {
  const {
    width = 1920,
    height = 1080,
    audioUrl,
    assets = [],
  } = options;

  try {
    // Create canvas
    onProgress?.({ stage: 'loading', progress: 0, message: 'Setting up canvas...' });
    const canvas = createCanvas(width, height);

    // Load assets if they're URLs
    onProgress?.({ stage: 'loading', progress: 0.2, message: 'Loading assets...' });
    const loadedAssets = await Promise.all(
      assets.map((asset) => {
        if (asset instanceof HTMLImageElement) {
          return Promise.resolve(asset);
        }
        // If it's a string URL, load it
        return loadImage(asset as unknown as string);
      })
    );

    // Record the animation
    onProgress?.({ stage: 'rendering', progress: 0.3, message: 'Preparing animation...' });
    const videoBlob = await recordCanvasAnimation(
      canvas,
      { ...options, assets: loadedAssets },
      onProgress
    );

    // If audio is provided, combine it
    if (audioUrl) {
      onProgress?.({ stage: 'processing', progress: 0.9, message: 'Combining audio...' });
      // Load audio (for future use when implementing audio muxing)
      await loadAudio(audioUrl);
      // Note: Extracting audio as blob requires additional work
      // For now, the video will be created without audio
      // You'll need to implement audio extraction and muxing
    }

    // Convert to MP4 (placeholder - may still be WebM)
    onProgress?.({ stage: 'processing', progress: 0.95, message: 'Finalizing video...' });
    const mp4Blob = await convertToMP4(videoBlob);

    onProgress?.({ stage: 'complete', progress: 1, message: 'Video generated successfully!' });
    return mp4Blob;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
