import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Film, AlertCircle, Sparkles, User, Lock, Mail, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '../redux/authSlice.js';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (isRegister) {
      if (!name.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      const result = await dispatch(registerUser({ name, email, password }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Account created successfully! Welcome to IMovies.');
        navigate(redirectPath, { replace: true });
      }
    } else {
      const result = await dispatch(loginUser({ email, password }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Welcome back!');
        navigate(redirectPath, { replace: true });
      }
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setValidationError('');
    const result = await dispatch(loginUser({ email: demoEmail, password: demoPassword }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Signed in as ${demoEmail}!`);
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0f121b] border border-white/[0.08] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 mx-auto flex items-center justify-center shadow-xl shadow-rose-950/60">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Join IMovies Cinema' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isRegister
              ? 'Create your cinema account to reserve seats in real time'
              : 'Sign in to access your digital tickets and instant seat holds'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setValidationError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setValidationError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Fast 1-Click Demo Login Bar */}
        {!isRegister && (
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Quick Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('user@imovies.dev', 'User@1234')}
                className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/[0.08] text-xs font-semibold text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>Demo User</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('admin@imovies.dev', 'Admin@1234')}
                className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/[0.08] text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cinema Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {(error || validationError) && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-sm font-bold text-white transition-all shadow-xl shadow-rose-950/60 disabled:opacity-50 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
