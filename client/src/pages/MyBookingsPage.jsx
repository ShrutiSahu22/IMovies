import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Building2,
  Film
} from 'lucide-react';
import { bookingApi } from '../api/bookingApi.js';
import { formatPrice, formatDate, formatTime } from '../utils/format.js';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { toast } from 'react-toastify';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation state
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    document.title = 'My Bookings — IMovies Cinema';
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeTab === 'upcoming' || activeTab === 'past') {
        params.type = activeTab;
      }
      const res = await bookingApi.getMyBookings(params);
      setBookings(res?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Booking Code copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await bookingApi.cancelBooking(cancellingBooking._id);
      toast.success(res?.message || 'Booking cancelled and refund initiated!');
      setCancellingBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Cancellation failed');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>PERSONAL DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            My Cinema Tickets
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Access your e-tickets, check cinema entry codes, or manage reservations
          </p>
        </div>

        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:scale-105 transition-all w-fit"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Book New Movie</span>
        </Link>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
        {[
          { id: 'all', label: 'All Bookings' },
          { id: 'upcoming', label: 'Upcoming Shows' },
          { id: 'past', label: 'Past Shows' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Bookings List ────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-3 border-rose-500/30 border-t-rose-500 animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading your cinema bookings...</p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={
            activeTab === 'all'
              ? "You haven't reserved any cinema tickets yet. Explore now showing blockbusters!"
              : `No ${activeTab} shows found in your reservation history.`
          }
          actionLabel="Explore Movies"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const show = booking.show;
            const movie = show?.movie;
            const theatre = show?.theatre;
            const isCancelled = booking.status === 'cancelled';
            const isConfirmed = booking.status === 'confirmed';
            const isPast = show?.startTime && new Date(show.startTime) < new Date();

            return (
              <div
                key={booking._id}
                className="relative rounded-3xl bg-[#0f121b] border border-white/[0.08] hover:border-white/[0.15] transition-all shadow-xl overflow-hidden flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="p-6 space-y-4">
                  {/* Status & Code Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isConfirmed
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                            : isCancelled
                            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {isConfirmed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span className="capitalize">{booking.status}</span>
                      </span>

                      {isPast && isConfirmed && (
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[10px] text-neutral-400">
                          Show Completed
                        </span>
                      )}
                    </div>

                    {booking.bookingCode && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {booking.bookingCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(booking.bookingCode, booking._id)}
                          className="p-1 rounded-md text-neutral-400 hover:text-white"
                          title="Copy Code"
                        >
                          {copiedId === booking._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Movie Info & Poster Card */}
                  <div className="flex gap-4">
                    <img
                      src={movie?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}
                      alt={movie?.title}
                      className="w-20 h-28 rounded-2xl object-cover shrink-0 shadow-md border border-white/[0.08]"
                    />

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <h3 className="font-bold text-base text-white truncate">
                        {movie?.title || 'Movie'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
                        <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{theatre?.name} • {show?.screenName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{formatDate(show?.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-neutral-200">{formatTime(show?.startTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Chips */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
                        Reserved Seats ({booking.seats.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.seats.map((seat) => (
                          <span
                            key={seat}
                            className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Total Paid
                      </span>
                      <span className="text-base font-black text-rose-400">
                        {formatPrice(booking.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative flex items-center justify-between border-t border-dashed border-white/10 px-6 py-3.5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/booking/${booking._id}/confirmation`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-rose-400" />
                      <span>View e-Ticket</span>
                    </Link>
                  </div>

                  {/* Cancellation Action (only for upcoming confirmed bookings) */}
                  {isConfirmed && !isPast && (
                    <button
                      type="button"
                      onClick={() => setCancellingBooking(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Cancel & Refund</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Cancel Confirmation Modal ─────────────────────────────────── */}
      {cancellingBooking && (
        <div
          onClick={() => setCancellingBooking(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#0f121b] border border-white/[0.1] p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white">Cancel Reservation?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to cancel your tickets for{' '}
                <strong className="text-white">
                  {cancellingBooking.show?.movie?.title || 'this movie'}
                </strong>
                ? Seats [
                <span className="text-rose-400 font-bold">
                  {cancellingBooking.seats.join(', ')}
                </span>
                ] will be released back to the auditorium immediately.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-xs space-y-2 text-neutral-300">
              <div className="flex justify-between">
                <span>Refund Amount:</span>
                <strong className="text-emerald-400 font-bold">
                  {formatPrice(cancellingBooking.amount)}
                </strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Refund Method:</span>
                <span>Original Payment Source (Instant reversal)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={cancelLoading}
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] font-semibold text-xs text-neutral-300 transition-colors"
              >
                Keep Tickets
              </button>

              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-xl shadow-rose-950/60 transition-all disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
