import React from 'react';
import { Link } from 'react-router-dom';
import './SeriesSection.css';

const seriesData = [
  {
    id: 1,
    name: "ROG Matrix",
    tagline: "Infinity Loop Cooling",
    img: "https://dlcdnwebimgs.asus.com/gain/DC190BF7-5FB1-4C95-9E01-1E7B7B2206FF/w750/h470/fwebp",
    filterParam: "ROG Matrix",
  },
  {
    id: 2,
    name: "ROG Astral",
    tagline: "The Next Frontier",
    img: "https://dlcdnwebimgs.asus.com/gain/91DFD65E-42E7-45E1-91A5-2376F4E6889E/w750/h470/fwebp",
    filterParam: "ROG Astral",
  },
  {
    id: 3,
    name: "ROG Strix",
    tagline: "Take Flight",
    img: "https://dlcdnwebimgs.asus.com/gain/5DEF33D2-B9E4-4983-BE85-F93C4E4AD5FC/w750/h470/fwebp",
    filterParam: "ROG Strix",
  },
];

const SeriesSection = () => {
  return (
    <section className="series-section">
      <div className="container">
        {/* Section header like ROG */}
        <div className="series-header">
          <h2 className="series-main-title">CARD ĐỒ HỌA</h2>
          <div className="series-header-sub">
            <span className="series-subtitle">CARD ĐỒ HỌA</span>
            <Link to="/products" className="series-see-all">XEM TẤT CẢ CARD ĐỒ HỌA ›</Link>
          </div>
        </div>

        {/* 3 column grid */}
        <div className="series-grid">
          {seriesData.map(s => (
            <Link
              key={s.id}
              to={`/products?series=${encodeURIComponent(s.filterParam)}`}
              className="series-card"
            >
              <div className="series-img-wrap">
                <img src={s.img} alt={s.name} className="series-card-img" />
              </div>
              <div className="series-card-info">
                <h3 className="series-card-name">{s.name}</h3>
                <p className="series-card-tag">{s.tagline}</p>
                <span className="series-card-link">XEM THÊM ›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeriesSection;
