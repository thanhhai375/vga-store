import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthModal from '../AuthModal/AuthModal';
import './Header.css';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-content">

        {/* LOGO */}
        <Link to="/" className="logo">
          VGA STORE
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>HOME</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>SHOP</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>BLOG</NavLink>
          <NavLink to="/service" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>SERVICE</NavLink>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">

          {/* NÚT 1: TRACK ORDER (Icon Tờ giấy) */}
          <Link to="/track-order" className="nav-action-item">
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>TRACK ORDER</span>
          </Link>

          {/* NÚT 2: SIGN IN (Icon Hình người) */}
          <button className="nav-action-item" onClick={() => setIsLoginModalOpen(true)}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>SIGN IN</span>
          </button>

          {/* NÚT 3: GIỎ HÀNG */}
          <Link to="/cart" className="cart-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
             </svg>
            <span className="cart-badge">3</span>
          </Link>

        </div>

      </div>

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </header>
  );
};

export default Header;