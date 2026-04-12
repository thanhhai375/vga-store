import React from 'react';
import HeroSection from './HeroSection';
import SeriesSection from '../../components/ui/SeriesSection';
import HelpChoose from '../../components/ui/HelpChoose';
import BestSellers from '../../components/ui/BestSellers';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#fff' }}>
      <HeroSection />

      <SeriesSection />

      <HelpChoose />

      <BestSellers />

      {/* SECTION PHỤ KIỆN (Trực tiếp ở đây) */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0 100px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#000', margin: '0 0 10px 0' }}>PHỤ KIỆN</h2>
          <a href="/phu-kien" style={{ fontSize: '14px', fontWeight: '800', color: '#d8282e', textDecoration: 'none' }}>XEM TẤT CẢ PHỤ KIỆN ›</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

          {/* Box 1 - Dùng chung class hiệu ứng 4 góc của BestSellers */}
          <div className="asus-corner-card" style={{ backgroundColor: '#f8f8f8', padding: '50px 40px', alignItems: 'flex-start', textAlign: 'left' }}>
            <img src="/images/products/asus/rog-herculx-eva.png" alt="Herculx EVA" style={{ width: '80%', margin: '0 auto 30px auto', display: 'block' }} />
            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#000', marginBottom: '15px' }}>ROG Herculx EVA-02 Edition</h3>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết kế dễ sử dụng và khả năng tương thích rộng rãi.</p>
          </div>

          {/* Box 2 */}
          <div className="asus-corner-card" style={{ backgroundColor: '#f8f8f8', padding: '50px 40px', alignItems: 'flex-start', textAlign: 'left' }}>
            <img src="/images/products/asus/rog-herculx-holder.png" alt="Herculx Base" style={{ width: '80%', margin: '0 auto 30px auto', display: 'block' }} />
            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#000', marginBottom: '15px' }}>ROG Herculx Graphics Card Holder</h3>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế dễ sử dụng và khả năng tương thích đa dạng.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;