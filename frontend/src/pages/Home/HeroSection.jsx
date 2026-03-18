import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';
const HeroSection = () => {
  return (
    <section className="hero container">
      <div className="hero-text">
        <h1 className="hero-title">Define Your<br/>Setup</h1>
        <p className="hero-desc">
          High-End Graphics Cards Inspired By Ultimate Performance — Crafted For Gamers, Creators, And Everyday Excellence.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">Shop The Drop</Link>
          <Link to="/brands" className="btn-secondary">View All Brands</Link>
        </div>
      </div>

      <div className="hero-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop"
          alt="RTX 4090"
          className="hero-image"
        />
        <div className="floating-badge badge-top">
          <span className="dot-green"></span> 100% Satisfaction Guaranteed
        </div>
        <div className="floating-badge badge-bottom">
          ⚡ Designed For Extreme Gaming
        </div>
      </div>
    </section>
  );
};

export default HeroSection;