import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Service.css';

const MENU_ITEMS = [
  'Giới thiệu', 'Hệ thống cửa hàng', 'Bảng giá thu sản phẩm cũ',
  'Hỗ trợ kỹ thuật tận nơi', 'Tra cứu thông tin bảo hành',
  'Chính sách giao hàng', 'Chính sách bảo hành', 'Thanh toán',
  'Mua hàng trả góp', 'Hướng dẫn mua hàng', 'Chính sách bảo mật',
  'Điều khoản dịch vụ', 'Dịch vụ vệ sinh miễn phí'
];

const Service = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'Giới thiệu');

  useEffect(() => {
    if (tabFromUrl && MENU_ITEMS.includes(tabFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabFromUrl);
      window.scrollTo(0, 0);
    }
  }, [tabFromUrl]);

  const handleTabClick = (item) => {
    setActiveTab(item);
    setSearchParams({ tab: item });
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (activeTab) {
     case 'Giới thiệu':
        return (
          <div className="tab-pane about-simple-section">
            <h2 className="tab-title">Giới thiệu VGA STORE</h2>
            <p className="tab-desc">Hơn một thập kỷ dẫn đầu thị trường linh kiện máy tính Hi-End, VGA STORE tự hào là điểm đến tin cậy của hàng nghìn game thủ, streamer và các chuyên gia sáng tạo trên khắp Việt Nam. Chúng tôi không chỉ bán phần cứng; chúng tôi mang đến những giải pháp sức mạnh tính toán tiên tiến nhất.</p>

            {/* Đã bỏ cột Lịch sử, phần Giá trị cốt lõi sẽ tự động tràn full viền rất đẹp */}
            <div className="about-values" style={{ marginTop: '30px' }}>
              <h3 className="tab-subtitle">Sứ mệnh & Tầm nhìn</h3>
              <p className="tab-desc">Cung cấp sức mạnh tính toán tối đa, giúp mọi người chinh phục mọi thử thách trong thế giới số. Trở thành hệ thống bán lẻ công nghệ số 1 Đông Nam Á.</p>

              <h3 className="tab-subtitle">Sức mạnh lõi - Đội ngũ & Dịch vụ</h3>
              <div className="core-values-grid">
                <div className="value-simple-card">
                  <span className="value-simple-icon">⚡</span>
                  <div className="value-simple-info">
                    <h4>Kỹ thuật Hi-End</h4>
                    <p>Đội ngũ chuyên gia dày dặn kinh nghiệm lắp ráp PC, custom watercooling.</p>
                  </div>
                </div>
                <div className="value-simple-card">
                  <span className="value-simple-icon">🤝</span>
                  <div className="value-simple-info">
                    <h4>Hợp tác Chính hãng</h4>
                    <p>Làm việc trực tiếp với NVIDIA, AMD, ASUS, đảm bảo hỗ trợ tốt nhất.</p>
                  </div>
                </div>
                <div className="value-simple-card">
                  <span className="value-simple-icon">🎯</span>
                  <div className="value-simple-info">
                    <h4>Tư vấn Cá nhân hóa</h4>
                    <p>Cung cấp giải pháp PC tối ưu cho từng nhu cầu chơi game hay máy trạm render.</p>
                  </div>
                </div>
              </div>

              <h3 className="tab-subtitle">Giá trị cốt lõi</h3>
              <ul className="tab-list">
                <li><b>TẬN TÂM:</b> Coi khách hàng là trọng tâm, luôn lắng nghe và đáp ứng vượt mong đợi.</li>
                <li><b>CHUYÊN NGHIỆP:</b> Quy trình làm việc rõ ràng, nhanh chóng và chính xác.</li>
                <li><b>TỐC ĐỘ:</b> Phản hồi và xử lý dịch vụ cực nhanh, không để khách hàng chờ đợi.</li>
              </ul>
            </div>
          </div>
        );
      case 'Hệ thống cửa hàng':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Hệ thống Showroom VGA STORE</h2>
            <p className="tab-desc">Chúng tôi luôn mở cửa từ <b>08:00 đến 21:00</b> tất cả các ngày trong tuần (kể cả Lễ, Tết).</p>
            <div className="store-list">
              <div className="store-card">
                <h4>📍 Showroom trụ sở - Hà Nội</h4>
                <p><b>Địa chỉ:</b> 123 Thái Hà, Phường Trung Liệt, Quận Đống Đa, TP. Hà Nội</p>
                <p><b>Hotline:</b> 1900.5301 (Nhánh 1)</p>
              </div>
              <div className="store-card">
                <h4>📍 Showroom trung tâm - TP.HCM</h4>
                <p><b>Địa chỉ:</b> 456 Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí Minh</p>
                <p><b>Hotline:</b> 1900.5301 (Nhánh 2)</p>
              </div>
            </div>
          </div>
        );

      case 'Bảng giá thu sản phẩm cũ':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Chương trình: Thu Cũ Đổi Mới (Trade-in)</h2>
            <p className="tab-desc">Nâng cấp bộ máy của bạn dễ dàng hơn bao giờ hết với chương trình trợ giá thu cũ đổi mới lên đến <b>15%</b>.</p>
            <table className="tab-table">
              <thead>
                <tr>
                  <th>Tình trạng sản phẩm</th>
                  <th>Mức giá thu lại (So với giá thị trường)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Hàng Fullbox, còn bảo hành hãng &gt; 12 tháng</td><td>Thu lại <b>80% - 85%</b></td></tr>
                <tr><td>Hàng No-box, còn bảo hành hãng &lt; 12 tháng</td><td>Thu lại <b>70% - 75%</b></td></tr>
                <tr><td>Hàng hết bảo hành, hình thức đẹp, hoạt động tốt</td><td>Thu lại <b>50% - 60%</b></td></tr>
                <tr><td>Hàng lỗi nhẹ (nóng, rỉ sét tản nhiệt)</td><td>Thương lượng trực tiếp sau khi test</td></tr>
              </tbody>
            </table>
            <p className="tab-note">* Lưu ý: Giá trên chỉ mang tính chất tham khảo. Kỹ thuật viên sẽ kiểm tra thực tế (Furmark test) trước khi báo giá cuối cùng.</p>
          </div>
        );

      case 'Tra cứu thông tin bảo hành':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Tra cứu thông tin & Tình trạng bảo hành</h2>
            <p className="tab-desc">Quý khách vui lòng nhập chính xác Số điện thoại mua hàng hoặc Mã Serial Number (S/N) trên sản phẩm để kiểm tra.</p>
            <div className="warranty-form">
              <input type="text" placeholder="Nhập SĐT hoặc Mã S/N (VD: 0987654321)..." className="warranty-input" />
              <button className="warranty-btn">KIỂM TRA BẢO HÀNH</button>
            </div>
            <div className="warranty-result">
              <p><i>* Kết quả tra cứu sẽ được hiển thị tại đây...</i></p>
            </div>
          </div>
        );

      case 'Chính sách bảo hành':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Chính sách bảo hành sản phẩm</h2>
            <h3 className="tab-subtitle">1. Điều kiện bảo hành</h3>
            <ul className="tab-list">
              <li>Sản phẩm còn trong thời hạn bảo hành được tính kể từ ngày giao hàng.</li>
              <li>Tem bảo hành của VGA STORE và tem của nhà phân phối phải còn nguyên vẹn.</li>
              <li>Số Serial/IMEI trên sản phẩm phải trùng khớp với trên hệ thống.</li>
            </ul>
            <h3 className="tab-subtitle">2. Các trường hợp TỪ CHỐI bảo hành</h3>
            <ul className="tab-list">
              <li>Sản phẩm bị can thiệp phần cứng (tự ý tháo ốc, độ chế tản nhiệt).</li>
              <li>Sản phẩm bị hư hỏng do tác động cơ học (rơi vỡ, móp méo, trầy xước sâu).</li>
              <li>Sản phẩm bị cháy nổ do nguồn điện không ổn định hoặc côn trùng xâm nhập.</li>
            </ul>
            <p className="tab-desc"><b>Cam kết:</b> Đổi mới 100% trong vòng 7 ngày đầu tiên nếu sản phẩm phát sinh lỗi phần cứng từ nhà sản xuất.</p>
          </div>
        );

      case 'Chính sách giao hàng':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Chính sách & Thời gian giao hàng</h2>
            <table className="tab-table">
              <thead>
                <tr>
                  <th>Khu vực giao hàng</th>
                  <th>Phương thức</th>
                  <th>Thời gian dự kiến</th>
                  <th>Phí giao hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Nội thành HN & TP.HCM</td><td>Giao hỏa tốc (Grab/Ahamove)</td><td>Trong vòng 2 giờ</td><td>Miễn phí (Đơn &gt; 5tr)</td></tr>
                <tr><td>Ngoại thành HN & TP.HCM</td><td>Giao xe tải / CPN</td><td>Trong ngày</td><td>20.000đ - 50.000đ</td></tr>
                <tr><td>Các tỉnh thành khác</td><td>Chuyển phát GHTK / Viettel Post</td><td>2 - 4 ngày làm việc</td><td>Theo cước bưu điện</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'Thanh toán':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Hướng dẫn thanh toán</h2>
            <p className="tab-desc">VGA STORE cung cấp các phương thức thanh toán an toàn, bảo mật và tiện lợi nhất cho khách hàng.</p>
            <h3 className="tab-subtitle">1. Thanh toán tiền mặt / Quẹt thẻ</h3>
            <ul className="tab-list">
              <li>Thanh toán trực tiếp bằng tiền mặt tại các quầy thu ngân của hệ thống Showroom.</li>
              <li>Hỗ trợ quẹt thẻ nội địa (ATM) và thẻ quốc tế (Visa, Mastercard, JCB) miễn phí quẹt thẻ.</li>
            </ul>
            <h3 className="tab-subtitle">2. Chuyển khoản ngân hàng (Internet Banking)</h3>
            <ul className="tab-list">
              <li>Cú pháp chuyển khoản: <b>[Mã đơn hàng] - [Số điện thoại]</b></li>
              <li>Ngân hàng Vietcombank - STK: <b>0123456789</b> - Chủ TK: CÔNG TY TNHH VGA STORE</li>
              <li>Hệ thống sẽ tự động xác nhận đơn hàng sau 2-5 phút kể từ khi nhận được thanh toán.</li>
            </ul>
            <h3 className="tab-subtitle">3. Thanh toán khi nhận hàng (COD)</h3>
            <p className="tab-desc">Áp dụng cho các đơn hàng có giá trị dưới 20.000.000 VNĐ. Quý khách được quyền kiểm tra tình trạng ngoại quan của sản phẩm trước khi thanh toán cho nhân viên giao hàng.</p>
          </div>
        );

      case 'Mua hàng trả góp':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Chính sách Mua hàng Trả góp 0%</h2>
            <p className="tab-desc">Sở hữu ngay bộ máy tính mơ ước mà không cần lo lắng về tài chính với chính sách trả góp siêu ưu đãi.</p>
            <h3 className="tab-subtitle">1. Trả góp qua Thẻ tín dụng (Visa/Mastercard)</h3>
            <ul className="tab-list">
              <li><b>Lãi suất 0%:</b> Hỗ trợ hơn 25 ngân hàng lớn (Sacombank, Techcombank, VPBank, VIB...).</li>
              <li><b>Kỳ hạn linh hoạt:</b> Lựa chọn trả góp trong 3, 6, 9, hoặc 12 tháng.</li>
              <li><b>Thủ tục:</b> Không cần duyệt hồ sơ, chỉ cần thẻ tín dụng còn đủ hạn mức. Mất một khoản phí chuyển đổi trả góp nhỏ (tùy ngân hàng).</li>
            </ul>
            <h3 className="tab-subtitle">2. Trả góp qua Công ty tài chính (HD Saison, Home Credit)</h3>
            <ul className="tab-list">
              <li><b>Thủ tục đơn giản:</b> Chỉ cần Căn cước công dân (CCCD) gắn chip.</li>
              <li><b>Duyệt siêu tốc:</b> Nhận kết quả duyệt hồ sơ chỉ trong 15 - 30 phút tại Showroom.</li>
              <li><b>Trả trước linh hoạt:</b> Chỉ từ 10% - 30% giá trị sản phẩm.</li>
            </ul>
          </div>
        );

      case 'Hướng dẫn mua hàng':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Hướng dẫn Đặt hàng Trực tuyến</h2>
            <p className="tab-desc">Quy trình mua hàng trên website VGA STORE được thiết kế tối giản, giúp bạn chốt đơn chỉ trong 4 bước:</p>
            <ul className="tab-list">
              <li><b>Bước 1 - Tìm kiếm:</b> Sử dụng thanh tìm kiếm hoặc duyệt qua Menu danh mục để tìm sản phẩm mong muốn.</li>
              <li><b>Bước 2 - Thêm vào giỏ:</b> Xem chi tiết cấu hình, chọn số lượng và nhấn nút "THÊM VÀO GIỎ" hoặc "MUA NGAY".</li>
              <li><b>Bước 3 - Nhập thông tin:</b> Điền đầy đủ thông tin giao hàng (Tên, SĐT, Địa chỉ). Bạn có thể đăng nhập để tích điểm thành viên.</li>
              <li><b>Bước 4 - Thanh toán:</b> Chọn phương thức thanh toán phù hợp và nhấn "XÁC NHẬN ĐƠN HÀNG". Hệ thống sẽ gửi email hoặc SMS xác nhận mã đơn.</li>
            </ul>
            <p className="tab-note">* Trong vòng 30 phút sau khi đặt hàng (giờ hành chính), tổng đài viên sẽ gọi điện để xác nhận thời gian giao hàng với bạn.</p>
          </div>
        );

      case 'Chính sách bảo mật':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Chính sách Bảo mật Thông tin</h2>
            <p className="tab-desc">Sự riêng tư của khách hàng là ưu tiên hàng đầu tại VGA STORE. Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn tuân thủ theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</p>
            <h3 className="tab-subtitle">1. Mục đích thu thập dữ liệu</h3>
            <ul className="tab-list">
              <li>Xử lý và giao đơn hàng chính xác đến địa chỉ của bạn.</li>
              <li>Lưu trữ thông tin để phục vụ công tác tra cứu bảo hành điện tử về sau.</li>
              <li>Gửi email/SMS thông báo trạng thái đơn hàng hoặc các chương trình khuyến mãi (nếu bạn cho phép).</li>
            </ul>
            <h3 className="tab-subtitle">2. Cam kết bảo mật</h3>
            <p className="tab-desc">Chúng tôi <b>TUYỆT ĐỐI KHÔNG</b> bán, chia sẻ hoặc trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ 3 nào khác vì mục đích thương mại. Dữ liệu thanh toán thẻ được mã hóa qua cổng thanh toán quốc tế chuẩn PCI DSS.</p>
          </div>
        );

      case 'Điều khoản dịch vụ':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Điều khoản Dịch vụ chung</h2>
            <p className="tab-desc">Bằng việc truy cập và sử dụng website vgastore.com, quý khách mặc nhiên đồng ý với các điều khoản dưới đây:</p>
            <ul className="tab-list">
              <li><b>Bản quyền nội dung:</b> Mọi hình ảnh, bài viết, thông số kỹ thuật trên website đều thuộc bản quyền của VGA STORE. Mọi hành vi sao chép phải trích dẫn nguồn rõ ràng.</li>
              <li><b>Giá cả và thông tin:</b> Chúng tôi nỗ lực đảm bảo giá cả và thông tin tồn kho chính xác nhất. Tuy nhiên, trong một số trường hợp lỗi hệ thống, VGA STORE có quyền từ chối hoặc hủy các đơn hàng có giá sai lệch (và sẽ hoàn tiền 100% nếu khách đã thanh toán).</li>
              <li><b>Hành vi gian lận:</b> VGA STORE bảo lưu quyền khóa tài khoản hoặc từ chối phục vụ đối với các khách hàng có dấu hiệu bom hàng liên tục, spam hệ thống hoặc sử dụng thẻ tín dụng gian lận.</li>
            </ul>
          </div>
        );

      case 'Dịch vụ vệ sinh miễn phí':
        return (
          <div className="tab-pane">
            <h2 className="tab-title">Đặc quyền: Vệ sinh PC miễn phí trọn đời</h2>
            <p className="tab-desc">Khách hàng mua PC nguyên bộ hoặc Card màn hình tại VGA STORE sẽ được hưởng đặc quyền vệ sinh phần cứng hoàn toàn MIỄN PHÍ trọn đời.</p>
            <h3 className="tab-subtitle">Quy trình vệ sinh tiêu chuẩn:</h3>
            <ul className="tab-list">
              <li>Bước 1: Tiếp nhận máy, test nhiệt độ và hiệu năng ban đầu.</li>
              <li>Bước 2: Hút bụi, thổi bụi các linh kiện bằng máy nén khí chuyên dụng.</li>
              <li>Bước 3: Vệ sinh cánh quạt, khe tản nhiệt bằng cọ mềm và dung dịch.</li>
              <li>Bước 4: Tra lại keo tản nhiệt hiệu năng cao (Arctic MX-4 / MX-6).</li>
              <li>Bước 5: Lắp ráp, đi lại dây cáp gọn gàng và test lại nhiệt độ.</li>
            </ul>
            <p className="tab-note">* Khách hàng vui lòng mang máy trực tiếp tới hệ thống Showroom. Thời gian xử lý dự kiến: 45 - 60 phút.</p>
          </div>
        );

      case 'Hỗ trợ kỹ thuật tận nơi':
        return (
          <div className="technical-support">
            <h2 className="tab-title">VGA STORE hợp tác với ALD Service cung cấp dịch vụ kỹ thuật tại nhà</h2>
            <div className="service-banner">
              <img src="https://images.unsplash.com/photo-1612815154858-60aa4c59abe6?auto=format&fit=crop&q=80&w=1200" alt="Tech Service" />
            </div>
            <p className="service-intro">Chúng tôi mang đến giải pháp lắp ráp và bảo trì máy tính ngay tại nhà bạn với chi phí tối ưu nhất.</p>
            <div className="combo-box">
              <h4 className="combo-box-title">COMBO LẮP ĐẶT - 449.000đ</h4>
              <p className="tab-desc" style={{textAlign:'center', fontWeight:'bold', marginBottom:'15px'}}>Dành cho khách hàng đang có linh kiện cần lắp ráp một bộ PC mới tại nhà!</p>
              <ul className="tab-list">
                <li>Kiểm tra tình trạng linh kiện tương thích.</li>
                <li>Lắp ráp & đi dây cable management chuyên nghiệp trong PC.</li>
                <li>Cài đặt Windows và các phần mềm, driver cơ bản.</li>
              </ul>
              <p className="tab-note" style={{textAlign:'center'}}><b>Bảo hành:</b> 7 ngày kể từ khi hoàn tất dịch vụ.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="service-page container">
      <div className="service-layout">
        <div className="service-sidebar">
          <ul className="service-menu">
            {MENU_ITEMS.map((item, index) => (
              <li
                key={index}
                className={activeTab === item ? 'active' : ''}
                onClick={() => handleTabClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="service-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Service;