import React from 'react';
import { formatTime, formatPrice } from '../utils/format.js';

export default function ShowtimeButton({ show, onSelect }) {
  const isAvailable = show.availableSeats === undefined || show.availableSeats > 20;
  const isFillingFast = show.availableSeats !== undefined && show.availableSeats <= 20 && show.availableSeats > 0;
  const isSoldOut = show.availableSeats !== undefined && show.availableSeats === 0;

  return (
    <button
      type="button"
      disabled={isSoldOut}
      onClick={() => onSelect(show._id)}
      className="group relative flex flex-col items-start px-4 py-2.5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] hover:border-rose-500/60 hover:bg-neutral-900/90 hover:shadow-lg hover:shadow-rose-950/30 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
          {formatTime(show.startTime)}
        </span>
        {show.format && (
          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-bold text-rose-300 border border-white/[0.08]">
            {show.format}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
        <span className="text-emerald-400 font-bold">{formatPrice(show.price)}</span>
        <span>•</span>
        <span className="text-neutral-400 font-medium">{show.screenName || 'Audi 1'}</span>
        <span>•</span>
        <span
          className={`font-semibold ${
            isSoldOut
              ? 'text-rose-500'
              : isFillingFast
              ? 'text-amber-400'
              : 'text-emerald-400/90'
          }`}
        >
          {isSoldOut ? 'Sold Out' : isFillingFast ? 'Filling Fast' : 'Available'}
        </span>
      </div>
    </button>
  );
}
