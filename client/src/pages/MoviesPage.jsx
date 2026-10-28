import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Film,
  Search,
  X,
  Filter,
  RotateCcw,
  Sparkles,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { movieApi } from '../api/movieApi.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useCity } from '../context/CityContext.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity } = useCity();

  useEffect(() => {
    document.title = 'Explore Movies — IMovies Cinema';
  }, []);

  // Read search & filter state from URL
  const querySearch = searchParams.get('search') || '';
  const queryGenre = searchParams.get('genre') || '';
  const queryLanguage = searchParams.get('language') || '';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state for immediate typing feedback
  const [searchInput, setSearchInput] = useState(querySearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== querySearch) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  // Fetch filter options (genres, languages)
  const { data: filtersData } = useFetch(() => movieApi.getFilters(), []);
  const availableGenres = filtersData?.data?.genres || [
    'Action',
    'Adventure',
    'Sci-Fi',
    'Drama',
    'Crime',
    'Comedy',
    'Thriller',
  ];
  const availableLanguages = filtersData?.data?.languages || [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
  ];

  // Fetch movies matching active filters, search, city, and pagination
  const { data: moviesData, loading, error, refetch } = useFetch(
    () =>
      movieApi.getMovies({
        search: querySearch || undefined,
        genre: queryGenre || undefined,
        language: queryLanguage || undefined,
        city: selectedCity || undefined,
        page: queryPage,
        limit: 12,
        sort: 'newest',
      }),
    [querySearch, queryGenre, queryLanguage, selectedCity, queryPage]
  );

  const movies = moviesData?.data || [];
  const pagination = moviesData?.pagination || {};

  const handleGenreChange = (newGenre) => {
    updateUrlParams({ genre: newGenre === queryGenre ? '' : newGenre, page: 1 });
  };

  const handleLanguageChange = (newLang) => {
    updateUrlParams({ language: newLang === queryLanguage ? '' : newLang, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Boolean(querySearch || queryGenre || queryLanguage);

  return (
    <div className="space-y-8 py-6">
      {/* ── Header Title Banner ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CINEMA CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Explore All Movies
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse currently running movies, filter by genre or language, and book seats instantly
          </p>
        </div>

        {selectedCity && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-neutral-900 border border-white/[0.08] text-xs text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Showing cinemas in <strong className="text-white">{selectedCity}</strong></span>
          </div>
        )}
      </div>

      {/* ── Search & Filter Controls ──────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-[#0f121b] border border-white/[0.08] space-y-4 shadow-xl">
        {/* Search Bar + Reset */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, director, or cast..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-rose-400 flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Genre Pill Filters */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
            <span>Filter by Genre:</span>
            {queryGenre && (
              <span className="text-rose-400 font-semibold">Active: {queryGenre}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleGenreChange('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !queryGenre
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                  : 'bg-black/30 border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              All Genres
            </button>
            {availableGenres.map((genre) => {
              const isSelected = queryGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                      : 'bg-black/30 border border-white/[0.06] text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="text-xs font-bold text-neutral-400 mr-2">Language:</span>
          <button
            type="button"
            onClick={() => handleLanguageChange('')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              !queryLanguage
                ? 'bg-white/15 text-white font-bold'
                : 'bg-black/20 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                queryLanguage === lang
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'bg-black/20 text-neutral-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* ── Movie Results Grid ───────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>
            Showing <strong className="text-white">{movies.length}</strong> {movies.length === 1 ? 'movie' : 'movies'}
            {pagination.total ? ` of ${pagination.total}` : ''}
          </span>
          {querySearch && (
            <span>Search keyword: &ldquo;{querySearch}&rdquo;</span>
          )}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : movies.length === 0 && !loading ? (
          <EmptyState
            title="No movies found"
            description="Try adjusting your search criteria or resetting filters to see more results."
            actionLabel="Reset all filters"
            onAction={handleResetFilters}
          />
        ) : (
          <MovieGrid movies={movies} loading={loading} skeletonCount={8} />
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pt-6">
            <Pagination
              currentPage={pagination.page || 1}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}
