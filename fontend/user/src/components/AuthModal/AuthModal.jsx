import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Nếu không mở thì không render gì cả
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Ngăn click xuyên qua nội dung làm đóng modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Tiêu đề & Nút đóng */}
        <div className="modal-header">
          <h3>ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Form nhập liệu */}
        <div className="modal-body">
          <div className="text-right mb-10">
            <a href="#phone" className="link-text">Đăng nhập bằng số điện thoại</a>
          </div>

          <input type="email" placeholder="Email" className="auth-input" />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="auth-input"
            />
            <button
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="text-right mb-20">
            <a href="#forgot" className="link-text">Quên mật khẩu email?</a>
          </div>

          <button className="btn-main-login">ĐĂNG NHẬP</button>

          {/* Dải phân cách */}
          <div className="auth-divider">
            <span>hoặc đăng nhập bằng</span>
          </div>

          {/* Đăng nhập mạng xã hội */}
          <div className="social-login-group">
            <button className="btn-social btn-google">
              <span className="icon">G+</span> Google
            </button>
            <button className="btn-social btn-facebook">
              <span className="icon">f</span> Facebook
            </button>
          </div>

          <div className="modal-footer">
            Bạn chưa có tài khoản? <a href="#register" className="register-link">Đăng ký ngay!</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;