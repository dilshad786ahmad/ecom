import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('http://localhost:8000/api/auth/signin', {
        email,
        password,
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen font-['Inter',sans-serif]">

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] min-w-[380px] p-12 px-10 relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,_#1a1a1a_0%,_#000000_70%)]">
        
        {/* Speaker circle background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full flex items-center justify-center bg-[radial-gradient(circle_at_40%_40%,_#2a2a2a_0%,_#0d0d0d_50%,_#000_100%)] shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_0_60px_rgba(0,0,0,0.8)]">
          {/* Concentric rings */}
          {[380, 320, 260, 200, 140, 90, 50].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                border: `1px solid rgba(255,255,255,${0.03 + i * 0.01})`,
              }}
            />
          ))}
          {/* Center dust-cap */}
          <div className="w-[40px] h-[40px] rounded-full bg-[radial-gradient(circle,_#333_0%,_#111_100%)] shadow-[0_0_10px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(60,60,60,0.15)_0%,_transparent_60%)] pointer-events-none" />

        {/* Top: Brand */}
        <div className="relative z-10">
          <span className="text-[28px] font-black text-white tracking-[-0.03em] uppercase">
            MONOLITH
          </span>
          <p className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase mt-1.5">
            Precision Engineered Systems
          </p>
        </div>

        {/* Bottom: Description */}
        <div className="relative z-10">
          <div className="border border-white/10 border-l-[2px] border-l-white/30 p-5 bg-white/5 backdrop-blur-sm">
            <p className="text-[14px] leading-relaxed text-white/65">
              Join an <span className="text-[#e2b96f]">exclusive</span> ecosystem of{' '}
              <span className="text-[#e2b96f]">high-fidelity</span> audio and computational
              excellence. Access technical documentation, firmware updates, and the Monolith store.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        <div className="flex-1 flex flex-col justify-center py-[60px] px-16 max-w-[640px] mx-auto w-full">
          
          {/* Heading */}
          <div className="mb-9">
            {/* Heading row with home icon */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[32px] font-bold text-[#111] tracking-[-0.02em] m-0">
                Sign In
              </h1>
              <Link
                to="/"
                title="Go to Home"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f4f4] text-[#111] hover:bg-[#e2e2e2] transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  home
                </span>
              </Link>
            </div>
            <p className="text-[14px] text-[#c9893a] font-normal">
              Welcome back to Monolith.
            </p>
          </div>

          {error && <p className="text-red-500 text-[13px] mb-2">{error}</p>}
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* Gmail Address */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#555]"
              >
                Gmail Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full py-2.5 border-b border-[#ccc] focus:border-[#000] outline-none text-[15px] text-[#111] bg-transparent font-['Inter',sans-serif] transition-colors placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#555]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pr-9 border-b border-[#ccc] focus:border-[#000] outline-none text-[15px] text-[#111] bg-transparent font-['Inter',sans-serif] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#888] p-1 flex items-center bg-transparent border-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-4 mt-1 bg-[#000] hover:bg-[#222] text-white text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer font-['Inter',sans-serif] transition-colors"
            >
              Sign In
            </button>
            
            {/* Google Sign In */}
            <button
              type="button"
              className="w-full p-4 bg-white hover:bg-[#f9f9f9] text-[#111] border border-[#ccc] hover:border-[#111] text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer font-['Inter',sans-serif] transition-all flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-[14px] text-[#888] text-center">
            New to the ecosystem?{' '}
            <Link
              to="/signup"
              className="text-[#111] font-bold no-underline hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Copyright Footer */}
        <div className="py-5 px-16 border-t border-[#f0f0f0] text-right">
          <p className="text-[11px] text-[#aaa] tracking-[0.05em] uppercase">
            © 2024 Monolith Electronics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
