import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /api/movies - List all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve movies.'
    });
  }
});

// GET /api/movies/:id - Get movie details
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve movie details.'
    });
  }
});

export default router;
