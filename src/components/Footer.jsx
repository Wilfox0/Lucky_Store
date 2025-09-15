import React from "react";

const Footer = ({ storeName, socialLinks }) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="social-area">
          {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank">Instagram</a>}
          {socialLinks?.facebook && <a href={socialLinks.facebook} target="_blank">Facebook</a>}
        </div>
        <div className="footer-copy">© 2025 {storeName}. جميع الحقوق محفوظة</div>
      </div>
    </footer>
  );
};

export default Footer;
