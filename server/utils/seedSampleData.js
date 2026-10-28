/**
 * Seed Sample Data — safe to re-run.
 * Creates 5 movies, 2 theatres, and shows starting from today.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';

const MOVIES = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['English', 'Hindi'],
    duration: 152,
    certificate: 'UA',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    releaseDate: new Date('2008-07-18'),
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival across distant galaxies.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 169,
    certificate: 'UA',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    releaseDate: new Date('2014-11-07'),
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil'],
    duration: 148,
    certificate: 'UA',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    releaseDate: new Date('2010-07-16'),
  },
  {
    title: 'Avengers: Endgame',
    description: 'After devastating events wipe out half the universe, the Avengers assemble once more to reverse Thanos\' actions and restore cosmic balance.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 181,
    certificate: 'UA',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    rating: 8.4,
    releaseDate: new Date('2019-04-26'),
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 166,
    certificate: 'UA',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.6,
    releaseDate: new Date('2024-03-01'),
  },
];

const THEATRES = [
  {
    name: 'PVR ICON Gold Cinema',
    city: 'Mumbai',
    address: 'Phoenix Palladium, Lower Parel, Mumbai 400013',
    amenities: ['IMAX Laser', 'Dolby Atmos', 'Recliner VIP Seats', 'Gourmet Lounge', 'Valet Parking'],
    screens: [
      { name: 'IMAX Screen 1', rows: 8, seatsPerRow: 14 },
      { name: 'Dolby Screen 2', rows: 7, seatsPerRow: 12 },
    ],
  },
  {
    name: 'INOX Megaplex',
    city: 'Bangalore',
    address: 'Forum South Mall, Koramangala, Bangalore 560095',
    amenities: ['Dolby Atmos 7.1', '4DX Motion', 'Push Back Seats', 'Cafeteria'],
    screens: [
      { name: 'Screen A (4DX)', rows: 8, seatsPerRow: 16 },
      { name: 'Screen B (Atmos)', rows: 6, seatsPerRow: 12 },
    ],
  },
  {
    name: 'Cinepolis Luxury Cinema',
    city: 'Delhi NCR',
    address: 'DLF Avenue, Saket, New Delhi 110017',
    amenities: ['VIP Recliner', 'Laser 4K', 'Dolby Sound', 'In-seat Service'],
    screens: [
      { name: 'Audi 1 (Laser 4K)', rows: 7, seatsPerRow: 14 },
      { name: 'Audi 2', rows: 6, seatsPerRow: 10 },
    ],
  },
];

const futureDate = (daysFromNow, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export const seedSampleData = async (isStandalone = false) => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount > 0) {
      console.log(`ℹ️  Sample data already exists (${movieCount} movies found).`);
      if (isStandalone) {
        await mongoose.disconnect();
        process.exit(0);
      }
      return;
    }

    const movies = await Movie.insertMany(MOVIES);
    console.log(`✅ Inserted ${movies.length} movies`);

    const theatres = await Theatre.insertMany(THEATRES);
    console.log(`✅ Inserted ${theatres.length} theatres`);

    const [pvr, inox, cinepolis] = theatres;
    const [darkKnight, interstellar, inception, endgame, dune] = movies;

    const makeShow = (movie, theatre, screenName, language, daysFromNow, hour, price) => {
      const startTime = futureDate(daysFromNow, hour);
      const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);
      return {
        movie: movie._id,
        theatre: theatre._id,
        screenName,
        language,
        format: screenName.includes('IMAX') ? 'IMAX 3D' : screenName.includes('4DX') ? '4DX' : '2D',
        startTime,
        endTime,
        price,
        totalSeats: 112,
        availableSeats: 112,
      };
    };

    const showDocs = [
      // Today & tomorrow shows
      makeShow(darkKnight, pvr, 'IMAX Screen 1', 'English', 0, 18, 350),
      makeShow(interstellar, pvr, 'IMAX Screen 1', 'English', 0, 21, 380),
      makeShow(inception, pvr, 'Dolby Screen 2', 'English', 0, 19, 260),
      makeShow(endgame, inox, 'Screen A (4DX)', 'Hindi', 0, 20, 390),
      makeShow(dune, cinepolis, 'Audi 1 (Laser 4K)', 'English', 0, 19, 320),

      makeShow(darkKnight, pvr, 'IMAX Screen 1', 'Hindi', 1, 14, 300),
      makeShow(interstellar, pvr, 'IMAX Screen 1', 'English', 1, 18, 380),
      makeShow(dune, pvr, 'Dolby Screen 2', 'English', 1, 16, 280),
      makeShow(endgame, inox, 'Screen A (4DX)', 'English', 1, 15, 400),
      makeShow(inception, inox, 'Screen B (Atmos)', 'English', 1, 18, 250),

      makeShow(dune, cinepolis, 'Audi 1 (Laser 4K)', 'Hindi', 2, 17, 300),
      makeShow(interstellar, cinepolis, 'Audi 2', 'English', 2, 20, 280),
      makeShow(darkKnight, inox, 'Screen B (Atmos)', 'English', 3, 19, 260),
    ];

    const shows = await Show.insertMany(showDocs);
    console.log(`✅ Inserted ${shows.length} shows scheduled across cities.`);
  } catch (err) {
    console.error('Seed sample data error:', err.message);
    if (isStandalone) process.exit(1);
  }

  if (isStandalone) {
    await mongoose.disconnect();
    process.exit(0);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedSampleData.js')) {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
  await seedSampleData(true);
}
