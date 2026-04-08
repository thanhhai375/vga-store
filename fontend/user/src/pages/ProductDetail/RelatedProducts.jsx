import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';

const RelatedProducts = ({ categoryId, currentId }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Dùng categoryId trực tiếp (field flat) hoặc category?.id (nested)
    const catId = categoryId;
    if (!catId) return;
    
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products?page=0&size=100`);
        // Hỗ trợ cả 2 kiểu response: { data: [...] } hoặc { content: [...] }
        const raw = res.data;
        let allProducts = Array.isArray(raw) ? raw 
          : Array.isArray(raw?.data) ? raw.data 
          : Array.isArray(raw?.content) ? raw.content
          : [];
        
        // Lọc cùng category, khác sản phẩm hiện tại
        const filtered = allProducts.filter(p => {
          const pCatId = p.categoryId || p.category?.id;
          return pCatId == catId && p.id !== currentId;
        });
        
        // Random 4 sản phẩm
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelated(shuffled);
      } catch (e) {
        console.error('RelatedProducts error:', e);
      }
    };
    fetchRelated();
  }, [categoryId, currentId]);

  if (related.length === 0) return <p style={{color:'#999', textAlign:'center', padding:'20px'}}>Không có sản phẩm tương tự.</p>;

  return (
    <div className="related-grid">
      {related.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default RelatedProducts;
