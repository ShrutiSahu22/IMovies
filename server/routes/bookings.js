import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// POST /api/bookings - Create a reservation (Protected)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    // Validate showtimeId
    if (!showtimeId || !mongoose.Types.ObjectId.isValid(showtimeId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid showtime ID is required.'
      });
    }

    // Validate seats
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to book.'
      });
    }

    // Validate seat formats and eliminate internal duplicates
    const seatPattern = /^[A-E][1-8]$/;
    const sanitizedSeats = [...new Set(seats.map(s => String(s).trim().toUpperCase()))];

    for (const seat of sanitizedSeats) {
      if (!seatPattern.test(seat)) {
        return res.status(400).json({
          success: false,
          message: `Invalid seat format: "${seat}". Valid seats range from A1 to E8.`
        });
      }
    }

    // Check showtime existence
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Selected showtime does not exist.'
      });
    }

    // Atomic update: only book if none of the requested seats are already booked
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        bookedSeats: { $nin: sanitizedSeats }
      },
      {
        $push: { bookedSeats: { $each: sanitizedSeats } }
      },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats are already booked. Please select different seats.'
      });
    }

    const ticketPrice = showtime.ticketPrice || 12;
    const totalAmount = sanitizedSeats.length * ticketPrice;

    // Persist booking record
    const booking = await Booking.create({
      user: req.user._id,
      showtime: showtime._id,
      movie: showtime.movie,
      seats: sanitizedSeats,
      totalAmount,
      bookingStatus: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster duration genre')
      .populate('showtime', 'screeningDate screeningTime ticketPrice')
      .populate('user', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully.',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing booking.'
    });
  }
});

// GET /api/bookings/my - Retrieve current user's bookings (Protected)
router.get('/my', authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster duration genre')
      .populate('showtime', 'screeningDate screeningTime ticketPrice')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.'
    });
  }
});

export default router;
