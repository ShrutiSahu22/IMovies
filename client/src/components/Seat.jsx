import React from 'react';

/**
 * Cinema Seat Component with realistic curved styling & states
 */
export default function Seat({ seat, isSelected, isHeldByMe, onToggle, disabled }) {
  const { label, number, status } = seat;

  let btnStyle = 'bg-[#151926] border-white/10 text-neutral-300 hover:border-rose-500 hover:bg-neutral-800 hover:scale-110 hover:shadow-lg hover:shadow-rose-950/40';
  let isDisabled = disabled;

  if (status === 'booked') {
    btnStyle = 'bg-neutral-900/60 border-transparent text-neutral-600 cursor-not-allowed opacity-30';
    isDisabled = true;
  } else if (isHeldByMe) {
    btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/60 font-bold scale-105 animate-pulse';
    isDisabled = disabled;
  } else if (status === 'held') {
    btnStyle = 'bg-amber-950/40 border-amber-800/40 text-amber-500/40 cursor-not-allowed opacity-50';
    isDisabled = true;
  } else if (isSelected) {
    btnStyle = 'bg-rose-600 border-rose-400 text-white shadow-xl shadow-rose-900/60 font-black scale-110';
  }

  return (
    <button
      type="button"
      aria-label={`Seat ${label}, ${status}${isSelected ? ', selected' : ''}${isHeldByMe ? ', held by you' : ''}`}
      disabled={isDisabled}
      onClick={() => onToggle(label)}
      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-xl rounded-b-md border text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 select-none ${btnStyle}`}
    >
      <span>{number}</span>
      {/* Tiny seat armrest indicators on sides */}
      <span className="absolute -left-[1px] bottom-1 w-[2px] h-2 bg-white/20 rounded-full pointer-events-none" />
      <span className="absolute -right-[1px] bottom-1 w-[2px] h-2 bg-white/20 rounded-full pointer-events-none" />
    </button>
  );
}
