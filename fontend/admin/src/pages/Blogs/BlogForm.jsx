import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import blogService from '../../services/blogService';
import { toastSuccess, toastError } from '../../utils/alertUtils';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', category: '', excerpt: '', author: ''
  });
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Hm x l URL nh thng minh
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    if (url.startsWith('/images/')) return `http://localhost:5173${url}`;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    if (isEdit) {
      blogService.getById(id).then(res => {
        // axiosClient unwrap 1 lp: res = { success, message, data: Blog }
        const b = res.data || res;
        if (!b || !b.title) {
          toastError('Không tìm thấy bài viết');
          navigate('/blogs');
          return;
        }
        setForm({
          title: b.title || '', 
          category: b.category || '', 
          excerpt: b.excerpt || '', 
          author: b.author || ''
        });
        setContent(b.content || '');
        // c field thumbnail (t backend Blog entity)
        const thumbUrl = b.thumbnail || b.image;
        if (thumbUrl) setPreview(getImageUrl(thumbUrl) || thumbUrl);
        setLoading(false);
      }).catch((e) => {
        toastError('Không tìm thấy bài viết');
        navigate('/blogs');
      });
    }
  }, [id, navigate, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return toastError('Vui lòng điền đủ thông tin tiêu đề, thể loại');
    
    setSaving(true);
    const formData = new FormData();
    formData.append('blog', new Blob([JSON.stringify({
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      author: form.author,
      content: content
    })], { type: 'application/json' }));
    
    if (file) formData.append('image', file);

    try {
      if (isEdit) {
        await blogService.update(id, formData);
      } else {
        await blogService.create(formData);
      }
      toastSuccess('Lưu bài viết thành công!');
      navigate('/blogs');
    } catch (e) {
      toastError(e?.response?.data?.message || 'Đã có lỗi xảy ra khi lưu bài viết!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/blogs')} style={{marginBottom: 8}}><ArrowLeft size={16}/> Quay lại</button>
          <h1 className="page-title">{isEdit ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h1>
        </div>
        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Xuất bản</button>
      </div>

      <div className="card" style={{maxWidth: 1000}}>
        <form onSubmit={handleSave} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          <div className="form-group">
            <label>Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            <div className="form-group">
              <label>Thể loại *</label>
              <input type="text" className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Tác giả</label>
              <input type="text" className="form-control" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Tóm tắt (Excerpt)</label>
            <textarea className="form-control" rows={3} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Ảnh bìa</label>
            <div style={{display:'flex', gap: 20, alignItems: 'center'}}>
              <div style={{width: 200, height: 110, border: '1px dashed var(--border)', borderRadius: 8, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                {preview ? <img src={preview} alt="preview" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <ImageIcon color="var(--text-muted)"/>}
              </div>
              <div>
                <label className="btn btn-ghost" style={{cursor: 'pointer'}}>
                  <Upload size={16} /> Chọn ảnh...
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Nội dung bài viết</label>
            <textarea 
              className="form-control" 
              rows={15} 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Nhập nội dung tĩnh hoặc mã JSON/HTML tuỳ theo định dạng phân tích của Client..." 
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default BlogForm;
