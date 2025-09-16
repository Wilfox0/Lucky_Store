// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({
  ownerEmail,
  currentUserEmail,
  storeSettings,
  searchTerm,
  setSearchTerm,
  sections,
  cartCount,
}) => {
  return (
    <header className="site-header">
      {/* الصف العلوي */}
      <div className="header-top">
        <div className="logo-area" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {storeSettings.logo && (
            <img src={storeSettings.logo} alt="Logo" className="site-logo" />
          )}
          <span className="site-title">{storeSettings.storeName}</span>
        </div>

        <nav className="nav-links">
          <Link to="/" className="nav-link">الرئيسية</Link>
          <Link to="/checkout" className="nav-link">السلة ({cartCount})</Link>
          <Link to="/orders" className="nav-link">الطلبات</Link>
          {currentUserEmail === ownerEmail && (
            <Link to="/admin" className="nav-link">لوحة التحكم</Link>
          )}
        </nav>

        {/* روابط السوشيال */}
        <div className="social-links-navbar">
          {storeSettings.socialLinks?.whatsapp && (
            <a href={storeSettings.socialLinks.whatsapp} target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          )}
          {storeSettings.socialLinks?.instagram && (
            <a href={storeSettings.socialLinks.instagram} target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {storeSettings.socialLinks?.facebook && (
            <a href={storeSettings.socialLinks.facebook} target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
        </div>
      </div>

      {/* الصف السفلي */}
      <div className="header-bottom">
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="sections-wrapper">
          {sections.map((section) => (
            <span key={section} className="section-chip">
              {section}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
