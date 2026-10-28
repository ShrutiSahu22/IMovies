/**
 * IMovies Automated End-to-End Test Suite
 * Validates all 6 core functional areas and critical booking logic.
 */
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB, closeDB } from './config/db.js';
import { seedSampleData } from './config/seed.js';

let serverInstance;
let baseUrl;

const runTests = async () => {
  console.log('====================================================');
  console.log('       IMOVIES AUTOMATED SYSTEM VERIFICATION        ');
  console.log('====================================================\n');

  try {
    // 1. Connect DB and seed
    console.log('[Setup] Connecting to database...');
    await connectDB();
    await seedSampleData();

    // Start server on an ephemeral test port
    await new Promise((resolve) => {
      serverInstance = app.listen(0, () => {
        const port = serverInstance.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        console.log(`[Setup] Test server running on ${baseUrl}\n`);
        resolve();
      });
    });

    let passedTests = 0;
    const assert = (condition, testName) => {
      if (!condition) {
        throw new Error(`TEST FAILED: ${testName}`);
      }
      passedTests++;
      console.log(`  ✓ ${testName}`);
    };

    // Helper fetch wrapper
    const apiCall = async (endpoint, options = {}) => {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      const data = await res.json().catch(() => ({}));
      return { status: res.status, data };
    };

    console.log('--- TEST GROUP 1: Health & System Initialization ---');
    const health = await apiCall('/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health returns 200 and status ok');

    console.log('\n--- TEST GROUP 2: Authentication & Security ---');
    const testEmail1 = `user1_${Date.now()}@test.com`;
    const testEmail2 = `user2_${Date.now()}@test.com`;

    // Registration User 1
    const regUser1 = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice Test', email: testEmail1, password: 'password123' })
    });
    assert(regUser1.status === 201 && regUser1.data.token, 'POST /api/auth/register registers user and returns JWT');
    const token1 = regUser1.data.token;

    // Duplicate registration should fail
    const dupReg = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice Clone', email: testEmail1, password: 'password123' })
    });
    assert(dupReg.status === 400, 'POST /api/auth/register rejects duplicate email with 400 Bad Request');

    // Registration User 2
    const regUser2 = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bob Test', email: testEmail2, password: 'password123' })
    });
    assert(regUser2.status === 201 && regUser2.data.token, 'POST /api/auth/register registers second user');
    const token2 = regUser2.data.token;

    // Login with valid credentials
    const loginSuccess = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail1, password: 'password123' })
    });
    assert(loginSuccess.status === 200 && loginSuccess.data.token, 'POST /api/auth/login authenticates valid user');

    // Login with invalid credentials
    const loginFail = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail1, password: 'wrongpassword' })
    });
    assert(loginFail.status === 401, 'POST /api/auth/login rejects wrong credentials with 401');

    console.log('\n--- TEST GROUP 3: Movie Browsing & Details ---');
    const moviesRes = await apiCall('/movies');
    assert(moviesRes.status === 200 && moviesRes.data.data.length > 0, 'GET /api/movies lists movies from MongoDB');
    const testMovie = moviesRes.data.data[0];

    const movieDetail = await apiCall(`/movies/${testMovie._id}`);
    assert(movieDetail.status === 200 && movieDetail.data.data.title === testMovie.title, 'GET /api/movies/:id returns movie details');

    console.log('\n--- TEST GROUP 4: Showtime Listing & Seat Availability ---');
    const showtimesRes = await apiCall(`/showtimes?movieId=${testMovie._id}`);
    assert(showtimesRes.status === 200 && showtimesRes.data.data.length > 0, 'GET /api/showtimes?movieId=:id lists showtimes');
    const testShowtime = showtimesRes.data.data[0];

    const seatsRes = await apiCall(`/showtimes/${testShowtime._id}/seats`);
    assert(seatsRes.status === 200 && Array.isArray(seatsRes.data.data.bookedSeats), 'GET /api/showtimes/:id/seats retrieves seats & layout');

    console.log('\n--- TEST GROUP 5: Protected Booking & Concurrency Conflict Logic ---');
    // Unauthorized attempt
    const unauthBooking = await apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify({ showtimeId: testShowtime._id, seats: ['D1', 'D2'] })
    });
    assert(unauthBooking.status === 401, 'POST /api/bookings blocks unauthorized requests without JWT');

    // User 1 successfully books seats D1, D2
    const user1Booking = await apiCall('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` },
      body: JSON.stringify({ showtimeId: testShowtime._id, seats: ['D1', 'D2'] })
    });
    assert(user1Booking.status === 201 && user1Booking.data.data.seats.includes('D1'), 'User 1 successfully reserves available seats D1, D2');

    // User 2 attempts to book seats D2, D3 (Seat conflict on D2!)
    const conflictBooking = await apiCall('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ showtimeId: testShowtime._id, seats: ['D2', 'D3'] })
    });
    assert(conflictBooking.status === 409, 'User 2 booking conflicting seat D2 is rejected with 409 Conflict');

    // User 2 books non-conflicting seats D3, D4
    const user2ValidBooking = await apiCall('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ showtimeId: testShowtime._id, seats: ['D3', 'D4'] })
    });
    assert(user2ValidBooking.status === 201, 'User 2 successfully books available seats D3, D4');

    console.log('\n--- TEST GROUP 6: Booking Confirmation & Strict Ownership ---');
    // User 1 booking history
    const user1History = await apiCall('/bookings/my', {
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(
      user1History.status === 200 &&
      user1History.data.data.length === 1 &&
      user1History.data.data[0].seats.includes('D1'),
      'User 1 retrieves their own booking history containing D1, D2'
    );

    // User 2 booking history
    const user2History = await apiCall('/bookings/my', {
      headers: { Authorization: `Bearer ${token2}` }
    });
    assert(
      user2History.status === 200 &&
      user2History.data.data.length === 1 &&
      user2History.data.data[0].seats.includes('D3') &&
      !user2History.data.data[0].seats.includes('D1'),
      'User 2 only sees their own bookings; user isolation strictly enforced'
    );

    console.log('\n====================================================');
    console.log(`ALL ${passedTests} TESTS PASSED SUCCESSFULLY!`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('\nTest Suite Error:', error);
    process.exit(1);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await closeDB();
    process.exit(0);
  }
};

runTests();
