import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Blog from './pages/Blog/Blog';
import Service from './pages/Service/Service';
import Cart from './pages/Cart/Cart';
import TrackOrder from './pages/TrackOrder/TrackOrder';

// 1. IMPORT COMPONENT CHECKOUT VÀO ĐÂY
import Checkout from './pages/Checkout/Checkout';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service" element={<Service />} />
          <Route path="/cart" element={<Cart />} />

          {/* 2. THÊM ROUTE CHO TRANG THANH TOÁN */}
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/track-order" element={<TrackOrder />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;