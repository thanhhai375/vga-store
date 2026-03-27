import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Footer from './components/layout/Footer'; // 1. IMPORT FOOTER Ở ĐÂY
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Blog from './pages/Blog/Blog';
import Service from './pages/Service/Service';
import Cart from './pages/Cart/Cart';
import TrackOrder from './pages/TrackOrder/TrackOrder';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service" element={<Service />} />
         <Route path="/cart" element={<Cart />} />
         <Route path="/track-order" element={<TrackOrder />} />
        </Routes>

        {/* 2. ĐẶT FOOTER Ở NGAY DƯỚI ROUTES */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;