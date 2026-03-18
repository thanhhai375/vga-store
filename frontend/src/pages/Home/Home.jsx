import React from 'react';
import HeroSection from './HeroSection';
import Features from '../../components/ui/Features';
import ProductCard from '../../components/ui/ProductCard';
import { mockProducts } from '../../data/mockProducts';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Features />

      <section className="categories-section container">
        <div className="categories-header">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Level up your rig with our latest graphics cards.</p>
        </div>

        {/* Lưới hiển thị danh sách sản phẩm */}
        <div className="product-grid">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;