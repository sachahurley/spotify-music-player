'use client';

import AnimatedNoiseOverlay from '@/components/AnimatedNoiseOverlay';

/**
 * Simple Preview Page for Noise Overlay Component
 * 
 * This page shows the noise overlay component in isolation
 * so you can assess its appearance and behavior.
 */
export default function NoiseOverlayPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Background content to see how noise overlays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-6xl font-bold text-white">Noise Overlay Preview</h1>
          <p className="text-2xl text-white/80">This is the background content</p>
          <p className="text-lg text-white/60">The noise overlay should be visible above this</p>
        </div>
      </div>

      {/* Noise Overlay Component */}
      <AnimatedNoiseOverlay
        loopDuration={7.5}
        autoStart={true}
      />

      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg z-10 max-w-md">
        <h2 className="font-bold text-lg mb-2">Noise Overlay Settings</h2>
        <ul className="text-sm space-y-1">
          <li>• Opacity: 100% (for assessment)</li>
          <li>• Blend Mode: Normal</li>
          <li>• Loop Duration: 7.5 seconds</li>
          <li>• Update Rate: 10 fps</li>
          <li>• Contrast: 3.0 (high)</li>
          <li>• Animation Speed: 0.3</li>
          <li>• Enhancement: 1.7x</li>
        </ul>
        <p className="text-xs mt-4 text-yellow-300">
          You should see black and white grain particles moving/flickering across the screen.
        </p>
      </div>
    </div>
  );
}
