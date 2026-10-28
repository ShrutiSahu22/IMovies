import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    screeningDate: {
      type: String,
      required: [true, 'Screening date is required']
    },
    screeningTime: {
      type: String,
      required: [true, 'Screening time is required']
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 12
    },
    totalSeats: {
      type: Number,
      default: 40
    },
    bookedSeats: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index to quickly search showtimes by movie
showtimeSchema.index({ movie: 1, screeningDate: 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;
