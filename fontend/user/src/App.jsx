import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Footer from './components/layout/Footer'; // 1. IMPORT FOOTER Ở ĐÂY
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<div className="p-20 text-center text-2xl">Trang Giỏ hàng đang xây dựng...</div>} />
        </Routes>

        {/* 2. ĐẶT FOOTER Ở NGAY DƯỚI ROUTES */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;