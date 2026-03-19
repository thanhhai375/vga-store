import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">VGA STORE</Link>
        <nav className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/products">SHOP</Link>
          <Link to="/brands">BRANDS</Link>
          <Link to="/contact">CONTACT</Link>
        </nav>
        <div className="header-actions">
          <Link to="/login" className="btn-signin">SIGN IN</Link>
          <div className="cart-icon">
            {/* Vẽ Icon Giỏ hàng bằng SVG (Không bao giờ lo vỡ ảnh) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="cart-badge">3</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;