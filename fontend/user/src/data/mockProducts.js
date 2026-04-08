import img1 from './img/1.png';
import img2 from './img/2.png';
import img3 from './img/3.png';

export const mockProducts = [
  {
    id: 1,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ROG Strix", id: 1 },
    name: "ASUS ROG Strix RTX 4090 - Black Edition",
    price: 55000000,
    img: img1,
    thumbnail: img1,
    stock: 5,
    badge: "FLAGSHIP",
    specs: { vram: "24GB GDDR6X", bus: "384-bit", boost: "2610 MHz", tdp: "450W" },
    description: "Card đồ họa hàng đầu dành cho game thủ đam mê hiệu năng tuyệt đỉnh. Thiết kế tản nhiệt 3 quạt với công nghệ Axial-tech Fan độc quyền."
  },
  {
    id: 2,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ROG Strix", id: 1 },
    name: "ASUS ROG Strix RTX 4090 - White Edition",
    price: 57000000,
    img: img3,
    thumbnail: img3,
    stock: 3,
    badge: "LIMITED",
    specs: { vram: "24GB GDDR6X", bus: "384-bit", boost: "2640 MHz", tdp: "450W" },
    description: "Phiên bản trắng giới hạn của ROG Strix RTX 4090. Sang trọng, mạnh mẽ và cực kỳ quý hiếm trên thị trường Việt Nam."
  },
  {
    id: 3,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ROG Strix", id: 1 },
    name: "ASUS ROG Strix RTX 4090 - OC Edition",
    price: 58500000,
    img: img2,
    thumbnail: img2,
    stock: 2,
    badge: "OC",
    specs: { vram: "24GB GDDR6X", bus: "384-bit", boost: "2670 MHz", tdp: "480W" },
    description: "Phiên bản Over-Clocked từ nhà máy, tốc độ boost lên đến 2670MHz. Dành cho những ai muốn đẩy giới hạn hiệu năng."
  },
  {
    id: 4,
    brand: { name: "ASUS", id: 1 },
    category: { name: "TUF Gaming", id: 2 },
    name: "ASUS TUF Gaming RTX 4080 Super OC",
    price: 28000000,
    img: img1,
    thumbnail: img1,
    stock: 8,
    badge: "BEST VALUE",
    specs: { vram: "16GB GDDR6X", bus: "256-bit", boost: "2595 MHz", tdp: "320W" },
    description: "Hiệu năng gaming 4K tuyệt vời trong tầm giá hợp lý. Thiết kế Military-grade bền bỉ của dòng TUF nổi tiếng."
  },
  {
    id: 5,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ProArt", id: 3 },
    name: "ASUS ProArt RTX 4080 - Creator Edition",
    price: 32000000,
    img: img2,
    thumbnail: img2,
    stock: 4,
    badge: "CREATOR",
    specs: { vram: "16GB GDDR6X", bus: "256-bit", boost: "2505 MHz", tdp: "285W" },
    description: "Card đồ họa chuyên nghiệp cho các nhà thiết kế, kiến trúc sư và video editor. Tối ưu hóa cho phần mềm sáng tạo."
  },
  {
    id: 6,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ASUS Dual", id: 4 },
    name: "ASUS Dual RTX 4070 Ti Super OC",
    price: 19500000,
    img: img3,
    thumbnail: img3,
    stock: 12,
    badge: "HOT",
    specs: { vram: "16GB GDDR6X", bus: "256-bit", boost: "2640 MHz", tdp: "285W" },
    description: "Lựa chọn gaming 1440p hoàn hảo. Dual-fan compact nhưng mạnh mẽ, phù hợp cho các case mini-ITX hay mid-tower."
  },
  {
    id: 7,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ROG Matrix", id: 5 },
    name: "ASUS ROG Matrix RTX 4090 Platinum",
    price: 75000000,
    img: img1,
    thumbnail: img1,
    stock: 1,
    badge: "ULTRA",
    specs: { vram: "24GB GDDR6X", bus: "384-bit", boost: "2850 MHz", tdp: "516W" },
    description: "Siêu phẩm hàng đầu từ ASUS với tản nhiệt liquid-metal tích hợp sẵn. Giới hạn tốc độ của RTX 4090 bị phá vỡ hoàn toàn."
  },
  {
    id: 8,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ROG Astral", id: 6 },
    name: "ASUS ROG Astral RTX 5090 - First Edition",
    price: 95000000,
    img: img2,
    thumbnail: img2,
    stock: 1,
    badge: "NEW 2026",
    specs: { vram: "32GB GDDR7", bus: "512-bit", boost: "3100 MHz", tdp: "575W" },
    description: "Thế hệ GPU mới nhất từ NVIDIA. Kiến trúc Blackwell mang lại hiệu năng đột phá với 32GB GDDR7 và ray-tracing thế hệ tiếp theo."
  },
  {
    id: 9,
    brand: { name: "ASUS", id: 1 },
    category: { name: "ASUS Dual", id: 4 },
    name: "ASUS Dual RTX 4060 Ti - EVO Edition",
    price: 10500000,
    img: img3,
    thumbnail: img3,
    stock: 15,
    badge: "BUDGET KING",
    specs: { vram: "8GB GDDR6", bus: "128-bit", boost: "2535 MHz", tdp: "165W" },
    description: "Card gaming 1080p tốt nhất trong phân khúc dưới 12 triệu. Tiết kiệm điện, hoạt động êm ái với hệ Axial Fan 0dB."
  },
  {
    id: 10,
    brand: { name: "ASUS", id: 1 },
    category: { name: "TUF Gaming", id: 2 },
    name: "ASUS TUF Gaming RTX 4070 Super OC",
    price: 16000000,
    img: img1,
    thumbnail: img1,
    stock: 7,
    badge: "TOP PICK",
    specs: { vram: "12GB GDDR6X", bus: "192-bit", boost: "2565 MHz", tdp: "220W" },
    description: "Điểm ngọt nhất của dòng RTX 40 Series. Hiệu năng gaming 1440p xuất sắc, giá thành hợp lý cho build tầm trung cao cấp."
  }
];
