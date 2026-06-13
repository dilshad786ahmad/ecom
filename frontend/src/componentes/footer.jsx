const Footer = () => (
  <footer className="footer-section">
    <div className="footer-grid">
      {/* Brand Column */}
      <div className="flex flex-col gap-sm" style={{ gridColumn: 'span 1' }}>
        <span
          className="text-headline-md font-black"
          style={{ fontSize: '24px', fontWeight: 900, color: '#000000' }}
        >
          TECHNE
        </span>
        <p
          className="text-body-md mt-2"
          style={{ fontSize: '16px', color: '#4c4546', maxWidth: '384px', marginTop: '8px' }}
        >
          Engineered for absolute clarity. We design electronic instruments for the uncompromising professional.
        </p>
        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
          <p
            className="text-label-sm uppercase tracking-widest"
            style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em', color: '#5d5e66' }}
          >
            © 2024 TECHNE ELECTRONICS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      {/* Legal Column */}
      <div className="flex flex-col gap-sm">
        <h4
          className="text-label-md uppercase tracking-widest mb-2"
          style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#000000' }}
        >
          Legal
        </h4>
        <ul className="flex flex-col" style={{ gap: '8px' }}>
          {['Privacy Policy', 'Terms of Service'].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-body-md transition-colors"
                style={{ fontSize: '16px', color: '#5d5e66' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5d5e66')}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Support Column */}
      <div className="flex flex-col gap-sm">
        <h4
          className="text-label-md uppercase tracking-widest mb-2"
          style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#000000' }}
        >
          Support
        </h4>
        <ul className="flex flex-col" style={{ gap: '8px' }}>
          {['Shipping', 'Returns'].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-body-md transition-colors"
                style={{ fontSize: '16px', color: '#5d5e66' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5d5e66')}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
