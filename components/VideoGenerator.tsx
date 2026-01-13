'use client';

import { useState, useRef } from 'react';
import {
  generateVideo,
  loadImage,
  downloadBlob,
  VideoGenerationOptions,
  VideoGenerationProgress,
} from '@/lib/video';
import { Song } from '@/lib/data';

interface VideoGeneratorProps {
  song?: Song; // Optional song to use for audio
}

/**
 * VideoGenerator Component
 * 
 * Provides an interface for:
 * - Uploading graphics assets
 * - Previewing the animation
 * - Generating 7.5-second loopable MP4 videos
 * - Downloading the generated video
 * 
 * Props:
 * - song: Optional song object to use for audio in the video
 */
export default function VideoGenerator({ song }: VideoGeneratorProps) {
  const [uploadedAssets, setUploadedAssets] = useState<HTMLImageElement[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<VideoGenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Handle file uploads
   * Accepts image files and loads them into memory
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const newAssets: HTMLImageElement[] = [];

    try {
      // Load all uploaded images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const img = await loadImage(file);
          newAssets.push(img);
        }
      }

      setUploadedAssets((prev) => [...prev, ...newAssets]);
    } catch (err) {
      setError(`Failed to load images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  /**
   * Remove an asset from the list
   */
  const removeAsset = (index: number) => {
    setUploadedAssets((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Generate the video
   */
  const handleGenerateVideo = async () => {
    if (uploadedAssets.length === 0) {
      setError('Please upload at least one image asset');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress({ stage: 'loading', progress: 0 });

    try {
      const options: VideoGenerationOptions = {
        width: 1920,
        height: 1080,
        fps: 30,
        duration: 7.5,
        audioUrl: song?.audioUrl,
        assets: uploadedAssets,
      };

      const videoBlob = await generateVideo(options, (prog) => {
        setProgress(prog);
      });

      // Create preview URL
      const url = URL.createObjectURL(videoBlob);
      setPreviewUrl(url);

      // Auto-download the video
      const filename = song
        ? `video-${song.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp4`
        : `video-${Date.now()}.mp4`;
      downloadBlob(videoBlob, filename);

      setProgress({ stage: 'complete', progress: 1, message: 'Video generated and downloaded!' });
    } catch (err) {
      setError(`Failed to generate video: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProgress(null);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Clear all assets and reset the generator
   */
  const handleClear = () => {
    setUploadedAssets([]);
    setProgress(null);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white">Video Generator</h2>
      <p className="text-gray-400 text-sm">
        Upload graphics assets and generate a 7.5-second loopable MP4 video.
        {song && (
          <span className="block mt-1">
            Audio: <span className="text-green-400">{song.title}</span>
          </span>
        )}
      </p>

      {/* File Upload */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Graphics Assets
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isGenerating}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PNG, JPG, GIF, WebP
          </p>
        </div>

        {/* Uploaded Assets Preview */}
        {uploadedAssets.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Uploaded Assets ({uploadedAssets.length})
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {uploadedAssets.map((asset, index) => (
                <div key={index} className="relative group">
                  <img
                    src={asset.src}
                    alt={`Asset ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg bg-gray-800"
                  />
                  <button
                    onClick={() => removeAsset(index)}
                    disabled={isGenerating}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    aria-label="Remove asset"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
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
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Video Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Preview</h3>
          <video
            src={previewUrl}
            controls
            className="w-full rounded-lg bg-black"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerateVideo}
          disabled={isGenerating || uploadedAssets.length === 0}
          className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate & Download MP4'}
        </button>
        <button
          onClick={handleClear}
          disabled={isGenerating}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Hidden canvas for rendering (if needed for preview) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
