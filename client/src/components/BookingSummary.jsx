import React from 'react';
import { Armchair, ArrowRight, XCircle, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { formatPrice, formatTime, formatDate } from '../utils/format.js';
import HoldTimer from './HoldTimer.jsx';

export default function BookingSummary({
  show,
  selectedSeats = [],
  price = 0,
  isHeldMode = false,
  heldBooking = null,
  serverOffsetMs = 0,
  loadingHold = false,
  onHoldSeats,
  onReleaseHold,
  onProceedPayment,
  onTimerExpire,
}) {
  const count = isHeldMode ? heldBooking?.seats?.length || selectedSeats.length : selectedSeats.length;

  // Amount: preview based on count * price, or the authoritative server amount once held
  const displayAmount = isHeldMode && heldBooking?.amount !== undefined
    ? heldBooking.amount
    : count * price;

  const seatsList = isHeldMode ? heldBooking?.seats || selectedSeats : selectedSeats;

  return (
    <div className="p-6 rounded-3xl bg-[#0f121b] border border-white/[0.08] shadow-2xl space-y-6">
      {/* Show & Movie Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Booking Summary</span>
        </div>
        <h3 className="font-black text-xl text-white line-clamp-1">{show?.movie?.title}</h3>
        <p className="text-xs text-neutral-300 font-medium">
          {show?.theatre?.name} • <span className="text-rose-400">{show?.screenName}</span>
        </p>
        <p className="text-xs text-neutral-400">
          {formatDate(show?.startTime)} at <strong className="text-white">{formatTime(show?.startTime)}</strong>
        </p>
      </div>

      {/* Selected Seats Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
          <span className="flex items-center gap-1.5">
            <Armchair className="w-4 h-4 text-rose-500" />
            {isHeldMode ? 'Held Seats' : 'Selected Seats'} ({count})
          </span>
          {isHeldMode && heldBooking?.holdExpiresAt && (
            <HoldTimer
              expiresAt={heldBooking.holdExpiresAt}
              serverOffsetMs={serverOffsetMs}
              onExpire={onTimerExpire}
            />
          )}
        </div>

        {seatsList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {seatsList.map((label) => (
              <span
                key={label}
                className="px-3 py-1 rounded-xl bg-black/50 border border-rose-500/40 text-xs font-black text-rose-400 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic">No seats selected yet</p>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="pt-3 border-t border-white/[0.08] space-y-2 text-xs">
        <div className="flex justify-between text-neutral-400">
          <span>Tickets ({count} × {formatPrice(price)})</span>
          <span className="text-neutral-200 font-medium">{formatPrice(displayAmount)}</span>
        </div>

        <div className="flex justify-between text-neutral-400">
          <span>Convenience Fee & GST</span>
          <span className="text-emerald-400 font-medium">Included</span>
        </div>

        <div className="flex justify-between items-center text-lg font-black text-white pt-3 border-t border-white/[0.08]">
          <span>Total Payable</span>
          <span className="text-rose-400 text-xl font-black">{formatPrice(displayAmount)}</span>
        </div>
        {isHeldMode && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Seats securely locked on server for you</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-2.5">
        {!isHeldMode ? (
          <button
            type="button"
            disabled={count === 0 || loadingHold}
            onClick={onHoldSeats}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm text-white shadow-xl shadow-rose-950/60 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {loadingHold ? (
              <span>Locking Seats...</span>
            ) : (
              <>
                <span>Lock Seats (5-Min Hold)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onProceedPayment}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 font-bold text-sm text-white shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onReleaseHold}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-semibold text-xs text-neutral-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Release Seats</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
