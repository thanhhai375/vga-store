import React from 'react';
import HeroSection from './HeroSection';
import SeriesSection from '../../components/ui/SeriesSection';
import HelpChoose from '../../components/ui/HelpChoose';
import BestSellers from '../../components/ui/BestSellers';
// 1. IMPORT COMPONENT PHỤ KIỆN ĐỘNG VÀO ĐÂY
import AccessoriesSection from '../../components/ui/AccessoriesSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#fff' }}>
      <HeroSection />

      <SeriesSection />

      <HelpChoose />

      <BestSellers />

      {/* 2. GỌI COMPONENT VỪA TẠO Ở ĐÂY (Nó đã thay thế toàn bộ code cứng cũ) */}
      <AccessoriesSection />

    </div>
  );
};

export default Home;