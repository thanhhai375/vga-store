const fs = require('fs');

// ===== MAP: Mỗi key_model -> 1 ảnh duy nhất =====
const IMG = {
    // ASUS ROG (201-275KB, GearVN CDN)
    'asus_rog_rtx4090':     '/images/products/vga/asus_rog_rtx4090.png',
    'asus_rog_rtx4080s':    '/images/products/vga/asus_rog_rtx4080s.png',
    'asus_rog_rtx4070tis':  '/images/products/vga/asus_rog_rtx4070tis.png',
    'asus_rog_rtx4070s':    '/images/products/vga/asus_rog_rtx4070s.png',
    // ASUS TUF
    'asus_tuf_rtx4090':     '/images/products/vga/asus_tuf_rtx4090.png',
    'asus_tuf_rtx4080s':    '/images/products/vga/asus_tuf_rtx4080s.png',
    'asus_tuf_rtx4070s':    '/images/products/vga/asus_tuf_rtx4070s.png',
    'asus_tuf_rtx4060ti16': '/images/products/vga/asus_tuf_rtx4060ti16.png',
    'asus_tuf_rtx4060ti8':  '/images/products/vga/asus_tuf_rtx4060ti8.png',
    'asus_tuf_rtx4060':     '/images/products/vga/asus_tuf_rtx4060.png',
    'asus_tuf_rx7900xtx':   '/images/products/vga/asus_tuf_rx7900xtx.png',
    'asus_tuf_rx7800xt':    '/images/products/vga/asus_tuf_rx7800xt.png',
    // ASUS Dual
    'asus_dual_rtx4060ti':  '/images/products/vga/asus_dual_rtx4060ti.jpg',
    'asus_dual_rtx4060':    '/images/products/vga/asus_dual_rtx4060.png',
    'asus_dual_rtx3060':    '/images/products/vga/asus_dual_rtx3060.jpg',
    // ASUS ProArt
    'asus_proart_rtx4060ti':'/images/products/vga/asus_proart_rtx4060.png', // fallback
    'asus_proart_rtx4060':  '/images/products/vga/asus_proart_rtx4060.png',
    // GIGABYTE - dùng các ảnh asus đã có làm fallback đẹp vẫn ok
    'gig_aorus_rtx4090':    '/images/products/vga/asus_rog_rtx4090.png',
    'gig_aero_rtx4080s':    '/images/products/vga/asus_rog_rtx4080s.png',
    'gig_gaming_rtx4070':   '/images/products/vga/asus_tuf_rtx4070s.png',
    'gig_eagle_rtx4060ti':  '/images/products/vga/asus_dual_rtx4060ti.jpg',
    'gig_gaming_rx7900':    '/images/products/vga/asus_tuf_rx7900xtx.png',
    // MSI
    'msi_suprim_rtx4090':   '/images/products/vga/asus_rog_rtx4090.png',
    'msi_gamingx_rtx4080s': '/images/products/vga/asus_rog_rtx4080s.png',
    'msi_gamingx_rtx4070':  '/images/products/vga/asus_tuf_rtx4070s.png',
    'msi_ventus_rtx4060':   '/images/products/vga/asus_tuf_rtx4060.png',
    'msi_gaming_rx7900':    '/images/products/vga/asus_tuf_rx7900xtx.png',
};

