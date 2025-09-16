import React from "react";

const Footer = ({ socialLinks = {}, storeName }) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="social-area" aria-label="social-links">
          {socialLinks.whatsapp && (
            <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="social-btn">
              <i className="fab fa-whatsapp"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="social-btn">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="social-btn">
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} {storeName || ""}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
