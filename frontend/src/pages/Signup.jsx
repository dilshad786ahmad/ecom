import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please accept the Terms of Service');
      return;
    }
    setError('');
    try {
      const { data } = await axios.post('https://ecom-skc5.onrender.com/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: '40%',
          minWidth: '380px',
          background: 'radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #000000 70%)',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Speaker circle background */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #2a2a2a 0%, #0d0d0d 50%, #000 100%)',
            boxShadow:
              'inset 0 0 80px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Concentric rings */}
          {[380, 320, 260, 200, 140, 90, 50].map((size, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                border: `1px solid rgba(255,255,255,${0.03 + i * 0.01})`,
              }}
            />
          ))}
          {/* Center dust-cap */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #333 0%, #111 100%)',
              boxShadow: '0 0 10px rgba(0,0,0,0.8)',
            }}
          />
        </div>

        {/* Subtle texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(60,60,60,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top: Brand */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            MONOLITH
          </span>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginTop: '6px',
            }}
          >
            Precision Engineered Systems
          </p>
        </div>

        {/* Bottom: Description */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: '2px solid rgba(255,255,255,0.3)',
              padding: '20px 20px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              Join an <span style={{ color: '#e2b96f' }}>exclusive</span> ecosystem of{' '}
              <span style={{ color: '#e2b96f' }}>high-fidelity</span> audio and computational
              excellence. Access technical documentation, firmware updates, and the Monolith store.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div
        className="flex-1 flex flex-col"
        style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}
      >
        <div
          className="flex-1 flex flex-col justify-center"
          style={{ padding: '60px 64px', maxWidth: '640px', margin: '0 auto', width: '100%' }}
        >
          {/* Heading */}
          <div style={{ marginBottom: '36px' }}>
            {/* Heading row with home icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#111111',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Create Account
              </h1>
              <Link
                to="/"
                title="Go to Home"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f4f4f4',
                  color: '#111111',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e2e2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f4f4f4'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  home
                </span>
              </Link>
            </div>
            <p style={{ fontSize: '14px', color: '#c9893a', fontWeight: 400 }}>
              Initialize your Monolith profile.
            </p>
          </div>


          {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* First Name + Last Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* First Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="firstName"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#555555',
                  }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cccccc',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#111111',
                    backgroundColor: 'transparent',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#000000'; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#cccccc'; }}
                />
              </div>

              {/* Last Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="lastName"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#555555',
                  }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cccccc',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#111111',
                    backgroundColor: 'transparent',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#000000'; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#cccccc'; }}
                />
              </div>
            </div>

            {/* Gmail Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="email"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#555555',
                }}
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
                style={{
                  width: '100%',
                  padding: '10px 0',
                  border: 'none',
                  borderBottom: '1px solid #cccccc',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#111111',
                  backgroundColor: 'transparent',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#cccccc'; }}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#555555',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cccccc',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#111111',
                    backgroundColor: 'transparent',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#000000'; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#cccccc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888888',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                style={{
                  width: '14px',
                  height: '14px',
                  marginTop: '3px',
                  accentColor: '#000000',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <label
                htmlFor="terms"
                style={{ fontSize: '13px', color: '#555555', lineHeight: 1.5, cursor: 'pointer' }}
              >
                I accept the{' '}
                <a
                  href="#"
                  style={{ color: '#c9893a', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  style={{ color: '#c9893a', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  Privacy Policy
                </a>{' '}
                regarding my data.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: 0,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'background-color 0.2s ease',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000000'; }}
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p
            style={{
              marginTop: '28px',
              fontSize: '14px',
              color: '#888888',
              textAlign: 'center',
            }}
          >
            Already part of the ecosystem?{' '}
            <Link
              to="/signin"
              style={{
                color: '#111111',
                fontWeight: 700,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Copyright Footer */}
        <div
          style={{
            padding: '20px 64px',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: '#aaaaaa',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            © 2024 Monolith Electronics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
