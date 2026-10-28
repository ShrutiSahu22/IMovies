import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMovies();
      setMovies(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Now Showing</h2>
          <p className="text-muted mb-0">Browse movies and book your tickets instantly</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
          <p className="mt-2 text-muted">Loading movies from database...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchMovies}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-5 text-muted">
          <h4>No movies currently showing.</h4>
          <p>Please check back later.</p>
        </div>
      )}

      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card movie-card border-0 shadow-sm overflow-hidden d-flex flex-column">
              <div className="movie-poster-container position-relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="badge bg-dark position-absolute top-0 end-0 m-2 px-2 py-1 opacity-75">
                  {movie.genre}
                </span>
              </div>
              <div className="card-body d-flex flex-column p-3">
                <h5 className="card-title fw-bold text-truncate mb-1">{movie.title}</h5>
                <p className="card-text text-muted small mb-2">
                  <span className="me-2">⏱ {movie.duration}</span>
                </p>
                <p
                  className="card-text small text-secondary flex-grow-1"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {movie.description}
                </p>
                <Link
                  to={`/movies/${movie._id}`}
                  className="btn btn-danger btn-sm w-100 mt-2 fw-semibold"
                >
                  View Showtimes & Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
