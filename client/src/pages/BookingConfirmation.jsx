import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '540px' }}>
          <h3 className="fw-bold mb-3">No Recent Booking</h3>
          <p className="text-muted mb-4">
            It looks like you navigated here directly or your session refreshed.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/my-bookings" className="btn btn-outline-danger">
              View My Bookings
            </Link>
            <Link to="/" className="btn btn-danger">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { _id, movie, showtime, seats, totalAmount, bookingStatus, createdAt } = booking;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow p-4 text-center">
            {/* Success Icon */}
            <div className="mb-3">
              <span
                className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: '64px', height: '64px', fontSize: '28px' }}
              >
                ✓
              </span>
            </div>

            <h2 className="fw-bold text-success mb-1">Booking Confirmed!</h2>
            <p className="text-muted small mb-4">
              Your tickets have been successfully reserved and saved.
            </p>

            {/* Ticket Card */}
            <div className="card bg-light border p-3 text-start mb-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <span className="text-muted small">Booking Reference</span>
                <span className="badge bg-secondary font-monospace">{_id}</span>
              </div>

              <div className="mb-3">
                <h5 className="fw-bold mb-1 text-dark">{movie?.title}</h5>
                <span className="badge bg-dark me-2">{movie?.genre || 'Cinema'}</span>
                <span className="badge bg-secondary">{movie?.duration || 'Standard'}</span>
              </div>

              <div className="row g-2 mb-3 small">
                <div className="col-6">
                  <span className="text-muted d-block">Screening Date:</span>
                  <strong>{showtime?.screeningDate}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Showtime:</span>
                  <strong>{showtime?.screeningTime}</strong>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-muted small d-block mb-1">Reserved Seats:</span>
                <div className="d-flex flex-wrap gap-1">
                  {seats.map((seat) => (
                    <span key={seat} className="badge bg-primary fs-6 px-2 py-1">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="fw-semibold">Total Paid:</span>
                <span className="fw-bold fs-5 text-danger">${totalAmount}</span>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/my-bookings" className="btn btn-outline-dark fw-semibold">
                Go to My Bookings
              </Link>
              <Link to="/" className="btn btn-danger fw-semibold">
                Book Another Movie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
