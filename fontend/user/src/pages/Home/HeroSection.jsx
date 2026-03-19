import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container hero-content-wrapper">
        {/* CỘT TRÁI: TEXT & TÍNH NĂNG */}
        <div className="hero-text">
          <h1 className="hero-title">
            Define <br />
            Your Setup
          </h1>
          <p className="hero-desc">
            Define your studio and tech directory and, gaming, <br />
            sculpticator and your GPU card.
          </p>

          <div className="hero-features-list">
            <div className="feature-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
              High-quality features
            </div>
            <div className="feature-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              100% Satisfaction
            </div>
            <div className="feature-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              Minimal brand GPU
            </div>
            <div className="feature-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              Competition gaming
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: ẢNH VÀ BADGES LƠ LỬNG */}
        <div className="hero-visual">
          {}
          <img
            src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop"
            alt="Hero Visual"
            className="hero-main-img"
          />

          <div className="floating-badges-container">
            <div className="badge badge-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3 2 3-2 1 4 4 1-2 3 2 3-4 1-1 4-3-2-3 2-1-4-4-1 2-3-2-3 4-1z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>
                100% Satisfaction
                <br />
                Guaranteed
              </span>
            </div>
            <div className="badge badge-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.4 12.7l1.6 8.3-5-3.5-5 3.5 1.6-8.3" />
                <polygon points="12 5 13 7 15 7.5 13.5 9 14 11 12 10 10 11 10.5 9 9 7.5 11 7" />
              </svg>
              <span>
                Designed For
                <br />
                Extreme Gaming
              </span>
            </div>
            <div className="badge badge-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="6" width="20" height="12" rx="6" />
                <path d="M6 12h4 M8 10v4" />
                <circle cx="17" cy="12" r="1" />
                <circle cx="14" cy="12" r="1" />
              </svg>
              <span>
                Brandest Free
                <br />
                Premium Edition
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
