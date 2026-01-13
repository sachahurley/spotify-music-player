import Link from 'next/link';

/**
 * 404 Not Found Page
 * 
 * Displayed when a user navigates to a page that doesn't exist.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
