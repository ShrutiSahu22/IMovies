import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function SeatSelection({ user }) {
  const { id: showtimeId } = useParams();
  const navigate = useNavigate();

  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    fetchSeatAvailability();
  }, [showtimeId]);

  const fetchSeatAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      setConflictError('');
      const response = await api.getShowtimeSeats(showtimeId);
      setSeatData(response.data);
      // Remove any previously selected seats that might now be booked
      const booked = new Set(response.data.bookedSeats || []);
      setSelectedSeats((prev) => prev.filter((s) => !booked.has(s)));
    } catch (err) {
      setError(err.message || 'Failed to fetch seat layout.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatId) => {
    if (!seatData) return;
    const isBooked = seatData.bookedSeats?.includes(seatId);
    if (isBooked) return;

    if (conflictError) setConflictError('');

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to book.');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: `/showtimes/${showtimeId}/seats` } });
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      setConflictError('');
      const response = await api.createBooking(showtimeId, selectedSeats);
      // Navigate to confirmation page
      navigate('/booking-confirmation', { state: { booking: response.data } });
    } catch (err) {
      if (err.status === 409) {
        setConflictError(
          err.message ||
            'One or more selected seats were just booked by another user. Seat availability has been refreshed.'
        );
        // Refresh availability on conflict
        fetchSeatAvailability();
      } else {
        setError(err.message || 'Failed to complete booking. Please try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading seats...</span>
        </div>
        <p className="mt-2 text-muted">Loading seat layout and current availability...</p>
      </div>
    );
  }

  if (error && !seatData) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <p className="mb-2">{error}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchSeatAvailability}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { movie, screeningDate, screeningTime, ticketPrice, rows, seatsPerRow, bookedSeats } =
    seatData;
  const bookedSet = new Set(bookedSeats || []);
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <div className="container py-4">
      {/* Navigation breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              Movies
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/movies/${movie?._id}`} className="text-decoration-none">
              {movie?.title}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Select Seats
          </li>
        </ol>
      </nav>

      {/* Movie & Showtime Summary Header */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1 text-dark">{movie?.title}</h4>
            <div className="text-muted small">
              <span className="me-3">📅 {screeningDate}</span>
              <span className="me-3">🕒 {screeningTime}</span>
              <span>💵 ${ticketPrice} per ticket</span>
            </div>
          </div>
          <button
            onClick={fetchSeatAvailability}
            className="btn btn-sm btn-outline-secondary mt-2 mt-sm-0"
            title="Refresh availability"
          >
            🔄 Refresh Seats
          </button>
        </div>
      </div>

      {conflictError && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Seat Conflict:</strong> {conflictError}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 small" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Cinema Seat Grid */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4 text-center">
            {/* Screen representation */}
            <div className="cinema-screen-container">
              <div className="cinema-screen">Screen</div>
            </div>

            {/* Seat Map */}
            <div className="seat-grid my-3">
              {rows.map((row) => (
                <div key={row} className="seat-row">
                  <div className="seat-row-label">{row}</div>
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isBooked = bookedSet.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    let seatClass = 'seat-btn available';
                    if (isBooked) seatClass = 'seat-btn booked';
                    else if (isSelected) seatClass = 'seat-btn selected';

                    return (
                      <button
                        key={seatId}
                        className={seatClass}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        title={
                          isBooked
                            ? `Seat ${seatId} (Booked)`
                            : isSelected
                            ? `Seat ${seatId} (Selected)`
                            : `Seat ${seatId} (Available)`
                        }
                      >
                        {seatId}
                      </button>
                    );
                  })}
                  <div className="seat-row-label">{row}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="d-flex justify-content-center gap-4 mt-4 pt-3 border-top flex-wrap">
              <div className="seat-legend-item">
                <span className="seat-legend-box bg-white"></span>
                <span>Available</span>
              </div>
              <div className="seat-legend-item">
                <span className="seat-legend-box bg-primary"></span>
                <span>Selected</span>
              </div>
              <div className="seat-legend-item">
                <span className="seat-legend-box bg-secondary"></span>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Booking Summary</h5>

            <div className="mb-3">
              <div className="text-muted small">Movie</div>
              <div className="fw-semibold">{movie?.title}</div>
            </div>

            <div className="mb-3">
              <div className="text-muted small">Date & Time</div>
              <div className="fw-semibold">
                {screeningDate} at {screeningTime}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-muted small">Selected Seats</div>
              <div className="fw-bold text-primary fs-5">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
              </div>
            </div>

            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>Tickets ({selectedSeats.length}x)</span>
              <span>${totalPrice}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-4 text-danger">${totalPrice}</span>
            </div>

            {!user && selectedSeats.length > 0 && (
              <div className="alert alert-info py-2 small mb-3">
                You will be prompted to log in or register before confirming your booking.
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              className="btn btn-danger w-100 py-2 fw-semibold"
            >
              {bookingLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Confirming Reservation...
                </>
              ) : user ? (
                'Confirm Booking'
              ) : (
                'Sign In to Book'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
