// Get the base path for assets
// This is needed for GitHub Pages deployment where the app is served from a subdirectory
export const basePath = process.env.NODE_ENV === 'production' ? '/spotify-music-player' : '';

// Helper to prefix asset paths with the base path
export function assetPath(path: string): string {
  // If the path already starts with the basePath or is an external URL, return as-is
  if (path.startsWith(basePath) || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
