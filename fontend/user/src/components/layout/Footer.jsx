import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        {/* PHẦN TRÊN: 4 CỘT THÔNG TIN */}
        <div className="footer-top">
          {/* Cột 1 */}
          <div className="footer-col">
            <h4 className="footer-heading">VỀ VGA STORE</h4>
            <ul className="footer-links">
              <li><Link to="/about">Giới thiệu</Link></li>
              <li><Link to="/careers">Tuyển dụng</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className="footer-col">
            <h4 className="footer-heading">CHÍNH SÁCH</h4>
            <ul className="footer-links">
              <li><Link to="/policy/warranty">Chính sách bảo hành</Link></li>
              <li><Link to="/policy/shipping">Chính sách giao hàng</Link></li>
              <li><Link to="/policy/privacy">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="footer-col">
            <h4 className="footer-heading">THÔNG TIN</h4>
            <ul className="footer-links">
              <li><Link to="/stores">Hệ thống cửa hàng</Link></li>
              <li><Link to="/guide/buy">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/guide/payment">Hướng dẫn thanh toán</Link></li>
              <li><Link to="/guide/installment">Hướng dẫn trả góp</Link></li>
              <li><Link to="/build-pc">Build PC</Link></li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="footer-col support-col">
            <h4 className="footer-heading">TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)</h4>
            <ul className="footer-support">
              <li>Mua hàng: <a href="tel:19005301">1900.5301</a></li>
              <li>Bảo hành: <a href="tel:19005325">1900.5325</a></li>
              <li>Khiếu nại: <a href="tel:18006173">1800.6173</a></li>
              <li>Email: <a href="mailto:cskh@vgastore.com">cskh@vgastore.com</a></li>
            </ul>
          </div>
        </div>

        {/* ĐƯỜNG KẺ NGANG PHÂN CÁCH */}
        <div className="footer-divider"></div>

        {/* PHẦN DƯỚI: KẾT NỐI MẠNG XÃ HỘI */}
        <div className="footer-bottom">
          <div className="social-connect">
            <span className="social-text">KẾT NỐI VỚI CHÚNG TÔI</span>
            <div className="social-links">
              {/* FACEBOOK */}
              <a href="#fb" className="social-icon fb">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03.58-2 2.12-2H18.5V2.13C17.7 2.03 16.94 2 16.14 2 13.68 2 12 3.48 12 6.17v3.33H9v4h3v8h3v-8Z"></path></svg>
              </a>
              {/* TIKTOK */}
              <a href="#tiktok" className="social-icon tk">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53 2s-.13 0-.2.03C10.74 2.13 9 3.84 9 5.89V15c0 1.65-1.35 3-3 3s-3-1.35-3-3 1.35-3 3-3c.27 0 .53.04.78.11V6.11a5.97 5.97 0 0 0-3.78 5.61C6.01 15.19 8.81 18 12.23 18s6.22-2.81 6.22-6.22c0-2.43-1.42-4.54-3.48-5.52.01-.15.02-.31.02-.46V2s1.42.06 2.13.84a6.01 6.01 0 0 0 3.82 2.17V2s-1.42-.06-2.13-.84A5.99 5.99 0 0 0 12.53 2Z"></path></svg>
              </a>
              {/* YOUTUBE */}
              <a href="#yt" className="social-icon yt">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3L10 15Z"></path></svg>
              </a>
            </div>
          </div>
          <p className="copyright-text">&copy; 2026 VGA STORE. Designed for Extreme Gaming.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;