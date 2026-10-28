# 🎬 IMovies — Next-Gen Cinema Ticket Booking Web Application

A full-stack, production-grade cinema ticketing platform built with **React 18**, **Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB**, **Socket.io**, and **JWT**.

Features a cinematic UI, interactive seating maps with curved auditorium screen, real-time 5-minute seat holds via WebSockets, one-click demo login, personal ticket dashboard with cancellation & instant refunds, and admin management console.

---

## ⚡ Zero-Error Run in Visual Studio Code

### Method 1: One-Click Terminal Run (Root)
From the root `IMovies-local` directory:

```bash
npm run dev
```

Both Backend API (`http://localhost:5001`) and Frontend Web (`http://localhost:5173`) will launch concurrently in your terminal.

### Method 2: VS Code Run & Debug
1. Open `IMovies-local` in **VS Code**.
2. Press `F5` (or click **Run and Debug** in the side pane).
3. Select **"🎬 Launch IMovies (Full-Stack Dev)"**.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Demo Moviegoer** | `user@imovies.dev` | `User@1234` | Browse, select seats, book tickets, view e-tickets, cancel & refund |
| **Cinema Admin** | `admin@imovies.dev` | `Admin@1234` | Manage movies, auditoriums, showtimes, user accounts, and financial reports |

*(You can also click the **⚡ One-Click Demo Login** buttons on the Sign In page for instant access!)*

---

## 🚀 Key Features & UI Improvements

1. **Cinematic Dark Design Language**:
   - Deep obsidian/charcoal background (`#08090d`), ambient glassmorphism (`backdrop-blur-xl`), vibrant crimson red and gold accents.
2. **Interactive Auditorium Seating Map**:
   - Silver curved cinema screen projection cone.
   - Tiered seating: Recliner VIP, Prime Executive, and Standard Club.
   - Real-time seat status indicators: Available, Selected (Crimson Glow), Held by You (Pulsing Emerald), Held by others (Amber Lock), Booked (Muted).
   - Live 5-minute countdown hold timer synced across clients via WebSockets.
3. **Comprehensive Movie Search & Multi-Facet Filtering**:
   - Instant search input with debouncing.
   - Genre pills (Action, Sci-Fi, Drama, Adventure, Crime, Comedy, Thriller).
   - Language selector (English, Hindi, Tamil, Telugu).
   - Active filters counter with one-click reset.
4. **Interactive Movie Details & Showtimes**:
   - High-impact widescreen backdrop banner with trailer video player modal.
   - Date selector tabs (e.g., "Today 28 Oct", "Tomorrow 29 Oct").
   - Grouped theatres with address, amenities (IMAX, Dolby Atmos, VIP Recliner), and seat availability chips.
5. **Frictionless Checkout & Digital Boarding Pass Ticket**:
   - Transparent price breakdown (ticket fare, convenience fee, GST).
   - Simulated instant payment for zero-configuration local evaluation + real Razorpay support.
   - Printable cinema ticket boarding pass with QR code and booking reference.
6. **My Bookings Dashboard (`/my-bookings`)**:
   - Filter tickets by "All", "Upcoming", or "Past".
   - View e-Ticket modal.
   - Cancel booking button with instant refund reversal.
7. **Admin Management Console (`/admin`)**:
   - Analytics dashboard with revenue charts and occupancy metrics.
   - Full CRUD operations for Movies, Theatres, Screens, and Shows.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Redux Toolkit, React Router v7, Lucide Icons, React Toastify.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, Helmet, Compression, Express Rate Limit, Multer.
- **Database**: MongoDB (with automatic embedded In-Memory MongoDB fallback so it runs out-of-the-box even without a local MongoDB service!).
- **Security**: JWT tokens, bcrypt password hashing, input sanitization, rate limiting, and role-based route guards.

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=supersecretjwtkey_replace_in_production_min32chars_cinema_app
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Cinema Admin
ADMIN_EMAIL=admin@imovies.dev
ADMIN_PASSWORD=Admin@1234
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

*(Note: Port 5001 is used by default to prevent port conflicts with macOS ControlCenter / AirPlay on port 5000).*
