import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/format.js';

export default function TrailerModal({
  isOpen,
  trailerUrl,
  videoUrl,
  movieTitle,
  title,
  onClose,
}) {
  const url = trailerUrl || videoUrl || '';
  const displayTitle = movieTitle || title || 'Movie';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#0d0f17] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/[0.08] bg-[#090a0f]">
          <h3 className="text-sm font-bold text-white truncate flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {displayTitle} — Official Trailer
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={`${displayTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">
              Trailer video preview is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
