import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import brandService from '../../services/brandService';

const Brands = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await brandService.getAll();
      const data = res.data || res;
      setItems(Array.isArray(data) ? data : data.content || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm({ name: '', description: '' }); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ name: item.name, description: item.description || '' }); setEditId(item.id); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editId) await brandService.update(editId, form);
      else await brandService.create(form);
      setShowModal(false);
      fetch();
    } catch { alert('Lưu thất bại!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa thương hiệu?')) return;
    try { await brandService.delete(id); fetch(); }
    catch { alert('Xóa thất bại!'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Thương hiệu</h1>
          <p className="page-subtitle">Quản lý thương hiệu sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Thêm thương hiệu
        </button>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Tên thương hiệu</th><th>Mô tả</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Chưa có thương hiệu</td></tr>
                ) : items.map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td style={{fontWeight:600, color:'var(--text-primary)'}}>{item.name}</td>
                    <td>{item.description || '--'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}><Edit2 size={14} /> Sửa</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label>Tên thương hiệu *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nhập tên thương hiệu" />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mô tả ngắn" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
