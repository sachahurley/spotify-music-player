'use client';

import { useState, useEffect, useRef } from 'react';
import { assetPath } from '@/lib/basePath';

/**
 * Special One v3 Video Export Page
 * 
 * This page exports ONLY the Special One v3 asset and animations as an MP4 video.
 * No UI elements are included - just the animated background.
 * 
 * Technical Specifications:
 * - Aspect Ratio: 9:16 (vertical/portrait)
 * - Resolution: 1080×1920px
 * - Duration: 7.5 seconds (configurable 3-8 seconds)
 * - Format: MP4 (H.264, no audio)
 * - Max File Size: 8MB
 */

interface ExportProgress {
  stage: 'loading' | 'rendering' | 'encoding' | 'complete';
  progress: number; // 0 to 1
  message?: string;
}

export default function SpecialOneV3ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(7.5);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Load the Special One v3 background image
   */
  const loadBackgroundImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load background image'));
      img.src = assetPath('/images/special-one-layers/special-one-all.png');
    });
  };

  /**
   * Create noise texture canvas for the noise overlay effect
   * Uses fractal noise similar to SVG turbulence filter
   */
  const createNoiseTexture = (width: number, height: number): HTMLCanvasElement => {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const ctx = noiseCanvas.getContext('2d');
    if (!ctx) return noiseCanvas;

    // Create fractal noise pattern (similar to SVG turbulence)
    // Using Perlin-like noise for smoother, more natural texture
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Base frequency for noise (similar to SVG baseFrequency='1.2')
    const baseFreq = 1.2;
    const numOctaves = 4;

    // Simple noise function (simplified Perlin noise)
    const noise = (x: number, y: number): number => {
      const n = Math.floor(x) + Math.floor(y) * 57;
      return ((n << 13) ^ n) * 0.000000000931322574615478515625;
    };

    const smoothNoise = (x: number, y: number): number => {
      const intX = Math.floor(x);
      const intY = Math.floor(y);
      const fracX = x - intX;
      const fracY = y - intY;

      const v1 = noise(intX, intY);
      const v2 = noise(intX + 1, intY);
      const v3 = noise(intX, intY + 1);
      const v4 = noise(intX + 1, intY + 1);

      const i1 = v1 * (1 - fracX) + v2 * fracX;
      const i2 = v3 * (1 - fracX) + v4 * fracX;
      return i1 * (1 - fracY) + i2 * fracY;
    };

    const fractalNoise = (x: number, y: number): number => {
      let value = 0;
      let amplitude = 1;
      let frequency = baseFreq;
      
      for (let i = 0; i < numOctaves; i++) {
        value += smoothNoise(x * frequency, y * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      
      return value;
    };

    // Generate noise pattern
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Get noise value (-1 to 1)
        const n = fractalNoise(x / 200, y / 200); // Scale to match background-size: 200px
        
        // Convert to grayscale (saturate to 0 like CSS)
        const gray = (n + 1) * 128; // Normalize to 0-255
        
        // Brown/tan color base: rgba(139, 90, 43, ...)
        data[index] = 139;     // R
        data[index + 1] = 90;  // G
        data[index + 2] = 43;  // B
        data[index + 3] = Math.floor(gray * 0.6); // Alpha based on noise
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return noiseCanvas;
  };

  /**
   * Apply blur effect using canvas filter API (supported in modern browsers)
   */
  const applyBlur = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    blurAmount: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void => {
    ctx.save();
    
    if (blurAmount > 0) {
      // Use native canvas filter API (supported in Chrome, Firefox, Safari)
      ctx.filter = `blur(${blurAmount}px)`;
    } else {
      ctx.filter = 'none';
    }
    
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
  };

  /**
   * Render a single frame of the Special One v3 animation
   * 
   * This replicates the three animations:
   * 1. Circular pan (7.5s circular motion)
   * 2. Blur animation (7.5s blur in/out)
   * 3. Noise overlay (7s CSS animation)
   */
  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number, // Time in seconds (0 to duration)
    backgroundImg: HTMLImageElement,
    noiseTexture: HTMLCanvasElement
  ): void => {
    const { width, height } = canvas;
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Calculate animation progress (0 to 1, looping)
    const circularProgress = (time % 7.5) / 7.5;
    const blurProgress = (time % 7.5) / 7.5;
    const noiseProgress = (time % 7) / 7;

    // 1. LEFT → UP → REBOUND ANIMATION
    // Replicate the motion from PlayerPageClient.tsx:
    // Phase 1 (0-2.5s): Move left
    // Phase 2 (2.5-5s): Move up
    // Phase 3 (5-7.5s): Rebound back to start
    const centerX = 50; // 50% horizontal center
    const centerY = 50; // 50% vertical center
    const leftMovement = 3; // 3% movement to the left
    const upMovement = 2; // 2% movement upward
    
    let offsetX = 0;
    let offsetY = 0;
    
    if (circularProgress < 1/3) {
      // Phase 1: Move left (0s → 2.5s, progress 0 → 0.333) - Slower, smoother movement
      const phaseProgress = circularProgress / (1/3);
      // Use sine.out easing for very smooth, slow deceleration
      const eased = Math.sin(phaseProgress * Math.PI / 2);
      offsetX = -leftMovement * eased;
    } else if (circularProgress < 2/3) {
      // Phase 2: Move up (2.5s → 5s, progress 0.333 → 0.666) - Slower, smoother movement
      const phaseProgress = (circularProgress - 1/3) / (1/3);
      // Use sine.out easing for very smooth, slow deceleration
      const eased = Math.sin(phaseProgress * Math.PI / 2);
      offsetX = -leftMovement; // Stay at left position
      offsetY = -upMovement * eased; // Move up
    } else {
      // Phase 3: Rebound back to start (5s → 7.5s, progress 0.666 → 1.0) - Slower, smoother rebound
      const phaseProgress = (circularProgress - 2/3) / (1/3);
      // Use sine.inOut easing for very smooth, slow acceleration and deceleration
      const eased = phaseProgress < 0.5
        ? (1 - Math.cos(phaseProgress * Math.PI)) / 2
        : (1 + Math.cos((phaseProgress - 0.5) * Math.PI * 2)) / 2;
      offsetX = -leftMovement * (1 - eased); // Return to center horizontally
      offsetY = -upMovement * (1 - eased); // Return to center vertically
    }
    
    // Calculate final positions
    const xPercent = centerX + offsetX;
    const yPercent = centerY + offsetY;
    
    // Scale image to cover canvas (background-size: cover)
    // Calculate scale to ensure image covers entire canvas
    const imgAspect = backgroundImg.width / backgroundImg.height;
    const canvasAspect = width / height;
    
    let imgWidth, imgHeight;
    if (imgAspect > canvasAspect) {
      // Image is wider - fit to height
      imgHeight = height;
      imgWidth = height * imgAspect;
    } else {
      // Image is taller - fit to width
      imgWidth = width;
      imgHeight = width / imgAspect;
    }

    // Calculate position based on percentage (accounting for the +50px offset from original)
    // Original: calc(50% + 50px) center
    const baseX = (xPercent / 100) * width;
    const baseY = (yPercent / 100) * height;
    const bgX = baseX - imgWidth / 2 + (width * 0.5 - imgWidth / 2) + 50;
    const bgY = baseY - imgHeight / 2 + (height * 0.5 - imgHeight / 2);

    // 2. BLUR ANIMATION
    // Replicate the blur animation: 0 → blurAmount → 0 over 7.5 seconds
    const blurAmount = 4; // pixels
    let currentBlur = 0;
    
    if (blurProgress < 0.5) {
      // Blur in: 0 to 0.5 progress = 0px to blurAmount
      currentBlur = (blurProgress * 2) * blurAmount;
    } else {
      // Blur out: 0.5 to 1.0 progress = blurAmount to 0px
      currentBlur = (1 - (blurProgress - 0.5) * 2) * blurAmount;
    }

    // Draw background image with blur
    ctx.save();
    applyBlur(ctx, backgroundImg, currentBlur, bgX, bgY, imgWidth, imgHeight);
    ctx.restore();

    // 3. NOISE OVERLAY ANIMATION
    // Replicate the noise overlay animation from CSS
    // Animation: opacity 0.2 → 0.35 → 0.5 → 0.65 → 0.75 over 7 seconds
    // Also applies contrast and brightness filters
    let noiseOpacity = 0.2;
    let contrast = 1.2;
    let brightness = 0.95;
    
    if (noiseProgress < 0.25) {
      // 0% to 25%: 0.2 → 0.35, contrast 1.2 → 1.4, brightness 0.95 → 0.9
      const t = noiseProgress / 0.25;
      noiseOpacity = 0.2 + t * (0.35 - 0.2);
      contrast = 1.2 + t * (1.4 - 1.2);
      brightness = 0.95 - t * (0.95 - 0.9);
    } else if (noiseProgress < 0.5) {
      // 25% to 50%: 0.35 → 0.5, contrast 1.4 → 1.6, brightness 0.9 → 0.85
      const t = (noiseProgress - 0.25) / 0.25;
      noiseOpacity = 0.35 + t * (0.5 - 0.35);
      contrast = 1.4 + t * (1.6 - 1.4);
      brightness = 0.9 - t * (0.9 - 0.85);
    } else if (noiseProgress < 0.75) {
      // 50% to 75%: 0.5 → 0.65, contrast 1.6 → 1.8, brightness 0.85 → 0.8
      const t = (noiseProgress - 0.5) / 0.25;
      noiseOpacity = 0.5 + t * (0.65 - 0.5);
      contrast = 1.6 + t * (1.8 - 1.6);
      brightness = 0.85 - t * (0.85 - 0.8);
    } else {
      // 75% to 100%: 0.65 → 0.75, contrast 1.8 → 2.0, brightness 0.8 → 0.75
      const t = (noiseProgress - 0.75) / 0.25;
      noiseOpacity = 0.65 + t * (0.75 - 0.65);
      contrast = 1.8 + t * (2.0 - 1.8);
      brightness = 0.8 - t * (0.8 - 0.75);
    }

    // Apply noise overlay with blend mode, contrast, and brightness
    ctx.save();
    ctx.globalAlpha = noiseOpacity;
    ctx.globalCompositeOperation = 'overlay';
    
    // Apply contrast and brightness filters
    // Note: Canvas doesn't have direct contrast/brightness filters, so we'll use a workaround
    // by adjusting the alpha and using a temporary canvas with adjusted colors
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      // Draw noise texture
      tempCtx.drawImage(noiseTexture, 0, 0, width, height);
      
      // Apply brightness and contrast adjustments
      const imageData = tempCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] = Math.max(0, Math.min(255, data[i] * brightness));     // R
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * brightness)); // G
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * brightness));   // B
        
        // Apply contrast
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
      }
      
      tempCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, width, height);
    } else {
      // Fallback: draw without filters
      ctx.drawImage(noiseTexture, 0, 0, width, height);
    }
    
    ctx.restore();
  };

  /**
   * Record the animation to a video blob
   */
  const recordAnimation = async (
    canvas: HTMLCanvasElement,
    backgroundImg: HTMLImageElement,
    noiseTexture: HTMLCanvasElement,
    durationSeconds: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get 2D context'));
        return;
      }

      const fps = 30;
      const stream = canvas.captureStream(fps);
      
      // Try to use H.264 codec if available, fallback to VP9
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2000000, // 2 Mbps (adjustable for file size)
      };

      // Try H.264 first (better for MP4)
      if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
        options.mimeType = 'video/webm;codecs=h264';
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];
      const totalFrames = Math.ceil(fps * durationSeconds);
      let currentFrame = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: options.mimeType || 'video/webm' });
        resolve(videoBlob);
      };

      mediaRecorder.onerror = (error) => {
        reject(new Error(`MediaRecorder error: ${error}`));
      };

      // Start recording
      setProgress({ stage: 'rendering', progress: 0, message: 'Recording animation...' });
      mediaRecorder.start();

      // Render frames
      const frameTime = 1 / fps;
      let elapsedTime = 0;

      const renderNextFrame = () => {
        if (elapsedTime >= durationSeconds) {
          mediaRecorder.stop();
          return;
        }

        // Render the current frame
        renderFrame(ctx, canvas, elapsedTime, backgroundImg, noiseTexture);
        
        // Update progress
        currentFrame++;
        const progress = currentFrame / totalFrames;
        setProgress({
          stage: 'rendering',
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
  };

  /**
   * Convert WebM to MP4 using FFmpeg.wasm
   * Automatically adjusts quality to ensure file size is under 8MB
   */
  const convertToMP4 = async (webmBlob: Blob, targetSizeMB: number = 8): Promise<Blob> => {
    // Dynamic import to avoid loading FFmpeg on initial page load
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();
    
    setProgress({ stage: 'encoding', progress: 0.1, message: 'Loading FFmpeg...' });

    // Load FFmpeg.wasm
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    setProgress({ stage: 'encoding', progress: 0.3, message: 'Converting to MP4...' });

    // Write input file
    const inputData = await fetchFile(webmBlob);
    await ffmpeg.writeFile('input.webm', inputData);

    // Try different quality settings until file size is acceptable
    const qualitySettings = [
      { crf: 23, preset: 'medium' },   // Good quality
      { crf: 25, preset: 'medium' },   // Slightly lower quality
      { crf: 27, preset: 'medium' },   // Lower quality
      { crf: 28, preset: 'slow' },    // Lower quality, better compression
    ];

    for (let i = 0; i < qualitySettings.length; i++) {
      const { crf, preset } = qualitySettings[i];
      
      setProgress({ 
        stage: 'encoding', 
        progress: 0.4 + (i * 0.1), 
        message: `Encoding video (quality ${i + 1}/${qualitySettings.length})...` 
      });

      // Convert to MP4 with H.264 codec, no audio, optimized for file size
      await ffmpeg.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',           // H.264 codec
        '-preset', preset,            // Encoding speed vs compression
        '-crf', crf.toString(),       // Quality (18-28, higher = smaller file)
        '-pix_fmt', 'yuv420p',       // Pixel format for compatibility
        '-movflags', '+faststart',    // Optimize for web playback
        '-an',                        // No audio
        '-y',                         // Overwrite output file
        'output.mp4'
      ]);

      // Read output file and check size
      const outputData = await ffmpeg.readFile('output.mp4');
      const fileSizeMB = outputData.length / (1024 * 1024);

      if (fileSizeMB <= targetSizeMB || i === qualitySettings.length - 1) {
        // File size is acceptable, or this is the last attempt
        setProgress({ stage: 'encoding', progress: 0.9, message: 'Finalizing...' });
        
        // Clean up
        await ffmpeg.deleteFile('input.webm');
        await ffmpeg.deleteFile('output.mp4');

        return new Blob([outputData], { type: 'video/mp4' });
      }

      // File too large, try next quality setting
      await ffmpeg.deleteFile('output.mp4');
    }

    // Should never reach here, but just in case
    throw new Error('Failed to encode video within size limit');
  };

  /**
   * Handle export button click
   */
  const handleExport = async () => {
    if (!canvasRef.current) {
      setError('Canvas not initialized');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress({ stage: 'loading', progress: 0, message: 'Initializing...' });

    try {
      const canvas = canvasRef.current;
      const width = 1080;
      const height = 1920;
      
      canvas.width = width;
      canvas.height = height;

      // Load background image
      setProgress({ stage: 'loading', progress: 0.2, message: 'Loading background image...' });
      const backgroundImg = await loadBackgroundImage();

      // Create noise texture
      setProgress({ stage: 'loading', progress: 0.4, message: 'Generating noise texture...' });
      const noiseTexture = createNoiseTexture(width, height);

      // Record animation
      setProgress({ stage: 'rendering', progress: 0.5, message: 'Starting recording...' });
      const webmBlob = await recordAnimation(canvas, backgroundImg, noiseTexture, duration);

      // Convert to MP4 (automatically optimizes for 8MB limit)
      setProgress({ stage: 'encoding', progress: 0.7, message: 'Converting to MP4...' });
      const mp4Blob = await convertToMP4(webmBlob, 8);

      // Check file size (should already be under 8MB due to auto-optimization)
      const fileSizeMB = mp4Blob.size / (1024 * 1024);
      if (fileSizeMB > 8) {
        setError(`File size is ${fileSizeMB.toFixed(2)}MB, which exceeds the 8MB limit. Try reducing the duration.`);
        setIsExporting(false);
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(mp4Blob);
      setPreviewUrl(url);

      // Download the file
      const filename = `special-one-v3-${duration}s-${Date.now()}.mp4`;
      const downloadUrl = URL.createObjectURL(mp4Blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setProgress({ 
        stage: 'complete', 
        progress: 1, 
        message: `Video exported successfully! (${fileSizeMB.toFixed(2)}MB)` 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export video');
      setProgress(null);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Preview the animation in real-time
   */
  useEffect(() => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set preview size (smaller for performance)
    canvas.width = 540; // Half size for preview
    canvas.height = 960;

    let animationFrame: number;
    const startTime = Date.now();

    const animate = async () => {
      try {
        const backgroundImg = await loadBackgroundImage();
        const noiseTexture = createNoiseTexture(canvas.width, canvas.height);

        const render = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          const time = elapsed % duration; // Loop the animation
          
          renderFrame(ctx, canvas, time, backgroundImg, noiseTexture);
          animationFrame = requestAnimationFrame(render);
        };

        render();
      } catch (err) {
        console.error('Preview error:', err);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Special One v3 Export</h1>
          <p className="text-gray-400">
            Export the Special One v3 asset and animations as an MP4 video (no UI elements).
          </p>
        </div>

        {/* Duration Selector */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <label className="block text-sm font-medium mb-2">
            Video Duration (seconds)
          </label>
          <input
            type="number"
            min="3"
            max="8"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(Math.max(3, Math.min(8, parseFloat(e.target.value) || 7.5)))}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
          />
          <p className="mt-2 text-sm text-gray-400">
            Recommended: 7.5 seconds (matches animation loop). Must be between 3-8 seconds.
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="flex justify-center">
            <canvas
              ref={previewCanvasRef}
              className="border border-gray-700 rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        {progress && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.message || progress.stage}</span>
                <span>{Math.round(progress.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Video Preview */}
        {previewUrl && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Exported Video</h2>
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: '600px' }}
            />
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isExporting ? 'Exporting...' : 'Export & Download MP4'}
        </button>

        {/* Technical Specifications */}
        <div className="bg-gray-800 p-6 rounded-lg text-sm">
          <h2 className="text-lg font-semibold mb-4">Technical Specifications</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Aspect Ratio: 9:16 (vertical/portrait)</li>
            <li>• Resolution: 1080×1920px</li>
            <li>• Duration: {duration} seconds</li>
            <li>• Format: MP4 (H.264 encoding, no audio)</li>
            <li>• Max File Size: 8MB</li>
            <li>• Animations: Circular pan, blur, and noise overlay</li>
          </ul>
        </div>

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
