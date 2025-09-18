import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';

const Navbar = ({
  ownerEmail,
  currentUserEmail,
  storeSettings = {},
  searchTerm = '',
  setSearchTerm = () => {},
  sections = [],
  onSelectSection = null
}) => {
  const { cart } = useCart(); 
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0); // العدد الصحيح
  const isOwner = ownerEmail === currentUserEmail;

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-left">
          <nav className="nav-links">
            <Link className="nav-link" to="/">الرئيسية</Link>
            <Link className="nav-link" to="/checkout">السلة ({cartCount})</Link>
            {isOwner && <Link className="nav-link" to="/admin">لوحة التحكم</Link>}
          </nav>
        </div>

        <div className="header-center">
          {storeSettings.logo ? (
            <img className="site-logo" src={storeSettings.logo} alt="logo" />
          ) : (
            <div className="site-logo-placeholder">متجري</div>
          )}
        </div>

        <div className="header-right">
          <Link className="site-title" to="/">{storeSettings.storeName || 'متجري'}</Link>
          <div className="social-links">
            {storeSettings.socialLinks?.whatsapp && (
              <a href={storeSettings.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="social-link">WhatsApp</a>
            )}
            {storeSettings.socialLinks?.instagram && (
              <a href={storeSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="social-link">Instagram</a>
            )}
            {storeSettings.socialLinks?.facebook && (
              <a href={storeSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="social-link">Facebook</a>
            )}
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="ابحث عن منتج أو قسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sections-wrapper" aria-label="sections">
          <button
            className="section-chip"
            onClick={() => onSelectSection ? onSelectSection('all') : null}
            title="عرض جميع المنتجات"
          >
            جميع المنتجات
          </button>
          {sections.map((s) => (
            <button
              key={s}
              className="section-chip"
              onClick={() => onSelectSection ? onSelectSection(s) : null}
              title={`عرض قسم ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
