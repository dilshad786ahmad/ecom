import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        padding: '32px',
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Concentric decorative rings */}
      {[500, 400, 300].map((size, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${0.03 + i * 0.02})`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Brand */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '48px', textAlign: 'center' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          MONOLITH
        </span>
      </div>

      {/* 404 Number */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: 'clamp(120px, 20vw, 220px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.06em',
            lineHeight: 1,
            margin: 0,
            textShadow: '0 0 80px rgba(255,255,255,0.1)',
            userSelect: 'none',
          }}
        >
          404
        </h1>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '60px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 10,
        }}
      />

      {/* Message */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            marginBottom: '12px',
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            maxWidth: '380px',
            margin: '0 auto',
          }}
        >
          The page you are looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
      </div>

      {/* Buttons */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Go Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '14px 32px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e2e2'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
          Go Home
        </button>

        {/* Go Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '14px 32px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.25)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Go Back
        </button>
      </div>

      {/* Bottom copyright */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          © 2024 Monolith Electronics.
        </p>
      </div>
    </div>
  );
};

export default Error;
