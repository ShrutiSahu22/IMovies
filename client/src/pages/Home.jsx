import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Ticket,
  Play,
  Star,
  Clock,
  Compass,
  Film,
  Calendar,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { movieApi } from '../api/movieApi.js';
import { useFetch } from '../hooks/useFetch.js';
import { useCity } from '../context/CityContext.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import ErrorState from '../components/ErrorState.jsx';
import TrailerModal from '../components/TrailerModal.jsx';
import { formatDuration } from '../utils/format.js';

export default function Home() {
  const navigate = useNavigate();
  const { selectedCity } = useCity();
  const [heroIndex, setHeroIndex] = useState(0);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [selectedTrailerUrl, setSelectedTrailerUrl] = useState('');
  const [selectedTrailerTitle, setSelectedTrailerTitle] = useState('');

  useEffect(() => {
    document.title = 'IMovies — Modern Cinema Experience & Ticket Booking';
  }, []);

  const { data, loading, error, refetch } = useFetch(
    () => movieApi.getMovies({ limit: 10, sort: 'newest' }),
    []
  );

  const movies = data?.data || [];
  const heroMovie = movies.length > 0 ? movies[heroIndex % movies.length] : null;

  // Auto rotate hero movie every 8 seconds
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const handleOpenTrailer = (movie) => {
    if (!movie) return;
    setSelectedTrailerUrl(movie.trailerUrl || 'https://www.youtube.com/watch?v=EXeTwQWrcwY');
    setSelectedTrailerTitle(movie.title);
    setTrailerModalOpen(true);
  };

  return (
    <div className="space-y-16 py-4">
      {/* ── 1. CINEMATIC HERO SPOTLIGHT SECTION ──────────────────────── */}
      {heroMovie ? (
        <section className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c0e17] shadow-2xl">
          {/* Background backdrop with cinematic blur & gradient mask */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroMovie.backdrop || heroMovie.poster}
              alt={heroMovie.title}
              className="w-full h-full object-cover object-center scale-105 filter brightness-50 contrast-125 transition-all duration-1000 ease-out"
            />
            {/* Multi-layered gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 md:p-16 flex flex-col justify-end min-h-[480px] sm:min-h-[540px] max-w-4xl">
            {/* Spotlight Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold w-fit mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>PREMIERE SPOTLIGHT {selectedCity ? `• ${selectedCity.toUpperCase()}` : ''}</span>
            </div>

            {/* Title & Metadata */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              {heroMovie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-300">
              {heroMovie.rating && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{heroMovie.rating.toFixed(1)} / 10</span>
                </span>
              )}
              {heroMovie.certificate && (
                <span className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 font-bold text-neutral-200 text-xs">
                  {heroMovie.certificate}
                </span>
              )}
              <span className="flex items-center gap-1 font-medium text-neutral-300">
                <Clock className="w-4 h-4 text-neutral-400" />
                {formatDuration(heroMovie.duration)}
              </span>
              <span className="hidden sm:inline-block text-neutral-400">•</span>
              <span className="text-neutral-300 font-medium">
                {heroMovie.genres?.join(', ')}
              </span>
              <span className="hidden sm:inline-block text-neutral-400">•</span>
              <span className="text-neutral-300 font-medium">
                {heroMovie.languages?.join(', ')}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-neutral-300/90 max-w-2xl line-clamp-3 leading-relaxed">
              {heroMovie.description}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={`/movies/${heroMovie._id}`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 font-bold text-sm text-white shadow-xl shadow-rose-950/60 hover:scale-105 transition-all duration-200"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => handleOpenTrailer(heroMovie)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 font-semibold text-sm text-white transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>
            </div>

            {/* Thumbnail switcher for featured movies */}
            {movies.length > 1 && (
              <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3 overflow-x-auto pb-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                  Trending:
                </span>
                {movies.slice(0, 5).map((m, idx) => (
                  <button
                    key={m._id}
                    onClick={() => setHeroIndex(idx)}
                    className={`shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-xs text-left ${
                      idx === heroIndex % movies.length
                        ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                        : 'bg-black/40 border-white/10 text-neutral-300 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-6 h-8 rounded object-cover shrink-0"
                    />
                    <span className="truncate max-w-[120px]">{m.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="h-96 rounded-3xl bg-neutral-900/60 animate-pulse border border-neutral-800" />
      )}

      {/* ── 2. CINEMATIC PERKS / HIGHLIGHTS BAR ───────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0f121b] border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/20 text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">5-Min Live Hold</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Lock your preferred seats with real-time websocket sync while paying.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f121b] border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/20 text-rose-400 shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Instant E-Ticket & QR</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Contactless digital boarding pass delivered to your screen & account.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f121b] border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Verified Razorpay</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              End-to-end encrypted checkout with automated refund protection.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f121b] border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/20 text-sky-400 shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">IMAX & Dolby Atmos</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Premium screen formats with recliner tiers across top cinemas.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. NOW SHOWING SECTION ───────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>Cinema Schedule</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Now Showing {selectedCity ? `in ${selectedCity}` : ''}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Select any movie to browse auditoriums, showtimes, and available seat maps
            </p>
          </div>

          <Link
            to="/movies"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-neutral-200 hover:text-white border border-white/[0.08] transition-all"
          >
            <Compass className="w-4 h-4 text-rose-400" />
            <span>Explore All Movies</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <MovieGrid movies={movies} loading={loading} skeletonCount={6} />
        )}
      </section>

      {/* ── 4. TRAILER MODAL ─────────────────────────────────────────── */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        videoUrl={selectedTrailerUrl}
        title={selectedTrailerTitle}
      />
    </div>
  );
}
