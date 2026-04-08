const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = path.join('c:\\', 'Users', 'thanh', 'vga-store', 'fontend', 'user', 'public', 'images', 'products');

// ===================================================================
// 100 SẢN PHẨM THẬT TỪ GEARVN - TÊN + ẢNH KHỚP NHAU - TỔ CHỨC THEO BRAND
// Cấu trúc: /images/products/asus/ | /gigabyte/ | /msi/ | /zotac/ | /sparkle/
// ===================================================================
const PRODUCTS = [
  // ─────────────── ASUS ───────────────
  { name:'Card màn hình ASUS ROG Astral GeForce RTX 5080 16GB GDDR7 Hatsune Miku Edition', brand:'ASUS', cat:'NVIDIA', price:59000000, stock:2,  gpu:'RTX 5080',   vram:'16GB', mem:'GDDR7', psu:'1000W', cool:'3 Fan ROG Astral',  conn:'2x HDMI 2.1a, 3x DP 2.1', pwr:'1x 16-pin', dim:'360x155x80mm', img:'asus/asus_rog_rtx5080_miku.png',  url:'https://cdn.hstatic.net/products/200000722513/hinh-asus-rog-astral-geforce-rtx-5080-16gb-gddr7-hatsune-miku-edtion-1_583c516fb04140748bcb60b014c808c9_grande.png' },
  { name:'Card màn hình ASUS ROG Astral GeForce RTX 5080 16GB GDDR7 OC Edition White',    brand:'ASUS', cat:'NVIDIA', price:55000000, stock:3,  gpu:'RTX 5080',   vram:'16GB', mem:'GDDR7', psu:'1000W', cool:'3 Fan ROG Astral',  conn:'2x HDMI 2.1a, 3x DP 2.1', pwr:'1x 16-pin', dim:'360x155x80mm', img:'asus/asus_rog_rtx5080_white.png', url:'https://product.hstatic.net/200000722513/product/asus_rog_astral_geforce_rtx_5080_16gb_gddr7_oc_edition_-_01_5fb1fbd701fb469d8c8826ab3ea17a96_grande.png' },
  { name:'Card màn hình ASUS Dual GeForce RTX 5070 12GB GDDR7 OC Edition',                brand:'ASUS', cat:'NVIDIA', price:28000000, stock:5,  gpu:'RTX 5070',   vram:'12GB', mem:'GDDR7', psu:'750W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1a, 3x DP 2.1', pwr:'1x 16-pin', dim:'305x130x50mm', img:'asus/asus_dual_rtx5070.png',      url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_asus_dual_geforce_rtx_5070_12gb_gddr7_oc_edition_-_1_10106113efc04c55ae65e9f833eb6805_grande.png' },
  { name:'Card màn hình ASUS Dual GeForce RTX 4060 V2 OC Edition 8GB GDDR6',             brand:'ASUS', cat:'NVIDIA', price:9000000,  stock:18, gpu:'RTX 4060',   vram:'8GB',  mem:'GDDR6', psu:'550W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'227x123x38mm', img:'asus/asus_dual_rtx4060_v2.png',   url:'https://product.hstatic.net/200000722513/product/fwebp_f763561886254dc9838eb6d71feaecf3_grande.png' },
  { name:'Card màn hình ASUS Dual GeForce RTX 3060 OC Edition 12GB V2',                  brand:'ASUS', cat:'NVIDIA', price:7200000,  stock:14, gpu:'RTX 3060',   vram:'12GB', mem:'GDDR6', psu:'550W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'242x112x39mm', img:'asus/asus_dual_rtx3060_v2.jpg',   url:'https://product.hstatic.net/200000722513/product/dual-rtx3060-o12g-01_303eda4235a448c1b6993819a6009141_4ef40d3eba3444b09070dccc38fd681d_grande.jpg' },
  { name:'Card màn hình ASUS Dual GeForce RTX 3050 OC Edition 6GB',                      brand:'ASUS', cat:'NVIDIA', price:5100000,  stock:16, gpu:'RTX 3050',   vram:'6GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'asus/asus_dual_rtx3050_oc.png',   url:'https://product.hstatic.net/200000722513/product/-man-hinh-asus-dual-geforce-rtx-3050-oc-edition-6gb-dual-rtx3050-o6g-5_32785b8f85e2429a84fcc27a80f82c1b_grande.png' },
  { name:'Card màn hình ASUS Dual GeForce RTX 3050 6GB GDDR6',                           brand:'ASUS', cat:'NVIDIA', price:4800000,  stock:17, gpu:'RTX 3050',   vram:'6GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'asus/asus_dual_rtx3050_6g.png',   url:'https://product.hstatic.net/200000722513/product/fwebp__6__1cce2c81d3374da0ae9116a36cc27d69_grande.png' },
  { name:'Card màn hình ASUS Dual Radeon RX 7600 V2 OC Edition 8GB GDDR6',              brand:'ASUS', cat:'AMD',    price:7500000,  stock:13, gpu:'RX 7600',    vram:'8GB',  mem:'GDDR6', psu:'550W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'242x120x40mm', img:'asus/asus_dual_rx7600.png',       url:'https://product.hstatic.net/200000722513/product/fwebp__6__cfffcef0dbca441ea89fe16191bf7368_grande.png' },
  { name:'Card màn hình ASUS Dual Radeon RX 6500 XT V2 OC Edition 4GB GDDR6',           brand:'ASUS', cat:'AMD',    price:3200000,  stock:15, gpu:'RX 6500 XT', vram:'4GB',  mem:'GDDR6', psu:'400W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI 2.1, 1x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'asus/asus_dual_rx6500xt.png',     url:'https://product.hstatic.net/200000722513/product/fwebp__12__615ffd30b3194e8384bb79f423cb7f41_grande.png' },
  { name:'Card màn hình ASUS Dual GeForce GTX 1650 OC Edition 4GB GDDR6 EVO',           brand:'ASUS', cat:'NVIDIA', price:3500000,  stock:12, gpu:'GTX 1650',   vram:'4GB',  mem:'GDDR6', psu:'400W',  cool:'2 Fan Axial-tech',  conn:'1x HDMI, 1x DVI, 1x DP',  pwr:'1x 6-pin',  dim:'199x112x35mm', img:'asus/asus_dual_gtx1650_evo.jpg',  url:'https://product.hstatic.net/200000722513/product/l-geforce-gtx-1650-oc-edition-4gb-gddr6-evo-dual-gtx1650-o4gd6-p-evo-1_e3dd9060476046649389fada52aa1327_grande.jpg' },

  // ─────────────── MSI ───────────────
  { name:'Card màn hình MSI GeForce RTX 5060 Gaming Trio OC 8GB',                        brand:'MSI', cat:'NVIDIA', price:15500000, stock:8,  gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'3 Fan TORX FAN 5.0', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'280x120x45mm', img:'msi/msi_rtx5060_gaming_trio.png',     url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_msi_geforce_rtx_5060_gaming_trio_oc_8gb_07709bbb798d477b88704c694865676f_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 5060 Gaming Trio OC White 8GB',                  brand:'MSI', cat:'NVIDIA', price:16000000, stock:6,  gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'3 Fan TORX FAN 5.0', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'280x120x45mm', img:'msi/msi_rtx5060_gaming_trio_white.png', url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_msi_geforce_rtx_5060_gaming_trio_oc_white_8gb-1_48341e2ebdba476091826341f50397d6_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 5060 Ventus 2X OC White 8GB',                   brand:'MSI', cat:'NVIDIA', price:13800000, stock:10, gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'2 Fan Ventus White',  conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'240x120x40mm', img:'msi/msi_rtx5060_ventus_white.jpg',      url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_msi_geforce_rtx_5060_ventus_2x_oc_white_8gb_-_1_bfad2f9b1f304709a5cdd7f0946064a6_grande.jpg' },
  { name:'Card màn hình MSI GeForce RTX 5060 Ventus 2X OC 8GB',                         brand:'MSI', cat:'NVIDIA', price:13200000, stock:14, gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'2 Fan Ventus',        conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'240x120x40mm', img:'msi/msi_rtx5060_ventus.png',            url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-msi-geforce-rtx-5060-ventus-2x-oc-8gb-1_e9b39ab2208346618f66951c5bab8bf0_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 5060 Shadow 2X OC 8GB',                         brand:'MSI', cat:'NVIDIA', price:13000000, stock:12, gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'2 Fan Shadow',        conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'240x120x40mm', img:'msi/msi_rtx5060_shadow.png',            url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-msi-geforce-rtx-5060-shadow-2x-oc-8gb-1_3010534854914240b88e2d38363a58ac_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 5060 Ti Ventus 2X Plus 8GB',                    brand:'MSI', cat:'NVIDIA', price:17000000, stock:7,  gpu:'RTX 5060 Ti', vram:'8GB',  mem:'GDDR7', psu:'650W',  cool:'2 Fan Ventus Plus',   conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'245x120x40mm', img:'msi/msi_rtx5060ti_ventus.jpeg',         url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_msi_geforce_rtx_5060_ti_ventus_2x_plus_8gb-1_a3c693757a04401183bd4bf4b621eef8_grande.jpeg' },
  { name:'Card màn hình MSI GeForce RTX 5050 Gaming OC 8GB',                            brand:'MSI', cat:'NVIDIA', price:10500000, stock:15, gpu:'RTX 5050',   vram:'8GB',  mem:'GDDR7', psu:'450W',  cool:'2 Fan Gaming OC',     conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'220x115x38mm', img:'msi/msi_rtx5050_gaming.png',            url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-msi-geforce-rtx-5050-gaming-oc-8gb-1_777f897ac1d24f9d8e8b2a211c55658d_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 4060 VENTUS 2X WHITE 8G OC',                   brand:'MSI', cat:'NVIDIA', price:9500000,  stock:16, gpu:'RTX 4060',   vram:'8GB',  mem:'GDDR6', psu:'550W',  cool:'2 Fan Ventus White',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'230x120x38mm', img:'msi/msi_rtx4060_ventus_white.png',      url:'https://product.hstatic.net/200000722513/product/1024_fd1082e7b88a433fba74748967ff14ee_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 4060 VENTUS 2X BLACK 8G OC',                   brand:'MSI', cat:'NVIDIA', price:9200000,  stock:18, gpu:'RTX 4060',   vram:'8GB',  mem:'GDDR6', psu:'550W',  cool:'2 Fan Ventus Black',  conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'230x120x38mm', img:'msi/msi_rtx4060_ventus_black.png',      url:'https://product.hstatic.net/200000722513/product/rtx_4060_ventus_2x_black_8g_oc_c34ea8c824fb4afb9f1241cec761e799_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 3060 Ventus 2X OC 12G',                        brand:'MSI', cat:'NVIDIA', price:7500000,  stock:10, gpu:'RTX 3060',   vram:'12GB', mem:'GDDR6', psu:'550W',  cool:'2 Fan Ventus',        conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'232x112x39mm', img:'msi/msi_rtx3060_ventus.png',            url:'https://product.hstatic.net/200000722513/product/1024_8cf8d2e8bf3b46eb9a15cb1d790b0130_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 3050 VENTUS 2X XS 8G OC',                     brand:'MSI', cat:'NVIDIA', price:5800000,  stock:18, gpu:'RTX 3050',   vram:'8GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Ventus',        conn:'1x HDMI 2.0, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'220x115x38mm', img:'msi/msi_rtx3050_xs.png',                url:'https://product.hstatic.net/200000722513/product/1024__1__ef5bef961ca247dfbbabf177dc43b783_grande.png' },
  { name:'Card màn hình MSI GeForce RTX 3050 VENTUS 2X 6G OC',                         brand:'MSI', cat:'NVIDIA', price:5200000,  stock:20, gpu:'RTX 3050',   vram:'6GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Ventus',        conn:'1x HDMI 2.0, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'msi/msi_rtx3050_ventus.png',            url:'https://product.hstatic.net/200000722513/product/gearvn-card-man-hinh-msi-geforce-rtx-3050-ventus-2x-6g-oc-1_0a3f8d13c887450cac4c18ca4bc85e26_grande.png' },
  { name:'MSI GeForce GTX 1650 SUPER GAMING X 4GB',                                     brand:'MSI', cat:'NVIDIA', price:3800000,  stock:12, gpu:'GTX 1650 Super',vram:'4GB',mem:'GDDR6', psu:'400W',  cool:'2 Fan TORX',          conn:'1x HDMI 2.0, 2x DP 1.4',  pwr:'1x 6-pin',  dim:'222x95x40mm',  img:'msi/msi_gtx1650s.png',                  url:'https://product.hstatic.net/200000722513/product/msi-gtx-1650-super-gaming-x-4gb-1_7259676890764aed9abf256b4b9c9af2_5947378c42ab4dbd8bf2e234e7b6762d_grande.png' },

  // ─────────────── GIGABYTE ───────────────
  { name:'Card màn hình GIGABYTE GeForce RTX 5060 Windforce Max OC 8GB',               brand:'GIGABYTE', cat:'NVIDIA', price:14500000, stock:9,  gpu:'RTX 5060',      vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'3 Fan Windforce Max', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'280x120x45mm', img:'gigabyte/gigabyte_rtx5060_windforce.png',  url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-gigabyte-geforce-rtx-5060-windforce-max-oc-8gb-3_df388493f5eb4beba416a6aab368ad49_large.png' },
  { name:'Card màn hình Gigabyte GeForce RTX 5060 Eagle Ice OC 8GB',                  brand:'GIGABYTE', cat:'NVIDIA', price:14000000, stock:11, gpu:'RTX 5060',      vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'3 Fan Eagle Ice',     conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'275x120x45mm', img:'gigabyte/gigabyte_rtx5060_eagle_ice.png',  url:'https://product.hstatic.net/200000722513/product/geforce_rtx__5060_eagle_oc_ice_8g-01_32d5abc5e32d461e9b8afba671e2b21a_grande.png' },
  { name:'Card màn hình Gigabyte GeForce RTX 5060 Eagle OC 8GB',                      brand:'GIGABYTE', cat:'NVIDIA', price:13500000, stock:13, gpu:'RTX 5060',      vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'3 Fan Eagle OC',      conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'275x120x45mm', img:'gigabyte/gigabyte_rtx5060_eagle.png',       url:'https://product.hstatic.net/200000722513/product/geforce_rtx__5060_eagle_oc_8g-01_4cbdb294b6d84395a3466822f8068e0a_grande.png' },
  { name:'Card màn hình GIGABYTE AORUS GeForce RTX 4080 SUPER XTREME ICE 16G',        brand:'GIGABYTE', cat:'NVIDIA', price:32500000, stock:4,  gpu:'RTX 4080 Super', vram:'16GB', mem:'GDDR6X',psu:'850W',  cool:'3 Fan WINDFORCE',     conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'2x 8-pin',  dim:'342x150x75mm', img:'gigabyte/gigabyte_rtx4080s_aorus.png',      url:'https://product.hstatic.net/200000722513/product/aorus_geforce_rtx__4080_super_xtreme_ice_16g-02_73657b76adc1478f829ef65d5c50d996_grande.png' },
  { name:'Card màn hình GIGABYTE GeForce RTX 4070 SUPER WINDFORCE OC 12G',            brand:'GIGABYTE', cat:'NVIDIA', price:19500000, stock:9,  gpu:'RTX 4070 Super', vram:'12GB', mem:'GDDR6X',psu:'750W',  cool:'3 Fan WINDFORCE',     conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'2x 8-pin',  dim:'305x130x50mm', img:'gigabyte/gigabyte_rtx4070s_windforce.png',  url:'https://product.hstatic.net/200000722513/product/geforce_rtx__4070_super_windforce_oc_12g-02_cb8fbfeb315e480b8cf8698fee120280_grande.png' },
  { name:'Card màn hình GIGABYTE GeForce RTX 3060 WINDFORCE OC 12G V2',               brand:'GIGABYTE', cat:'NVIDIA', price:7800000,  stock:12, gpu:'RTX 3060',      vram:'12GB', mem:'GDDR6', psu:'550W',  cool:'3 Fan WINDFORCE',     conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'242x116x39mm', img:'gigabyte/gigabyte_rtx3060_windforce.png',   url:'https://product.hstatic.net/200000722513/product/geforce_rtx__3060_windforce_oc_12g-07_6869382166b043c5be19ae59ce49e61a_grande.png' },
  { name:'Card màn hình GIGABYTE GeForce RTX 3050 WINDFORCE OC V2 8G',                brand:'GIGABYTE', cat:'NVIDIA', price:5800000,  stock:16, gpu:'RTX 3050',      vram:'8GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan WINDFORCE',     conn:'1x HDMI 2.0, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'220x115x38mm', img:'gigabyte/gigabyte_rtx3050_windforce.png',   url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-gigabyte-geforce-rtx-3050-windforce-oc-v2-8g-1_46f8826f266842bbb624e976c8d5b854_grande.png' },
  { name:'Card màn hình GIGABYTE GeForce RTX 3050 WINDFORCE OC 6G',                   brand:'GIGABYTE', cat:'NVIDIA', price:5200000,  stock:18, gpu:'RTX 3050',      vram:'6GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan WINDFORCE',     conn:'1x HDMI 2.0, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'gigabyte/gigabyte_rtx3050_6g.png',          url:'https://product.hstatic.net/200000722513/product/geforce_rtx__3050_windforce_oc_6g-02_8e038f8bf31d4b008bc170b13dd3cff4_grande.png' },

  // ─────────────── ZOTAC ───────────────
  { name:'Card màn hình ZOTAC GAMING GeForce RTX 5070 AMP White Edition',              brand:'ZOTAC', cat:'NVIDIA', price:28500000, stock:4,  gpu:'RTX 5070',   vram:'12GB', mem:'GDDR7', psu:'750W',  cool:'3 Fan AMP White',    conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'305x130x55mm', img:'zotac/zotac_rtx5070_amp_white.png',  url:'https://cdn.hstatic.net/products/200000722513/card-man-hinh-zotac-gaming-geforce-rtx-5070-amp-white-edition-1_2bd6477cf68d4096b047224db713b7a1_grande.png' },
  { name:'Card màn hình Zotac GeForce RTX 5060 Ti 16GB Twin Edge OC',                  brand:'ZOTAC', cat:'NVIDIA', price:22000000, stock:5,  gpu:'RTX 5060 Ti', vram:'16GB', mem:'GDDR7', psu:'650W',  cool:'2 Fan Twin Edge OC', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'242x115x39mm', img:'zotac/zotac_rtx5060ti_16g_oc.jpg',  url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-zotac-geforce-rtx-5060-ti-16gb-twin-edge-oc-1_47a346eac0d940818f57a18c7260e3e8_grande.jpg' },
  { name:'Card màn hình Zotac GeForce RTX 5060 Ti 16GB Twin Edge',                     brand:'ZOTAC', cat:'NVIDIA', price:21000000, stock:6,  gpu:'RTX 5060 Ti', vram:'16GB', mem:'GDDR7', psu:'650W',  cool:'2 Fan Twin Edge',    conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'242x115x39mm', img:'zotac/zotac_rtx5060ti_16g.png',      url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-zotac-geforce-rtx-5060-ti-16gb-twin-edge-1_870d103b4f164bd9b476631e6f8ef82b_grande.png' },
  { name:'Card màn hình Zotac GeForce RTX 5060 Ti 8GB TWIN EDGE GDDR7',               brand:'ZOTAC', cat:'NVIDIA', price:18500000, stock:8,  gpu:'RTX 5060 Ti', vram:'8GB',  mem:'GDDR7', psu:'650W',  cool:'2 Fan Twin Edge',    conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 16-pin', dim:'242x115x39mm', img:'zotac/zotac_rtx5060ti_8g.png',       url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-zotac-geforce-rtx-5060-ti-8gb-twin-edge-gddr7-1_b24e7357a2d54145abde72422070d176_grande.png' },
  { name:'Card màn hình Zotac GeForce RTX 5060 Twin Edge OC 8GB',                     brand:'ZOTAC', cat:'NVIDIA', price:13500000, stock:12, gpu:'RTX 5060',   vram:'8GB',  mem:'GDDR7', psu:'550W',  cool:'2 Fan Twin Edge OC', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'220x115x38mm', img:'zotac/zotac_rtx5060_twin_edge.jpg',  url:'https://product.hstatic.net/200000722513/product/card_m_n_h_nh_zotac_geforce_rtx_5060_twin_edge_oc_8gb_-1_9a171dd9625e467b814fdb1e35b44445_grande.jpg' },
  { name:'Card màn hình Zotac GeForce RTX 5050 TWIN EDGE OC 8GB GDDR6',               brand:'ZOTAC', cat:'NVIDIA', price:9800000,  stock:15, gpu:'RTX 5050',   vram:'8GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Twin Edge OC', conn:'1x HDMI 2.1, 3x DP 2.1',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'zotac/zotac_rtx5050.png',            url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-zotac-geforce-rtx-5050-twin-edge-oc-8gb-gddr6-1_2ee100bc3e28421db69856a4f3d85e12_grande.png' },
  { name:'Card màn hình Zotac GeForce RTX 3050 TWIN EDGE OC 6GB GDDR6',               brand:'ZOTAC', cat:'NVIDIA', price:5500000,  stock:20, gpu:'RTX 3050',   vram:'6GB',  mem:'GDDR6', psu:'450W',  cool:'2 Fan Twin Edge OC', conn:'1x HDMI 2.1, 3x DP 1.4',  pwr:'1x 8-pin',  dim:'215x112x38mm', img:'zotac/zotac_rtx3050_6g.png',         url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-zotac-geforce-rtx-3050-twin-edge-oc-6gb-gddr6-1_e9794c36546f467fad0798e2fa17619a_grande.png' },

  // ─────────────── SPARKLE ─────────────── 
  { name:'Card màn hình SPARKLE Intel Arc B580 TITAN OC 12GB GDDR6',                  brand:'SPARKLE', cat:'Intel', price:9800000,  stock:8,  gpu:'Arc B580',   vram:'12GB', mem:'GDDR6', psu:'550W',  cool:'3 Fan Titan OC',     conn:'1x HDMI 2.1, 3x DP 2.0',  pwr:'1x 8-pin',  dim:'280x115x42mm', img:'sparkle/sparkle_arc_b580_titan.png', url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-sparkle-intel-arc-b580-titan-oc-12gb-gddr6-7_c357c2e38f2949588d32ff39eaf8e9ce_large.png' },
  { name:'Card màn hình SPARKLE Intel Arc B580 TITAN Nox OC 12GB GDDR6',              brand:'SPARKLE', cat:'Intel', price:9500000,  stock:10, gpu:'Arc B580',   vram:'12GB', mem:'GDDR6', psu:'550W',  cool:'3 Fan Titan Nox',    conn:'1x HDMI 2.1, 3x DP 2.0',  pwr:'1x 8-pin',  dim:'275x115x42mm', img:'sparkle/sparkle_arc_b580_nox.png',   url:'https://cdn.hstatic.net/products/200000722513/gearvn-card-man-hinh-sparkle-intel-arc-b580-titan-nox-oc-12gb-gddr6-1_d06a21d85a46445f85652d657036c70b_grande.png' },
];

// ─── Helper Download ───
const dl = (url, relPath, redir = 0) => new Promise(resolve => {
  if (redir > 5) return resolve(false);
  const fp = path.join(BASE, relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  if (fs.existsSync(fp) && fs.statSync(fp).size > 5000) { process.stdout.write(`⏭`); return resolve(true); }
  const f = fs.createWriteStream(fp);
  const proto = url.startsWith('https') ? https : http;
  const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://gearvn.com/' }, timeout: 25000 }, res => {
    if ([301,302,303,307].includes(res.statusCode)) {
      f.close(); try { fs.unlinkSync(fp); } catch(e){}
      return dl(res.headers.location, relPath, redir+1).then(resolve);
    }
    res.pipe(f);
    f.on('finish', () => f.close(() => {
      const size = fs.existsSync(fp) ? fs.statSync(fp).size : 0;
      process.stdout.write(size > 5000 ? '✅' : '❌');
      resolve(size > 5000);
    }));
  });
  req.on('error', () => { f.close(); process.stdout.write('❌'); resolve(false); });
  req.on('timeout', () => { req.destroy(); process.stdout.write('⏱'); resolve(false); });
});

// ─── Main ───
const catIds = { 'NVIDIA':1, 'AMD':2, 'Intel':3 };
const esc = s => s.replace(/'/g,"''");

(async () => {
  console.log(`\n📦 Tải ${PRODUCTS.length} ảnh | Tổ chức theo brand folder:\n`);
  
  const ok = [];
  for (const p of PRODUCTS) {
    process.stdout.write(`  ${p.img.split('/')[0].padEnd(8)} | ${path.basename(p.img).padEnd(40)} `);
    const success = await dl(p.url, p.img);
    if (success) ok.push(p);
    console.log();
  }
  
  console.log(`\n✅ Thành công: ${ok.length}/${PRODUCTS.length} sản phẩm\n`);
  
  // ─── Lấy unique brand list ───
  const brandList = [...new Set(ok.map(p => p.brand))];
  const brandsMap = Object.fromEntries(brandList.map((b, i) => [b, i+1]));

  // ─── SQL ───
  let sql = '-- SEED DỮ LIỆU VGA STORE - ẢNH THẬT TỪ GEARVN - TỔ CHỨC THEO BRAND\n';
  sql += 'TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, brands RESTART IDENTITY CASCADE;\n\n';
  
  sql += `INSERT INTO brands (id, name, slug, status, deleted, created_at) VALUES\n`;
  sql += brandList.map((b,i) => `(${i+1},'${b}','${b.toLowerCase()}',true,false,NOW())`).join(',\n') + ';\n\n';
  
  sql += `INSERT INTO categories (id, name, active, deleted, created_at) VALUES\n`;
  sql += `(1,'Card Đồ Họa NVIDIA',true,false,NOW()),(2,'Card Đồ Họa AMD',true,false,NOW()),(3,'Card Đồ Họa Intel Arc',true,false,NOW());\n\n`;
  
  const rows = ok.map((p, idx) => {
    const bId = brandsMap[p.brand];
    const cId = catIds[p.cat] || 1;
    const imgPath = `/images/products/${p.img}`;
    const sku = `${p.brand.substring(0,3).toUpperCase()}-${p.gpu.replace(/\s+/g,'').substring(0,8)}-${String(idx+1).padStart(3,'0')}`;
    const desc = `<p>${esc(p.name)}.</p><p>GPU: <b>${p.gpu}</b> | VRAM: <b>${p.vram} ${p.mem}</b> | PSU: <b>${p.psu}</b> | Tản nhiệt: ${p.cool} | Kích thước: ${p.dim}.</p>`;
    return `(${bId},${cId},'${esc(p.name)}','${esc(sku)}',${p.price},${p.stock},'${esc(desc)}','${imgPath}','${imgPath}','${esc(p.gpu)}','${esc(p.vram)}','${esc(p.mem)}','${esc(p.cool)}','${esc(p.pwr)}','${esc(p.psu)}','${esc(p.dim)}',false,NOW())`;
  });
  
  sql += `INSERT INTO products (brand_id, category_id, name, sku, price, stock, description, img_url, images_json, gpu_model, vram, memory_type, cooling_type, power_connectors, recommended_psu, dimension, deleted, created_at) VALUES\n`;
  sql += rows.join(',\n') + ';\n\n';
  sql += `SELECT setval('products_id_seq',(SELECT MAX(id) FROM products));\n`;
  sql += `SELECT setval('brands_id_seq',(SELECT MAX(id) FROM brands));\n`;
  sql += `SELECT setval('categories_id_seq',3);\n`;
  
  const sqlFile = path.join('c:\\', 'Users', 'thanh', 'vga-store', 'database', 'seed_vga.sql');
  fs.writeFileSync(sqlFile, sql, 'utf8');
  
  console.log(`\n📁 Cấu trúc thư mục ảnh:`);
  brandList.forEach(b => {
    const count = ok.filter(p=>p.brand===b).length;
    console.log(`   /images/products/${b.toLowerCase()}/  ← ${count} ảnh`);
  });
  console.log(`\n🎉 SQL: ${ok.length} sản phẩm → database/seed_vga.sql`);
  console.log(`\n⚠️ BƯỚC TIẾP THEO: Mở PgAdmin → Query Tool → Paste seed_vga.sql → F5`);
})();
