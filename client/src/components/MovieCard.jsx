import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Clock, Star, Ticket, ArrowRight, Play } from 'lucide-react';
import { formatDuration } from '../utils/format.js';

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);

  // Fallback poster image from Unsplash if remote link fails
  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
  const posterSrc = imgError || !movie.poster ? fallbackPoster : movie.poster;

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group relative flex flex-col rounded-3xl bg-[#0f121b] border border-white/[0.08] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-950/30"
    >
      {/* Poster Image Area */}
      <div className="relative aspect-[2/3] w-full bg-neutral-900 overflow-hidden">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f121b] via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges: Rating & Certificate */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {movie.rating ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{Number(movie.rating).toFixed(1)}</span>
            </span>
          ) : (
            <span />
          )}

          {movie.certificate && (
            <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-extrabold text-neutral-200 tracking-wider">
              {movie.certificate}
            </span>
          )}
        </div>

        {/* Bottom Poster Tag: Language & Format */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {movie.languages?.[0] && (
            <span className="px-2 py-0.5 rounded-md bg-neutral-900/90 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-neutral-300">
              {movie.languages[0]}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-[10px] font-semibold text-rose-300">
            2D / IMAX
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 font-bold text-xs text-white shadow-xl shadow-rose-950/60">
            <Ticket className="w-4 h-4" />
            <span>Select Seats</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Movie Details Footer */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-medium">
            {movie.genres?.join(' • ') || 'Cinematic Release'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            {formatDuration(movie.duration)}
          </span>
          <span className="text-[11px] font-semibold text-rose-400 group-hover:underline flex items-center gap-1">
            Book now &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
