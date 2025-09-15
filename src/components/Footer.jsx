import React from "react";

const Footer = ({ socialLinks, storeName }) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="social-area">
          {socialLinks && Object.entries(socialLinks).map(([key, link]) => (
            <a key={key} href={link} target="_blank" rel="noopener noreferrer">{key}</a>
          ))}
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
