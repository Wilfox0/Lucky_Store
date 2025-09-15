import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ storeSettings, searchTerm, setSearchTerm, sections, cartCount }) => {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link to="/">
          {storeSettings.logo ? (
            <img src={storeSettings.logo} alt={storeSettings.storeName} className="site-logo" />
          ) : (
            <span className="site-title">{storeSettings.storeName}</span>
          )}
        </Link>
        <div className="nav-links">
          <Link to="/">الرئيسية</Link>
          <Link to="/checkout">السلة ({cartCount})</Link>
          <Link to="/orders">الطلبات</Link>
          <Link to="/admin">لوحة التحكم</Link>
        </div>
      </div>
      <div className="header-bottom">
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن المنتجات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sections-wrapper">
          {sections.map((section) => (
            <div key={section} className="section-chip">{section}</div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
