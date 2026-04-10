import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { servicePages } from '../../data/serviceData';
import './Service.css';

// ── Content Block Renderer ──────────────────────────────────────────────────
function ContentRenderer({ blocks }) {
  if (!blocks) return null;
  return blocks.map((block, idx) => {
    switch (block.type) {
      case 'heading':
        return <h3 key={idx} className="sv-heading">{block.body}</h3>;

      case 'text':
        return <p key={idx} className="sv-text">{block.body}</p>;

      case 'list':
        return (
          <ul key={idx} className="sv-list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case 'note':
        return (
          <div key={idx} className="sv-note">
            <span className="sv-note-icon">⚠️</span>
            <p>{block.body}</p>
          </div>
        );

      case 'table':
        return (
          <div key={idx} className="sv-table-wrap">
            <table className="sv-table">
              <thead>
                <tr>
                  {block.headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'features':
        return (
          <div key={idx} className="sv-features-grid">
            {block.items.map((item, i) => (
              <div key={i} className="sv-feature-card">
                <span className="sv-feature-icon">{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'stores':
        return (
          <div key={idx} className="sv-stores-grid">
            {block.items.map((store, i) => (
              <div key={i} className="sv-store-card">
                <div className="sv-store-pin">📍</div>
                <h4>{store.name}</h4>
                <div className="sv-store-info">
                  <p><strong>Địa chỉ:</strong> {store.address}</p>
                  <p><strong>Hotline:</strong> {store.phone}</p>
                  <p><strong>Giờ mở cửa:</strong> {store.hours}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'steps':
        return (
          <div key={idx} className="sv-steps">
            {block.items.map((item) => (
              <div key={item.step} className="sv-step">
                <div className="sv-step-number">{item.step}</div>
                <div className="sv-step-info">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'priceBox':
        return (
          <div key={idx} className="sv-price-box">
            <div className="sv-price-box-header">{block.title}</div>
            <p className="sv-price-box-sub">{block.subtitle}</p>
            <ul className="sv-list">
              {block.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            {block.note && <p className="sv-price-box-note">{block.note}</p>}
          </div>
        );

      case 'warrantyForm':
        return <WarrantyForm key={idx} />;

      default:
        return <p key={idx}>{block.body}</p>;
    }
  });
}

// ── Warranty Lookup Form ────────────────────────────────────────────────────
function WarrantyForm() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="sv-warranty-section">
      <form className="sv-warranty-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập SĐT hoặc Mã S/N (VD: 0987654321)..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          className="sv-warranty-input"
        />
        <button type="submit" className="sv-warranty-btn">KIỂM TRA BẢO HÀNH</button>
      </form>
      {searched && (
        <div className="sv-warranty-result">
          <div className="sv-warranty-result-icon">📋</div>
          <p>Không tìm thấy thông tin bảo hành cho "<strong>{query}</strong>".</p>
          <span>Vui lòng kiểm tra lại thông tin hoặc liên hệ hotline 1900.5301 để được hỗ trợ.</span>
        </div>
      )}
    </div>
  );
}

// ── Main Service Page ───────────────────────────────────────────────────────
const Service = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const [activeId, setActiveId] = useState(() => {
    const found = servicePages.find((s) => s.id === tabFromUrl || s.label === tabFromUrl);
    return found ? found.id : servicePages[0].id;
  });

  useEffect(() => {
    if (tabFromUrl) {
      const found = servicePages.find((s) => s.id === tabFromUrl || s.label === tabFromUrl);
      if (found) setActiveId(found.id);
    }
  }, [tabFromUrl]);

  const activePage = servicePages.find((s) => s.id === activeId) || servicePages[0];

  const handleTabClick = (page) => {
    setActiveId(page.id);
    setSearchParams({ tab: page.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="service-page">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div
        className="sv-hero"
        style={activePage.heroImage ? { backgroundImage: `url(${activePage.heroImage})` } : {}}
      >
        <div className="sv-hero-overlay" />
        <div className="sv-hero-content container">
          <span className="sv-hero-icon">{activePage.icon}</span>
          <h1 className="sv-hero-title">{activePage.title}</h1>
          {activePage.description && (
            <p className="sv-hero-desc">{activePage.description}</p>
          )}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="sv-body container">
        <div className="sv-layout">
          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="sv-sidebar">
            <div className="sv-sidebar-title">DỊCH VỤ & CHÍNH SÁCH</div>
            <nav className="sv-sidebar-nav">
              {servicePages.map((page) => (
                <button
                  key={page.id}
                  className={`sv-nav-item ${activeId === page.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(page)}
                >
                  <span className="sv-nav-icon">{page.icon}</span>
                  <span className="sv-nav-label">{page.label}</span>
                </button>
              ))}
            </nav>

            {/* CTA Widget */}
            <div className="sv-sidebar-cta">
              <div className="sv-sidebar-cta-icon">📞</div>
              <h4>Cần hỗ trợ?</h4>
              <p>Gọi ngay hotline để được tư vấn</p>
              <a href="tel:19005301" className="sv-sidebar-cta-phone">1900.5301</a>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────── */}
          <main className="sv-content">
            <div className="sv-content-body">
              <ContentRenderer blocks={activePage.content} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Service;