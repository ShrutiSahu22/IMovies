import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MyBookings({ user }) {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getMyBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve your bookings.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Bookings</h2>
          <p className="text-muted mb-0">Manage and view your cinema ticket reservations</p>
        </div>
        <Link to="/" className="btn btn-outline-danger btn-sm">
          + Book New Movie
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading bookings...</span>
          </div>
          <p className="mt-2 text-muted">Retrieving your bookings...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchBookings}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="card border-0 shadow-sm p-5 text-center my-4">
          <h4 className="fw-bold mb-2">No Bookings Found</h4>
          <p className="text-muted mb-4">
            You have not booked any tickets yet. Explore our movies now!
          </p>
          <div>
            <Link to="/" className="btn btn-danger">
              Browse Movies
            </Link>
          </div>
        </div>
      )}

      <div className="row g-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="col-12 col-md-6 col-lg-6">
            <div className="card h-100 border-0 shadow-sm overflow-hidden">
              <div className="row g-0 h-100">
                <div className="col-4 bg-dark">
                  <img
                    src={booking.movie?.poster}
                    alt={booking.movie?.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', minHeight: '180px' }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="col-8">
                  <div className="card-body p-3 d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h5 className="card-title fw-bold mb-0 text-truncate">
                        {booking.movie?.title}
                      </h5>
                      <span className="badge bg-success">Confirmed</span>
                    </div>

                    <div className="text-muted small mb-2 font-monospace">
                      ID: {booking._id.slice(-8)}
                    </div>

                    <div className="small text-secondary mb-2">
                      <div>
                        📅 <strong>{booking.showtime?.screeningDate}</strong> at{' '}
                        <strong>{booking.showtime?.screeningTime}</strong>
                      </div>
                      <div className="mt-1">
                        💺 Seats:{' '}
                        {booking.seats?.map((seat) => (
                          <span key={seat} className="badge bg-primary me-1">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted">
                        Booked: {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                      <span className="fw-bold text-danger fs-6">${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
