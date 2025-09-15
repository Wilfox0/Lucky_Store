// src/components/Footer.jsx
import React from 'react';

const Footer = ({ socialLinks = {} }) => {
  return (
    <footer className="footer" style={{ borderTop: '2px solid #ffc0cb', padding: '15px 20px', marginTop: '20px' }}>
      <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="social-area" aria-label="social-links" style={{ display: 'flex', gap: '15px' }}>
          {socialLinks.whatsapp && (
            <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="social-btn" style={socialBtnStyle}>
              <i className="fab fa-whatsapp"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="social-btn" style={socialBtnStyle}>
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="social-btn" style={socialBtnStyle}>
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
        </div>

        <div className="footer-copy" style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>
          © {new Date().getFullYear()} {socialLinks.storeName || ''}
        </div>
      </div>
    </footer>
  );
};

const socialBtnStyle = {
  color: '#c71585',
  fontSize: '22px',
  transition: 'all 0.2s',
  cursor: 'pointer'
};

// يمكن تطبيق hover باستخدام CSS:
// .social-btn:hover { color:#ff69b4; }

export default Footer;
