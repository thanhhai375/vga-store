import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

// Ảnh THẬT lấy từ ROG ASUS CDN
const slides = [
  {
    id: 1,
    img: "https://dlcdnwebimgs.asus.com/gain/3CECA175-929A-4209-ACD4-CA1248E59B14/fwebp",
    link: "/products",
  },
  {
    id: 2,
    img: "https://dlcdnwebimgs.asus.com/gain/6D386FE6-1491-490C-A3C5-F76B21E759DE/fwebp",
    link: "/products",
  },
  {
    id: 3,
    img: "https://dlcdnwebimgs.asus.com/gain/FA648BF1-0026-4D7A-B816-5BFA387661C9/fwebp",
    link: "/products",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = slides.length;

  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % total);
    }, 6000);
    return () => clearInterval(t);
  }, [current]);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 500);
  };

  return (
    <section className="hero">
      {/* Slides */}
      <div className={`hero-slides-wrap ${animating ? "fading" : ""}`}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === current ? "active" : ""}`}
            style={{ backgroundImage: `url('${s.img}')` }}
          />
        ))}
      </div>

      {/* Gradient overlay để các nút không bị chìm */}
      <div className="hero-gradient-overlay" />

      {/* Controls & dots */}
      <div className="hero-bottom-bar">
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`hdot ${i === current ? "active" : ""}`}
            />
          ))}
        </div>
        <Link to="/products" className="hero-btn-explore">
          KHÁM PHÁ NGAY
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
