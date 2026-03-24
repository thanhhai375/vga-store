import React from 'react';
import HeroSection from './HeroSection';
import ProductCard from '../../components/ui/ProductCard';
import { mockProducts } from '../../data/mockProducts';
import AboutSection from '../../components/ui/AboutSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />

      <section className="categories-section container">
        <div className="categories-header">
          <h2 className="section-title">New Arrivals</h2>
        </div>
        <div className="product-grid">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* THÊM COMPONENT ABOUT Ở ĐÂY NÈ! */}
      <AboutSection />

    </div>
  );
};
export default Home;