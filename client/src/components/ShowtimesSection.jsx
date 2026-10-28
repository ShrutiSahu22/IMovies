import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, MapPin, Sparkles, Tv, Clock } from 'lucide-react';
import DateTabs from './DateTabs.jsx';
import ShowtimeButton from './ShowtimeButton.jsx';
import EmptyState from './EmptyState.jsx';
import { useCity } from '../context/CityContext.jsx';
import { formatToYYYYMMDD } from '../utils/format.js';

export default function ShowtimesSection({ groupedTheatres = [], loading = false }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { selectedCity } = useCity();

  // Extract distinct future dates that actually have shows across all theatres
  const availableDates = useMemo(() => {
    const datesSet = new Set();
    groupedTheatres.forEach((group) => {
      group.shows?.forEach((show) => {
        const d = new Date(show.startTime);
        datesSet.add(formatToYYYYMMDD(d));
      });
    });
    return Array.from(datesSet).sort();
  }, [groupedTheatres]);

  const [selectedDate, setSelectedDate] = useState(() => availableDates[0] || '');

  // Synchronize initial date when data loads
  React.useEffect(() => {
    if (availableDates.length > 0 && (!selectedDate || !availableDates.includes(selectedDate))) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const handleShowtimeSelect = (showId) => {
    if (user) {
      navigate(`/shows/${showId}/seats`);
    } else {
      navigate('/login', { state: { from: `/shows/${showId}/seats` } });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-neutral-900 rounded-2xl w-64" />
        <div className="h-36 bg-neutral-900 rounded-3xl w-full" />
      </div>
    );
  }

  if (groupedTheatres.length === 0 || availableDates.length === 0) {
    return (
      <EmptyState
        title="No showtimes available"
        description={
          selectedCity
            ? `There are no scheduled shows in ${selectedCity}. Try selecting "All Cities" or another city from the top bar.`
            : 'No upcoming shows are currently scheduled for this movie.'
        }
      />
    );
  }

  // Filter shows by selected date for each theatre
  const theatresForDate = groupedTheatres
    .map((group) => {
      const filteredShows = (group.shows || []).filter((s) => {
        return formatToYYYYMMDD(s.startTime) === selectedDate;
      });
      return { ...group, shows: filteredShows };
    })
    .filter((group) => group.shows.length > 0);

  return (
    <div className="space-y-6">
      {/* Date Selection Header */}
      <div className="p-6 rounded-3xl bg-[#0f121b] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Select Screening Date</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Available Showtimes
          </h2>
        </div>

        <DateTabs
          dates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Theatres and Showtimes List */}
      {theatresForDate.length === 0 ? (
        <EmptyState
          title="No shows on this date"
          description="Please choose another date or city from above to view available showtimes."
        />
      ) : (
        <div className="space-y-4">
          {theatresForDate.map((group) => (
            <div
              key={group.theatre._id}
              className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg"
            >
              {/* Theatre details */}
              <div className="space-y-2 lg:max-w-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {group.theatre.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {group.theatre.address}, {group.theatre.city}
                  </span>
                </div>

                {/* Amenities pills */}
                {group.theatre.amenities && group.theatre.amenities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {group.theatre.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] font-medium text-neutral-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Showtimes buttons */}
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {group.shows.map((show) => (
                  <ShowtimeButton
                    key={show._id}
                    show={show}
                    onSelect={handleShowtimeSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
