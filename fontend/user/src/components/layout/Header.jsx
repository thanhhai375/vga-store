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

          {}
          <Link to="/service?tab=Tra cứu thông tin bảo hành" className="nav-item track-order-btn">
            TRACK ORDER
          </Link>

          <button className="btn-signin" onClick={() => setIsLoginModalOpen(true)}>
            SIGN IN
          </button>

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