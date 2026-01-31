/**
 * Color Sampling Utility
 * 
 * Samples colors from an image to extract specific color values.
 * Used to extract light blue and dark brown from the Special One asset.
 */

export interface SampledColors {
  lightBlue: { r: number; g: number; b: number };
  darkBrown: { r: number; g: number; b: number };
}

/**
 * Sample colors from an image
 * 
 * This function loads an image and samples pixels to extract:
 * - Light blue: samples from blue-tinted areas (sky/background)
 * - Dark brown: samples from brown-tinted areas (sand/ground)
 * 
 * @param imageUrl - URL or path to the image
 * @returns Promise with sampled colors
 */
export async function sampleColorsFromImage(imageUrl: string): Promise<SampledColors> {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Return default colors if running on server
    return {
      lightBlue: { r: 135, g: 206, b: 235 }, // Sky blue fallback
      darkBrown: { r: 91, g: 60, b: 43 }, // Dark brown fallback
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create a canvas to sample pixels
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Sample pixels to find light blue and dark brown
      const blueSamples: number[][] = [];
      const brownSamples: number[][] = [];
      
      // Sample pixels across the image
      // Sample more pixels from top area (likely blue sky) and bottom area (likely brown sand)
      const sampleCount = 1000;
      
      for (let i = 0; i < sampleCount; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const index = (y * canvas.width + x) * 4;
        
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        
        // Heuristic: Light blue areas have high blue value and are brighter
        // Typically in upper portion of image (sky)
        if (b > r && b > g && (r + g + b) / 3 > 100 && y < canvas.height * 0.6) {
          blueSamples.push([r, g, b]);
        }
        
        // Heuristic: Dark brown areas have red > green > blue and are darker
        // Typically in lower portion of image (sand/ground)
        if (r > g && g > b && (r + g + b) / 3 < 150 && y > canvas.height * 0.4) {
          brownSamples.push([r, g, b]);
        }
      }
      
      // Calculate average colors
      const calculateAverage = (samples: number[][]) => {
        if (samples.length === 0) return { r: 0, g: 0, b: 0 };
        
        const sum = samples.reduce(
          (acc, [r, g, b]) => ({ r: acc.r + r, g: acc.g + g, b: acc.b + b }),
          { r: 0, g: 0, b: 0 }
        );
        
        return {
          r: Math.round(sum.r / samples.length),
          g: Math.round(sum.g / samples.length),
          b: Math.round(sum.b / samples.length),
        };
      };
      
      // Fallback colors if sampling fails
      const lightBlue = blueSamples.length > 0 
        ? calculateAverage(blueSamples)
        : { r: 135, g: 206, b: 235 }; // Sky blue fallback
      
      const darkBrown = brownSamples.length > 0
        ? calculateAverage(brownSamples)
        : { r: 91, g: 60, b: 43 }; // Dark brown fallback
      
      resolve({ lightBlue, darkBrown });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for color sampling'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Convert RGB to hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}
