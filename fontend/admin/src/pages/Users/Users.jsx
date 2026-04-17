import React, { useEffect, useState } from 'react';
import { Search, Lock, Unlock, Trash2 } from 'lucide-react';
import userService from '../../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const SIZE = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, size: SIZE, search });
      const data = res.data || res;
      if (data.content) { setUsers(data.content); setTotal(data.totalPages || 1); }
      else if (Array.isArray(data)) { setUsers(data); setTotal(1); }
    } catch { setUsers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleToggle = async (id) => {
    try { await userService.toggleStatus(id); fetchUsers(); }
    catch { alert('Thao tác thất bại!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa người dùng?')) return;
    try { await userService.delete(id); fetchUsers(); }
    catch { alert('Xóa thất bại!'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Người dùng</h1>
          <p className="page-subtitle">Quản lý tài khoản hệ thống</p>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Tìm tài khoản..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>
        </div>

        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Không có người dùng</td></tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{fontWeight: 600, color: 'var(--text-primary)'}}>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.fullName || '--'}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'STAFF' ? 'badge-info' : 'badge-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status ? 'badge-success' : 'badge-danger'}`}>
                        {u.status ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u.id)}>
                          {u.status ? <><Lock size={14} /> Khóa</> : <><Unlock size={14} /> Mở</>}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={14} /> Xóa</button>
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

export default Users;
