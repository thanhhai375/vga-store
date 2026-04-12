import React from 'react';
import './HelpChoose.css';

const HelpChoose = () => {
  const filters = [
    "HÃNG CHIPSET", "NHÂN ĐỒ HỌA", "BỘ NHỚ VIDEO", "CỔNG I/O",
    "ĐỘ CAO SLOT", "KÍCH THƯỚC (CHIỀU DÀI)", "LOẠI BỘ NHỚ", "ĐẦU NỐI NGUỒN ĐIỆN", "PSU ĐỀ XUẤT"
  ];

  return (
    <section className="help-choose-section">
      <div className="container">
        <div className="help-header">
          <h2>GIÚP TÔI LỰA CHỌN</h2>
          <p>Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp.</p>
        </div>

        <div className="help-filter-grid">
          {filters.slice(0, 8).map((filter, index) => (
            <div key={index} className="help-select-box">
              <span>{filter}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          ))}
        </div>

        <div className="help-action">
          <button className="btn-red-action">XEM SẢN PHẨM CỦA TÔI</button>
        </div>
      </div>
    </section>
  );
};

export default HelpChoose;