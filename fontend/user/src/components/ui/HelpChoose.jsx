import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpChoose.css';

const FILTERS = [
  { label: 'Hãng Chipset', key: 'chipset', options: ['NVIDIA', 'AMD'] },
  { label: 'Nhãn Đồ Họa', key: 'brand', options: ['ROG Strix', 'ROG Astral', 'TUF Gaming', 'ASUS Dual', 'ProArt'] },
  { label: 'Bộ Nhớ Video', key: 'vram', options: ['8GB', '12GB', '16GB', '24GB', '32GB'] },
  { label: 'Cổng I/O', key: 'ports', options: ['HDMI 2.1', 'DisplayPort 1.4', 'DisplayPort 2.1'] },
];

const HelpChoose = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});

  const handleChange = (key, val) => {
    setSelected(s => ({ ...s, [key]: val }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selected.brand) params.set('series', selected.brand);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <section className="hc-section">
      <div className="container">
        <h2 className="hc-title">GIÚP TÔI LỰA CHỌN</h2>
        <p className="hc-sub">Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp.</p>

        <div className="hc-filters">
          {FILTERS.map(f => (
            <div className="hc-filter-wrap" key={f.key}>
              <select
                className="hc-select"
                value={selected[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)}
              >
                <option value="">{f.label}</option>
                {f.options.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <svg className="hc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          ))}
        </div>

        <button className="hc-btn" onClick={handleSearch}>XEM SẢN PHẨM CỦA TÔI</button>
      </div>
    </section>
  );
};

export default HelpChoose;
