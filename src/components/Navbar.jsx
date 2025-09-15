import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ storeSettings, searchTerm, setSearchTerm, sections, cartCount }) => {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link to="/">
          {storeSettings.logo && <img src={storeSettings.logo} alt="logo" className="site-logo" />}
          <span className="site-title">{storeSettings.storeName}</span>
        </Link>
        <div className="social-links-navbar">
          {storeSettings.socialLinks?.instagram && <a href={storeSettings.socialLinks.instagram} target="_blank">Instagram</a>}
          {storeSettings.socialLinks?.facebook && <a href={storeSettings.socialLinks.facebook} target="_blank">Facebook</a>}
        </div>
        <Link to="/checkout">السلة ({cartCount})</Link>
      </div>
      <div className="header-bottom">
        <input
          type="text"
          placeholder="بحث..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="sections-wrapper">
          {sections.map(sec => <span key={sec} className="section-chip">{sec}</span>)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
