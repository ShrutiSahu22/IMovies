const API_BASE = '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('imovies_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic request wrapper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  // Movies
  getMovies: () => request('/movies'),
  getMovieById: (id) => request(`/movies/${id}`),

  // Showtimes
  getShowtimesByMovie: (movieId) => request(`/showtimes?movieId=${movieId}`),
  getShowtimeSeats: (showtimeId) => request(`/showtimes/${showtimeId}/seats`),

  // Bookings
  createBooking: (showtimeId, seats) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify({ showtimeId, seats })
    }),

  getMyBookings: () => request('/bookings/my'),

  // Health
  checkHealth: () => request('/health')
};

export default api;