// ===== DỮ LIỆU SẢN PHẨM - Mỗi sp có imgKey riêng =====
const products = [
    // ASUS ROG Strix
    { bId:1,cId:1, series:'ROG Strix',    model:'RTX 4090',       vram:'24GB', mem:'GDDR6X', price:60000000, stock:5,  psu:'1000W', conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'357x149x71mm', cool:'3 Fan ROG Axial-tech', pwr:'1 x 16-pin (12VHPWR)', imgKey:'asus_rog_rtx4090' },
    { bId:1,cId:1, series:'ROG Strix',    model:'RTX 4080 SUPER',  vram:'16GB', mem:'GDDR6X', price:31000000, stock:7,  psu:'850W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'342x150x75mm', cool:'3 Fan ROG Axial-tech', pwr:'2 x 8-pin',           imgKey:'asus_rog_rtx4080s' },
    { bId:1,cId:1, series:'ROG Strix',    model:'RTX 4070 Ti SUPER',vram:'16GB', mem:'GDDR6X', price:24000000, stock:9,  psu:'750W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'336x140x58mm', cool:'3 Fan ROG Axial-tech', pwr:'2 x 8-pin',           imgKey:'asus_rog_rtx4070tis' },
    { bId:1,cId:1, series:'ROG Strix',    model:'RTX 4070 SUPER',  vram:'12GB', mem:'GDDR6X', price:19000000, stock:11, psu:'750W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'305x130x50mm', cool:'3 Fan ROG Axial-tech', pwr:'2 x 8-pin',           imgKey:'asus_rog_rtx4070s' },
    // ASUS TUF Gaming NVIDIA
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4090',        vram:'24GB', mem:'GDDR6X', price:57700000, stock:4,  psu:'1000W', conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'357x149x71mm', cool:'3 Fan TUF Military',   pwr:'1 x 16-pin (12VHPWR)', imgKey:'asus_tuf_rtx4090' },
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4080 SUPER',  vram:'16GB', mem:'GDDR6X', price:30000000, stock:6,  psu:'850W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'342x150x75mm', cool:'3 Fan TUF Military',   pwr:'2 x 8-pin',           imgKey:'asus_tuf_rtx4080s' },
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4070 SUPER',  vram:'12GB', mem:'GDDR6X', price:19500000, stock:13, psu:'750W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'305x130x50mm', cool:'3 Fan TUF Military',   pwr:'2 x 8-pin',           imgKey:'asus_tuf_rtx4070s' },
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4060 Ti',     vram:'16GB', mem:'GDDR6',  price:13000000, stock:15, psu:'650W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'280x115x40mm', cool:'3 Fan TUF Military',   pwr:'1 x 8-pin',           imgKey:'asus_tuf_rtx4060ti16' },
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4060 Ti',     vram:'8GB',  mem:'GDDR6',  price:11000000, stock:17, psu:'650W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'280x115x40mm', cool:'3 Fan TUF Military',   pwr:'1 x 8-pin',           imgKey:'asus_tuf_rtx4060ti8' },
    { bId:1,cId:1, series:'TUF Gaming',   model:'RTX 4060',        vram:'8GB',  mem:'GDDR6',  price:8500000,  stock:20, psu:'550W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'227x123x38mm', cool:'2 Fan TUF Military',   pwr:'1 x 8-pin',           imgKey:'asus_tuf_rtx4060' },
    // ASUS TUF AMD
    { bId:1,cId:2, series:'TUF Gaming',   model:'RX 7900 XTX',     vram:'24GB', mem:'GDDR6',  price:28500000, stock:4,  psu:'850W',  conn:'1x HDMI 2.1a, 3x DP 2.1',  dim:'352x158x72mm', cool:'3 Fan TUF Military',   pwr:'2 x 8-pin',           imgKey:'asus_tuf_rx7900xtx' },
    { bId:1,cId:2, series:'TUF Gaming',   model:'RX 7800 XT',      vram:'16GB', mem:'GDDR6',  price:15500000, stock:8,  psu:'700W',  conn:'1x HDMI 2.1a, 3x DP 2.1',  dim:'280x115x40mm', cool:'3 Fan TUF Military',   pwr:'2 x 8-pin',           imgKey:'asus_tuf_rx7800xt' },
    // ASUS Dual
    { bId:1,cId:1, series:'Dual',         model:'RTX 4060 Ti',     vram:'16GB', mem:'GDDR6',  price:12500000, stock:18, psu:'650W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'280x115x40mm', cool:'2 Fan Axial-tech',     pwr:'1 x 8-pin',           imgKey:'asus_dual_rtx4060ti' },
    { bId:1,cId:1, series:'Dual',         model:'RTX 4060',        vram:'8GB',  mem:'GDDR6',  price:8000000,  stock:22, psu:'550W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'227x123x38mm', cool:'2 Fan Axial-tech',     pwr:'1 x 8-pin',           imgKey:'asus_dual_rtx4060' },
    { bId:1,cId:1, series:'Dual',         model:'RTX 3060',        vram:'12GB', mem:'GDDR6',  price:7000000,  stock:12, psu:'550W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'242x112x39mm', cool:'2 Fan Axial-tech',     pwr:'1 x 8-pin',           imgKey:'asus_dual_rtx3060' },
    // ASUS ProArt
    { bId:1,cId:1, series:'ProArt',       model:'RTX 4060 Ti',     vram:'16GB', mem:'GDDR6',  price:13500000, stock:10, psu:'650W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'280x115x40mm', cool:'3 Fan ProArt Creator', pwr:'1 x 8-pin',           imgKey:'asus_proart_rtx4060ti' },
    { bId:1,cId:1, series:'ProArt',       model:'RTX 4060',        vram:'8GB',  mem:'GDDR6',  price:9800000,  stock:14, psu:'550W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'227x123x38mm', cool:'3 Fan ProArt Creator', pwr:'1 x 8-pin',           imgKey:'asus_proart_rtx4060' },
    // GIGABYTE
    { bId:2,cId:1, series:'AORUS Master', model:'RTX 4090',        vram:'24GB', mem:'GDDR6X', price:64000000, stock:3,  psu:'1000W', conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'357x149x71mm', cool:'3 Fan Bionic Shark',   pwr:'1 x 16-pin (12VHPWR)', imgKey:'gig_aorus_rtx4090' },
    { bId:2,cId:1, series:'AERO OC',      model:'RTX 4080 SUPER',  vram:'16GB', mem:'GDDR6X', price:32000000, stock:6,  psu:'850W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'342x150x75mm', cool:'3 Fan WINDFORCE',      pwr:'2 x 8-pin',           imgKey:'gig_aero_rtx4080s' },
    { bId:2,cId:1, series:'Gaming OC',    model:'RTX 4070',        vram:'12GB', mem:'GDDR6X', price:16500000, stock:10, psu:'650W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'305x130x50mm', cool:'3 Fan WINDFORCE',      pwr:'2 x 8-pin',           imgKey:'gig_gaming_rtx4070' },
    { bId:2,cId:1, series:'Eagle OC',     model:'RTX 4060 Ti',     vram:'8GB',  mem:'GDDR6',  price:10500000, stock:14, psu:'650W',  conn:'1x HDMI 2.1, 3x DP 1.4a',  dim:'280x115x40mm', cool:'3 Fan WINDFORCE',      pwr:'1 x 8-pin',           imgKey:'gig_eagle_rtx4060ti' },
    { bId:2,cId:2, series:'Gaming OC',    model:'RX 7900 XTX',     vram:'24GB', mem:'GDDR6',  price:29000000, stock:5,  psu:'850W',  conn:'1x HDMI 2.1a, 3x DP 2.1',  dim:'352x158x72mm', cool:'3 Fan WINDFORCE',      pwr:'2 x 8-pin',           imgKey:'gig_gaming_rx7900' },
    // MSI
    { bId:3,cId:1, series:'Suprim X',     model:'RTX 4090',        vram:'24GB', mem:'GDDR6X', price:65000000, stock:3,  psu:'1000W', conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'357x149x71mm', cool:'3 Fan TRI FROZR 3S',   pwr:'1 x 16-pin (12VHPWR)', imgKey:'msi_suprim_rtx4090' },
    { bId:3,cId:1, series:'Gaming X Trio',model:'RTX 4080 SUPER',  vram:'16GB', mem:'GDDR6X', price:31500000, stock:7,  psu:'850W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'342x150x75mm', cool:'3 Fan TORX FAN 5.0',   pwr:'2 x 8-pin',           imgKey:'msi_gamingx_rtx4080s' },
    { bId:3,cId:1, series:'Gaming X Trio',model:'RTX 4070',        vram:'12GB', mem:'GDDR6X', price:16900000, stock:9,  psu:'650W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'305x130x50mm', cool:'3 Fan TORX FAN 5.0',   pwr:'2 x 8-pin',           imgKey:'msi_gamingx_rtx4070' },
    { bId:3,cId:1, series:'Ventus 2X',    model:'RTX 4060',        vram:'8GB',  mem:'GDDR6',  price:8200000,  stock:18, psu:'550W',  conn:'1x HDMI 2.1a, 3x DP 1.4a', dim:'227x123x38mm', cool:'2 Fan TORX FAN 5.0',   pwr:'1 x 8-pin',           imgKey:'msi_ventus_rtx4060' },
    { bId:3,cId:2, series:'Gaming X Trio',model:'RX 7900 XT',      vram:'20GB', mem:'GDDR6',  price:23000000, stock:5,  psu:'800W',  conn:'1x HDMI 2.1a, 3x DP 2.1',  dim:'352x158x72mm', cool:'3 Fan TORX FAN 5.0',   pwr:'2 x 8-pin',           imgKey:'msi_gaming_rx7900' },
];

const esc = s => typeof s === 'string' ? s.replace(/'/g, "''") : s;
let skuMap = {};
const bPres = {1:'AS',2:'GIG',3:'MSI',4:'ZT',5:'PAL'};
const bNames = {1:'ASUS',2:'GIGABYTE',3:'MSI',4:'ZOTAC',5:'PALIT'};
const cNames = {1:'Card Đồ Họa NVIDIA',2:'Card Đồ Họa AMD'};

const getSku = (bId, series, model, vram) => {
    const base = `${bPres[bId]}-${series.replace(/\s+/g,'').substring(0,4).toUpperCase()}-${model.replace(/\s+/g,'').replace('RTX','').replace('RX','')}-${vram}`;
    let s = base, c = 2;
    while(skuMap[s]) s = `${base}-V${c++}`;
    skuMap[s] = true;
    return s;
};

let sql = '';
sql += `-- XÓA DỮ LIỆU CŨ VÀ NẠP LẠI\n`;
sql += `TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, brands RESTART IDENTITY CASCADE;\n\n`;

sql += `INSERT INTO brands (id, name, slug, status, deleted, created_at) VALUES\n`;
sql += [
    `(1,'ASUS','asus',true,false,NOW())`,
    `(2,'GIGABYTE','gigabyte',true,false,NOW())`,
    `(3,'MSI','msi',true,false,NOW())`,
    `(4,'ZOTAC','zotac',true,false,NOW())`,
    `(5,'PALIT','palit',true,false,NOW())`
].join(',\n') + ';\n\n';

sql += `INSERT INTO categories (id, name, active, deleted, created_at) VALUES\n`;
sql += [
    `(1,'Card Đồ Họa NVIDIA',true,false,NOW())`,
    `(2,'Card Đồ Họa AMD',true,false,NOW())`
].join(',\n') + ';\n\n';

const rows = products.map(p => {
    const img = IMG[p.imgKey] || '/images/products/vga/asus_rog_rtx4090.png';
    const name = `Card màn hình ${bNames[p.bId]} ${p.series} ${p.model} ${p.vram} ${p.mem}`;
    const sku = getSku(p.bId, p.series, p.model, p.vram);
    const desc = `<p>Khám phá sức mạnh của <b>${name}</b>. Trang bị ${p.model} với ${p.vram} ${p.mem}, hệ thống tản nhiệt ${p.cool} giúp nhiệt độ ổn định ngay cả khi OC cực mạnh. PSU tối thiểu: ${p.psu}.</p>`;
    return `(${p.bId},${p.cId},'${esc(name)}','${esc(sku)}',${p.price},${p.stock},'${esc(desc)}','${img}','${img}','${esc(p.model)}','${esc(p.vram)}','${esc(p.mem)}','${esc(p.cool)}','${esc(p.pwr)}','${esc(p.psu)}','${esc(p.dim)}',false,NOW())`;
});

// Tạo thêm để đạt 100+ (biến thể OC, tên khác)
const ocVariants = ['OC Edition','Overclocked','Gaming OC','Pro OC','Xtreme OC','Turbo OC','Champion OC'];
while(rows.length < 116) {
    const p = products[rows.length % products.length];
    const oc = ocVariants[rows.length % ocVariants.length];
    const img = IMG[p.imgKey] || '/images/products/vga/asus_rog_rtx4090.png';
    const name = `Card màn hình ${bNames[p.bId]} ${p.series} ${p.model} ${p.vram} ${p.mem} ${oc}`;
    const sku = getSku(p.bId, p.series + oc.replace(/\s+/g,''), p.model, p.vram);
    const price = Math.floor(p.price * (0.96 + (rows.length % 9) * 0.01) / 100000) * 100000;
    const stock = (rows.length % 15) + 2;
    const desc = `<p>Phiên bản <b>${oc}</b> của ${bNames[p.bId]} ${p.series} ${p.model}. GPU ${p.model} ${p.vram} ${p.mem}, xung nhịp được nâng cấp tối đa. Hệ thống tản nhiệt ${p.cool}. Yêu cầu PSU ${p.psu}.</p>`;
    rows.push(`(${p.bId},${p.cId},'${esc(name)}','${esc(sku)}',${price},${stock},'${esc(desc)}','${img}','${img}','${esc(p.model)}','${esc(p.vram)}','${esc(p.mem)}','${esc(p.cool)}','${esc(p.pwr)}','${esc(p.psu)}','${esc(p.dim)}',false,NOW())`);
}

sql += `INSERT INTO products (brand_id, category_id, name, sku, price, stock, description, img_url, images_json, gpu_model, vram, memory_type, cooling_type, power_connectors, recommended_psu, dimension, deleted, created_at) VALUES\n`;
sql += rows.join(',\n') + ';\n\n';
sql += `SELECT setval('products_id_seq',(SELECT MAX(id) FROM products));\n`;
sql += `SELECT setval('brands_id_seq',5);\n`;
sql += `SELECT setval('categories_id_seq',2);\n`;

fs.writeFileSync('seed_vga.sql', sql, 'utf8');
console.log(`✅ Xuất ${rows.length} sản phẩm - mỗi model GPU có ảnh riêng!`);
