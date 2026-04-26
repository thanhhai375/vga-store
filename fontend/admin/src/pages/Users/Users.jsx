import React, { useEffect, useState } from 'react';
import { Search, Lock, Unlock, Trash2 } from 'lucide-react';
import userService from '../../services/userService';
import { toastSuccess, toastError, confirmDelete } from '../../utils/alertUtils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '', fullName: '', role: 'USER' });
  const [adding, setAdding] = useState(false);
  const SIZE = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, size: SIZE, search, role: roleFilter });
      const data = res.data || res;
      if (data.content) { setUsers(data.content); setTotal(data.totalPages || 1); }
      else if (Array.isArray(data)) { setUsers(data); setTotal(1); }
    } catch { setUsers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const handleToggle = async (id) => {
    try { await userService.toggleStatus(id); fetchUsers(); }
    catch { toastError('Thao tác thất bại!'); }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete('Hành động này sẽ xóa người dùng vĩnh viễn khỏi hệ thống!', 'Xác nhận xóa người dùng?');
    if (!isConfirmed) return;
    try { await userService.delete(id); fetchUsers(); toastSuccess('Xóa người dùng thành công!'); }
    catch { toastError('Xóa thất bại!'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await userService.create(newUser);
      toastSuccess('Đã thêm người dùng thành công!');
      setShowAddModal(false);
      setNewUser({ username: '', password: '', email: '', fullName: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng!');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Người dùng</h1>
          <p className="page-subtitle">Quản lý tài khoản hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Thêm người dùng</button>
      </div>

      <div className="card">
        <div className="toolbar" style={{ display: 'flex', gap: '16px' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Tìm tài khoản..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <select 
            className="form-control" 
            style={{ width: '200px', backgroundColor: 'var(--bg-card)' }}
            value={roleFilter} 
            onChange={e => { setRoleFilter(e.target.value); setPage(0); }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
            <option value="USER">Người dùng (User)</option>
          </select>
        </div>

        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
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
                ) : users.map((u, index) => (
                  <tr key={u.id}>
                    <td>{page * SIZE + index + 1}</td>
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
      
      {showAddModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
          <div className="card" style={{width: 400, padding: 24, position: 'relative'}}>
            <h2 style={{marginTop: 0, marginBottom: 20}}>Thêm Người Dùng Mới</h2>
            <form onSubmit={handleAddUser} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input className="form-control" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="Username" />
              </div>
              <div className="form-group">
                <label>Mật khẩu *</label>
                <input className="form-control" type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Mật khẩu" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input className="form-control" type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="Email" />
              </div>
              <div className="form-group">
                <label>Họ tên</label>
                <input className="form-control" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} placeholder="Họ và tên" />
              </div>
              <div className="form-group">
                <label>Vai trò *</label>
                <select className="form-control" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="USER">Người dùng (USER)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Đang thêm...' : 'Lưu tài khoản'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
