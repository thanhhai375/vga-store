import React from 'react';
import HeroSection from './HeroSection';
import SeriesSection from '../../components/ui/SeriesSection';
import HelpChoose from '../../components/ui/HelpChoose';
import BestSellers from '../../components/ui/BestSellers';
// 1. IMPORT COMPONENT PH KIN NG VO Y
import AccessoriesSection from '../../components/ui/AccessoriesSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#fff' }}>
      <HeroSection />

      <SeriesSection />

      <HelpChoose />

      <BestSellers />

{/* 2. GI COMPONENT VA TO Y (N thay th ton b code cng c) */}
      <AccessoriesSection />

    </div>
  );
};

export default Home;
