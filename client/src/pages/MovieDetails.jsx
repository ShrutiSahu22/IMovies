import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieDetailsAndShowtimes();
  }, [id]);

  const fetchMovieDetailsAndShowtimes = async () => {
    try {
      setLoading(true);
      setError('');
      const [movieRes, showtimesRes] = await Promise.all([
        api.getMovieById(id),
        api.getShowtimesByMovie(id)
      ]);
      setMovie(movieRes.data);
      setShowtimes(showtimesRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load movie details or showtimes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading movie and showtime information...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <p className="mb-2">{error || 'Movie not found.'}</p>
          <Link to="/" className="btn btn-sm btn-outline-danger">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              Movies
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {movie.title}
          </li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        {/* Movie Poster */}
        <div className="col-12 col-md-4 col-lg-3">
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-details-poster shadow-sm w-100"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Movie Info */}
        <div className="col-12 col-md-8 col-lg-9">
          <h1 className="fw-bold mb-2">{movie.title}</h1>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-secondary">{movie.genre}</span>
            <span className="badge bg-dark">⏱ {movie.duration}</span>
            {movie.releaseDate && (
              <span className="badge bg-light text-dark border">
                Release: {movie.releaseDate}
              </span>
            )}
          </div>
          <p className="lead fs-6 text-secondary mb-4">{movie.description}</p>

          <hr className="my-4" />

          {/* Showtimes Section */}
          <h4 className="fw-bold mb-3">Available Showtimes</h4>
          {showtimes.length === 0 ? (
            <div className="alert alert-warning">
              No showtimes are currently scheduled for this movie. Please check another movie.
            </div>
          ) : (
            <div className="row g-3">
              {showtimes.map((st) => {
                const availableSeats = (st.totalSeats || 40) - (st.bookedSeats ? st.bookedSeats.length : 0);
                return (
                  <div key={st._id} className="col-12 col-sm-6 col-lg-4">
                    <div className="card h-100 border p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold fs-5 text-danger">{st.screeningTime}</span>
                        <span className="badge bg-primary fs-6">${st.ticketPrice}</span>
                      </div>
                      <div className="text-muted small mb-2">
                        📅 Date: <strong>{st.screeningDate}</strong>
                      </div>
                      <div className="text-muted small mb-3">
                        💺 Seats Available:{' '}
                        <strong className={availableSeats > 5 ? 'text-success' : 'text-danger'}>
                          {availableSeats} / {st.totalSeats || 40}
                        </strong>
                      </div>
                      <button
                        onClick={() => navigate(`/showtimes/${st._id}/seats`)}
                        className="btn btn-outline-danger btn-sm mt-auto fw-semibold"
                        disabled={availableSeats <= 0}
                      >
                        {availableSeats > 0 ? 'Select Seats' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
