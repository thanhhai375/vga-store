import React from 'react';
import HeroSection from './HeroSection';
import CategoryNav from '../../components/ui/CategoryNav';
import SeriesSection from '../../components/ui/SeriesSection';
import HelpChoose from '../../components/ui/HelpChoose';
import BestSellers from '../../components/ui/BestSellers';
import ExplodedVga from '../../components/ui/ExplodedVga';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* 1. Hero - ảnh thật ROG CDN full-width 16:9 */}
      <HeroSection />

      {/* 2. Category tabs (Card Đồ Họa | Phụ kiện) */}
      <CategoryNav />

      {/* 3. Series Cards (ROG Matrix | ROG Astral | ROG Strix) */}
      <SeriesSection />

      {/* 4. Giúp tôi lựa chọn - Filter dropdowns */}
      <HelpChoose />

      {/* 5. Sản phẩm bán chạy */}
      <BestSellers />

      {/* 6. 3D Anatomy section */}
      <ExplodedVga />
    </div>
  );
};

export default Home;