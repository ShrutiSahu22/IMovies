import Movie from '../models/Movie.js';
import Showtime from '../models/Showtime.js';

export const seedSampleData = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount > 0) {
      // Data already seeded
      return;
    }

    console.log('Seeding initial sample movies and showtimes...');

    const sampleMovies = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
        genre: 'Sci-Fi / Thriller',
        duration: '148 min',
        releaseDate: '2010-07-16'
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
        genre: 'Sci-Fi / Adventure',
        duration: '169 min',
        releaseDate: '2014-11-07'
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
        genre: 'Action / Crime',
        duration: '152 min',
        releaseDate: '2008-07-18'
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the known universe.',
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        genre: 'Sci-Fi / Action',
        duration: '166 min',
        releaseDate: '2024-03-01'
      }
    ];

    const createdMovies = await Movie.insertMany(sampleMovies);

    // Create showtimes for each movie
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const sampleShowtimes = [];

    createdMovies.forEach((movie, index) => {
      // 3 showtimes per movie
      sampleShowtimes.push(
        {
          movie: movie._id,
          screeningDate: today,
          screeningTime: '14:30',
          ticketPrice: 12,
          totalSeats: 40,
          bookedSeats: index === 0 ? ['A1', 'A2', 'C4'] : []
        },
        {
          movie: movie._id,
          screeningDate: today,
          screeningTime: '18:00',
          ticketPrice: 15,
          totalSeats: 40,
          bookedSeats: index === 0 ? ['B3', 'B4'] : []
        },
        {
          movie: movie._id,
          screeningDate: tomorrow,
          screeningTime: '20:45',
          ticketPrice: 15,
          totalSeats: 40,
          bookedSeats: []
        }
      );
    });

    await Showtime.insertMany(sampleShowtimes);
    console.log('Sample movies and showtimes successfully seeded.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
