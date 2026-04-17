import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Monitor } from 'lucide-react';
import productService from '../../services/productService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const SIZE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({ page, size: SIZE, search });
      const data = res.data || res;
      if (data.content) {
        setProducts(data.content);
        setTotal(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotal(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa sản phẩm?')) return;
    try {
      await productService.delete(id);
      fetchProducts();
    } catch (e) { alert('Xóa thất bại!'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">Quản lý toàn bộ sản phẩm VGA Store</p>
        </div>
        <a href="/products/new" className="btn btn-primary">
          <Plus size={16} /> Thêm sản phẩm
        </a>
      </div>

      <div className="card">
        {/* Search */}
        <div className="toolbar">
          <div className="search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Không có sản phẩm</td></tr>
                ) : products.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      {p.imageUrl ? (
                        <img src={`http://localhost:8080${p.imageUrl}`} alt={p.name} className="product-thumb" />
                      ) : (
                        <div className="product-thumb-empty" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-hover)', color:'var(--text-muted)'}}><Monitor size={20} /></div>
                      )}
                    </td>
                    <td className="product-name-cell">
                      <div className="product-name">{p.name}</div>
                      <div className="product-brand">{p.brand?.name}</div>
                    </td>
                    <td>{p.category?.name || '--'}</td>
                    <td>{p.price ? `${Number(p.price).toLocaleString('vi-VN')}đ` : '--'}</td>
                    <td>
                      <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <a href={`/products/${p.id}`} className="btn btn-ghost btn-sm"><Edit2 size={14} /> Sửa</a>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: total }, (_, i) => (
              <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
