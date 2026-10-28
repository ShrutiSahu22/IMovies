import React from 'react';
import Seat from './Seat.jsx';

export default function SeatGrid({
  seats = [],
  selectedSeats = [],
  heldSeats = [],
  onToggleSeat,
  isHeldMode = false,
}) {
  // Group seats by row letter
  const rowsMap = new Map();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.row)) {
      rowsMap.set(seat.row, []);
    }
    rowsMap.get(seat.row).push(seat);
  });

  // Sort rows A to Z, and seats in row by number 1..N
  const sortedRowLetters = Array.from(rowsMap.keys()).sort();
  sortedRowLetters.forEach((rowLetter) => {
    rowsMap.get(rowLetter).sort((a, b) => a.number - b.number);
  });

  return (
    <div className="w-full space-y-10 select-none">
      {/* Cinema Screen Curve Indicator with projection beam */}
      <div className="relative flex flex-col items-center justify-center max-w-2xl mx-auto px-4">
        {/* Ambient Projector Light cone */}
        <div className="w-3/4 h-12 bg-gradient-to-b from-rose-500/15 via-white/[0.04] to-transparent rounded-t-[120px] blur-sm pointer-events-none" />

        {/* Curved Screen Edge */}
        <div className="w-full h-3 rounded-t-[140px] bg-gradient-to-r from-neutral-800 via-rose-500 to-neutral-800 shadow-xl shadow-rose-500/30" />
        
        <div className="flex items-center gap-2 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
            CINEMA CURVED SCREEN • ALL EYES THIS WAY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        </div>
      </div>

      {/* Horizontally scrollable seat matrix */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-neutral-800">
        <div className="inline-block min-w-full flex flex-col items-center gap-3 px-4">
          {sortedRowLetters.map((rowLetter, index) => {
            const rowSeats = rowsMap.get(rowLetter) || [];
            // Section divider for tiers
            const isReclinerRow = index < 2;

            return (
              <React.Fragment key={rowLetter}>
                {index === 2 && (
                  <div className="w-full max-w-xl my-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    <div className="flex-1 border-b border-white/[0.08]" />
                    <span>Prime Executive Seating</span>
                    <div className="flex-1 border-b border-white/[0.08]" />
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Left Row Label */}
                  <span className="w-5 text-center text-xs font-black text-neutral-400">
                    {rowLetter}
                  </span>

                  {/* Seats in Row */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.label);
                      const isHeldByMe = isHeldMode
                        ? heldSeats.includes(seat.label)
                        : seat.isMine;

                      return (
                        <Seat
                          key={seat.label}
                          seat={seat}
                          isSelected={isSelected}
                          isHeldByMe={isHeldByMe}
                          disabled={isHeldMode}
                          onToggle={onToggleSeat}
                        />
                      );
                    })}
                  </div>

                  {/* Right Row Label */}
                  <span className="w-5 text-center text-xs font-black text-neutral-400">
                    {rowLetter}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
