import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import blogService from '../../services/blogService';

const Blogs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const SIZE = 10;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await blogService.getAll({ page, size: SIZE });
      const data = res.data || res;
      if (data.content) { setItems(data.content); setTotal(data.totalPages || 1); }
      else if (Array.isArray(data)) { setItems(data); setTotal(1); }
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa bài viết?')) return;
    try { await blogService.delete(id); fetch(); }
    catch { alert('Xóa thất bại!'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bài viết Blog</h1>
          <p className="page-subtitle">Quản lý nội dung website</p>
        </div>
        <a href="/blogs/new" className="btn btn-primary">
          <Plus size={16} /> Thêm bài viết
        </a>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Ảnh</th><th>Tiêu đề</th><th>Tác giả</th><th>Ngày tạo</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Chưa có bài viết</td></tr>
                ) : items.map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>
                      {b.image ? (
                        <img src={`http://localhost:8080${b.image}`} alt={b.title} style={{width:50, height:36, objectFit:'cover', borderRadius:'var(--radius-sm)'}} />
                      ) : <div style={{width:50, height:36, background:'var(--bg-hover)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center'}}><ImageIcon size={16} color="var(--text-muted)" /></div>}
                    </td>
                    <td style={{maxWidth:260}}>
                      <div style={{fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{b.title}</div>
                    </td>
                    <td>{b.author || '--'}</td>
                    <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                    <td>
                      <div className="action-btns">
                        <a href={`/blogs/${b.id}`} className="btn btn-ghost btn-sm"><Edit2 size={14} /> Sửa</a>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: Math.min(total, 7) }, (_, i) => (
              <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
