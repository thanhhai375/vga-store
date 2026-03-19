import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<div className="p-20 text-center text-2xl">Trang Danh sách Sản phẩm đang xây dựng...</div>} />
          <Route path="/cart" element={<div className="p-20 text-center text-2xl">Trang Giỏ hàng đang xây dựng...</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;