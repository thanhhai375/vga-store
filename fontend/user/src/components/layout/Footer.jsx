import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="rog-footer">
      <div className="container">
        {/* Breadcrumb / Top Info */}
        <div className="rog-footer-top">
          <div className="rog-breadcrumb">
            <svg className="rog-logo-small" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 2L2 12l20 10V2zM6 12l12-6v12L6 12z" />
            </svg>
            <span className="separator">&gt;</span>
            <span className="current-page">GAMING CARD ĐỒ HỌA</span>
          </div>
        </div>

        <div className="rog-footer-main">
          {/* Cột Links */}
          <div className="rog-footer-links">
            <Link to="/service?tab=Giới thiệu">GIỚI THIỆU VỀ ROG</Link>
            <Link to="/service?tab=Sản phẩm">PRODUCT GUIDE</Link>
            <Link to="/service?tab=Hỗ trợ">HỖ TRỢ</Link>
            <Link to="/">TRANG CHỦ</Link>
            <Link to="/news">NEWSROOM</Link>
          </div>

          {/* Cột Newsletter & Social */}
          <div className="rog-footer-newsletter">
            <span className="newsletter-title">NHẬN CÁC ƯU ĐÃI MỚI NHẤT VÀ NHIỀU HƠN NỮA</span>
            <div className="newsletter-form">
              <input type="email" placeholder="Nhập địa chỉ email" />
              <button className="btn-subscribe">ĐĂNG KÝ</button>
            </div>
            <div className="rog-social-icons">
              <a href="#fb"><i className="fab fa-facebook-f">f</i></a>
              <a href="#tiktok"><i className="fab fa-tiktok">t</i></a>
              <a href="#yt"><i className="fab fa-youtube">y</i></a>
              <a href="#ig"><i className="fab fa-instagram">i</i></a>
              <a href="#x"><i className="fab fa-twitter">x</i></a>
            </div>
          </div>
        </div>

        {/* Cột Legal Info */}
        <div className="rog-footer-legal">
          <p>Công Ty TNHH Công Nghệ Asus (Việt Nam)<br />
            Địa chỉ: 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam<br />
            Giấy chứng nhận đăng ký doanh nghiệp số 0304965680 do Sở Kế hoạch và Đầu tư và Thành phố Hồ Chí Minh cấp ngày 03/05/2007.<br />
            Điện thoại: 1800 65 88<br />
            Giấy phép kinh doanh hoạt động mua bán hàng hóa và các hoạt động liên quan trực tiếp đến mua bán hàng hóa, số 0304965680/KD-0321, do Sở Công thương TP. Hồ Chí Minh cấp lần đầu ngày 24/01/2019.</p>
          <img src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=b5258e72-d48e-4a94-91ce-7ceee6db6bc4" alt="DMCA" className="dmca-badge" />
        </div>

        {/* Footer Bottom */}
        <div className="rog-footer-bottom">
          <div className="lang-selector">
            <i className="fas fa-globe"></i> Vietnam/Việt Nam
          </div>
          <div className="bottom-links">
            <a href="#">QUI CHẾ PHÁP LÝ</a>
            <a href="#">THÔNG TIN HỢP PHÁP</a>
            <span>©ASUSTEK COMPUTER INC. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;