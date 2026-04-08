import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthModal from '../AuthModal/AuthModal';
import './Header.css';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.wishlistItems.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">

        {/* LOGO - Chuyên nghiệp kiểu ROG */}
        <Link to="/" className="logo-brand">
          <svg className="logo-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer hexagon shape */}
            <polygon points="22,2 40,12 40,32 22,42 4,32 4,12" fill="none" stroke="#ff0029" strokeWidth="1.5"/>
            {/* Inner accent */}
            <polygon points="22,8 35,15.5 35,28.5 22,36 9,28.5 9,15.5" fill="#ff0029" opacity="0.12"/>
            {/* Center V shape */}
            <path d="M14 16 L22 30 L30 16" stroke="#ff0029" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="22" cy="22" r="2.5" fill="#ff0029"/>
          </svg>
          <div className="logo-text-block">
            <span className="logo-line1">VGA</span>
            <span className="logo-line2">STORE</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="nav-links">
          {[
            { to: '/', label: 'TRANG CHỦ' },
            { to: '/products', label: 'SẢN PHẨM' },
            { to: '/blog', label: 'TIN TỨC' },
            { to: '/service', label: 'DỊCH VỤ' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          <Link to="/track-order" className="nav-action-item" title="Theo dõi đơn hàng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </Link>

          {/* WISHLIST ICON */}
          <Link to="/wishlist" className="cart-icon" title="Yêu thích">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "#e53935" : "none"} stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="cart-badge" style={{background: '#e53935'}}>{wishlistCount}</span>
            )}
          </Link>

          <button className="nav-action-item" onClick={() => setIsLoginModalOpen(true)} title="Đăng nhập">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          <Link to="/cart" className="cart-icon" title="Giỏ hàng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartTotalQuantity > 0 && (
              <span className="cart-badge">{cartTotalQuantity}</span>
            )}
          </Link>
        </div>
      </div>

      <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;