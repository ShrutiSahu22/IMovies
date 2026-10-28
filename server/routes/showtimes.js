import express from 'express';
import Showtime from '../models/Showtime.js';

const router = express.Router();

const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const DEFAULT_SEATS_PER_ROW = 8;

// GET /api/showtimes?movieId=:id - List showtimes for a movie
router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;
    const query = movieId ? { movie: movieId } : {};
    const showtimes = await Showtime.find(query)
      .populate('movie', 'title poster')
      .sort({ screeningDate: 1, screeningTime: 1 });

    return res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve showtimes.'
    });
  }
});

// GET /api/showtimes/:id/seats - Retrieve seat availability for a showtime
router.get('/:id/seats', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie', 'title poster duration');
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found.'
      });
    }

    const totalSeats = showtime.totalSeats || 40;
    const bookedSeats = showtime.bookedSeats || [];
    const availableSeatsCount = Math.max(0, totalSeats - bookedSeats.length);

    return res.status(200).json({
      success: true,
      data: {
        showtimeId: showtime._id,
        movie: showtime.movie,
        screeningDate: showtime.screeningDate,
        screeningTime: showtime.screeningTime,
        ticketPrice: showtime.ticketPrice,
        totalSeats,
        rows: DEFAULT_ROWS,
        seatsPerRow: DEFAULT_SEATS_PER_ROW,
        bookedSeats,
        availableSeatsCount
      }
    });
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve seat availability.'
    });
  }
});

export default router;
