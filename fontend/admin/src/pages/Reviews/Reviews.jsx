import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/reviews');
      const data = res.data || res;
      setReviews(Array.isArray(data) ? data : data.content || []);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa đánh giá này?')) return;
    try { await axiosClient.delete(`/admin/reviews/${id}`); fetch(); }
    catch { alert('Xóa thất bại!'); }
  };

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đánh giá</h1>
          <p className="page-subtitle">Kiểm duyệt đánh giá sản phẩm</p>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Sản phẩm</th><th>Người dùng</th><th>Điểm</th><th>Nội dung</th><th>Ngày</th><th>Hành động</th></tr></thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Chưa có đánh giá</td></tr>
                ) : reviews.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.product?.name || `#${r.productId}`}</td>
                    <td>{r.user?.username || r.username || '--'}</td>
                    <td style={{color:'#fbbf24', letterSpacing:1}}>{renderStars(r.rating || 0)}</td>
                    <td style={{maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.comment || '--'}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={14} /> Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
