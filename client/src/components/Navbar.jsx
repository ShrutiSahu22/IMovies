import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film,
  MapPin,
  Menu,
  X,
  LogOut,
  Ticket,
  ShieldCheck,
  User,
  ChevronDown,
  Sparkles,
  Compass
} from 'lucide-react';
import { useCity } from '../context/CityContext.jsx';
import { logout } from '../redux/authSlice.js';
import NotificationBell from './NotificationBell.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedCity, setSelectedCity, cities } = useCity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090a0f]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-100 to-rose-300 bg-clip-text text-transparent">
                  IMovies
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md">
                  CINEMA
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 tracking-wider uppercase block -mt-0.5">
                Next-Gen Tickets
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/movies"
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/movies')
                  ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Movies</span>
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/my-bookings')
                    ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Ticket className="w-4 h-4 text-rose-400" />
                <span>My Bookings</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right actions: City + Notifications + User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* City selector dropdown */}
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-white/[0.08] text-xs text-neutral-300 hover:border-neutral-700 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-neutral-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="" className="bg-[#0e1017] text-neutral-200">
                All Cities
              </option>
              {cities.map((city) => (
                <option key={city} value={city} className="bg-[#0e1017] text-neutral-200">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Bell (for authenticated users) */}
          {user && <NotificationBell />}

          {/* User Auth Info */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.08] text-xs text-neutral-200 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-[10px]">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <span className="font-semibold block truncate max-w-[110px] leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 block -mt-0.5 capitalize">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-52 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-2 border-b border-white/[0.08] mb-1">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-rose-400" />
                    <span>My Bookings</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Management</span>
                    </Link>
                  )}

                  <div className="my-1 border-t border-white/[0.08]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-xs font-semibold text-white shadow-lg shadow-rose-950/50 hover:scale-105 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden gap-2">
          {user && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900 border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090a0f] p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-white/[0.08] text-xs text-neutral-300">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-transparent text-neutral-200 font-medium focus:outline-none w-full"
            >
              <option value="" className="bg-neutral-900 text-neutral-200">
                All Cities
              </option>
              {cities.map((city) => (
                <option key={city} value={city} className="bg-neutral-900 text-neutral-200">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
            <Link
              to="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-neutral-200 hover:bg-neutral-900 font-medium"
            >
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Explore Movies</span>
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-neutral-200 hover:bg-neutral-900 font-medium"
              >
                <Ticket className="w-4 h-4 text-rose-400" />
                <span>My Bookings</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-amber-300 font-semibold hover:bg-amber-500/10"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management</span>
              </Link>
            )}

            <div className="pt-2">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout ({user.name})</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white bg-rose-600 font-semibold shadow-lg shadow-rose-950/50"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
