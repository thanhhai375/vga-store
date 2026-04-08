const fs = require('fs');
const path = require('path');

// Đọc file scraped để lấy name <-> img mapping
const scraped = JSON.parse(fs.readFileSync('c:/Users/thanh/vga-store/scraped_products.json','utf8'));
console.log(`Scrapped: ${scraped.length} sản phẩm`);

const BASE = 'c:/Users/thanh/vga-store/fontend/user/public/images/products';

function detectBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('asus')) return 'asus';
  if (/\bmsi\b/.test(n)) return 'msi';
  if (n.includes('gigabyte') || n.includes('aorus')) return 'gigabyte';
  if (n.includes('zotac')) return 'zotac';
  if (n.includes('sparkle')) return 'sparkle';
  if (n.includes('palit')) return 'palit';
  return 'other';
}

function makeFilename(name, idx) {
  const slug = name.toLowerCase()
    .replace(/card màn hình\s*/gi, '')
    .replace(/card man hinh\s*/gi, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^\w]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 52);
  return `${slug}_${String(idx).padStart(3,'0')}.jpg`;
}

function getPrice(name) {
  const n = name.toUpperCase();
  if (n.match(/5090/)) return 85000000;
  if (n.match(/5080/)) return 55000000;
  if (n.match(/4090/)) return 55000000;
  if (n.match(/RTX 5070 TI|RTX5070TI/)) return 35000000;
  if (n.match(/RTX 5070|RTX5070/)) return 28000000;
  if (n.match(/4080 SUPER/)) return 31000000;
  if (n.match(/4080/)) return 28000000;
  if (n.match(/RTX 5060 TI|5060 TI/)) return 19000000;
  if (n.match(/4070 TI SUPER/)) return 24000000;
  if (n.match(/4070 SUPER/)) return 19000000;
  if (n.match(/4070 TI/)) return 21000000;
  if (n.match(/\b4070\b/)) return 16000000;
  if (n.match(/RTX 5060|RTX5060/)) return 14000000;
  if (n.match(/4060 TI/)) return n.includes('16G') || n.includes('16GB') ? 12500000 : 11000000;
  if (n.match(/\b4060\b/)) return 9000000;
  if (n.match(/7900 XTX/)) return 28000000;
  if (n.match(/7900 XT/)) return 22000000;
  if (n.match(/\b7900\b/)) return 20000000;
  if (n.match(/7800/)) return 15000000;
  if (n.match(/7700/)) return 10000000;
  if (n.match(/7600 XT/)) return 9000000;
  if (n.match(/\b7600\b/)) return 7500000;
  if (n.match(/6600/)) return 5500000;
  if (n.match(/6500/)) return 3200000;
  if (n.match(/RTX 5050|RTX5050/)) return 10500000;
  if (n.match(/\b3060\b/)) return 7500000;
  if (n.match(/\b3050\b/)) return 5500000;
  if (n.match(/1650 SUPER/)) return 3800000;
  if (n.match(/\b1650\b/)) return 3500000;
  if (n.match(/B580/)) return 9800000;
  return 8000000;
}

function detectSpecs(name) {
  const n = name.toUpperCase();
  let gpu = 'N/A', vram = '8GB', mem = 'GDDR6', psu = '550W';
  const gm = n.match(/(RTX\s*5090|RTX\s*5080|RTX\s*5070\s*TI|RTX\s*5070|RTX\s*5060\s*TI|RTX\s*5060|RTX\s*5050|RTX\s*4090|RTX\s*4080\s*SUPER|RTX\s*4080|RTX\s*4070\s*TI\s*SUPER|RTX\s*4070\s*SUPER|RTX\s*4070\s*TI|RTX\s*4070|RTX\s*4060\s*TI|RTX\s*4060|RTX\s*3060|RTX\s*3050|GTX\s*1650\s*SUPER|GTX\s*1650|RX\s*7900\s*XTX|RX\s*7900\s*XT|RX\s*7900|RX\s*7800\s*XT|RX\s*7700\s*XT|RX\s*7600\s*XT|RX\s*7600|RX\s*6600|RX\s*6500\s*XT|ARC\s*B580)/);
  if (gm) gpu = gm[1].replace(/\s+/g, ' ').trim();
  if (n.match(/32G\b|32GB/)) { vram = '32GB'; mem = 'GDDR7'; }
  else if (n.match(/24G\b|24GB/)) { vram = '24GB'; if (!n.includes('GDDR7')) mem = 'GDDR6X'; }
  else if (n.match(/20G\b|20GB/)) vram = '20GB';
  else if (n.match(/16G\b|16GB/)) { vram = '16GB'; if (n.includes('GDDR7')) mem = 'GDDR7'; }
  else if (n.match(/12G\b|12GB/)) vram = '12GB';
  else if (n.match(/6G\b|6GB/)) vram = '6GB';
  else if (n.match(/4G\b|4GB/)) vram = '4GB';
  if (n.includes('GDDR7')) mem = 'GDDR7';
  else if (n.includes('GDDR6X')) mem = 'GDDR6X';
  if (n.match(/5090|4090/)) psu = '1000W';
  else if (n.match(/5080|4080/)) psu = '850W';
  else if (n.match(/5070|4070|7900/)) psu = '750W';
  else if (n.match(/5060\s*TI|4060\s*TI|7800|7700/)) psu = '650W';
  else if (n.match(/1650|6500|3050|5050/)) psu = '450W';
  return { gpu, vram, mem, psu };
}

const brandDisplayMap = { 'asus':'ASUS','msi':'MSI','gigabyte':'GIGABYTE','zotac':'ZOTAC','sparkle':'SPARKLE','palit':'PALIT','other':'OTHER' };
const coolMap = { 'asus':'Axial-tech Fan','msi':'TORX FAN 5.0','gigabyte':'WINDFORCE','zotac':'Twin Edge Fan','sparkle':'Titan Fan','palit':'Dual Fan','other':'Dual Fan' };
const esc = s => String(s).replace(/'/g, "''");

// Tạo lookup từ scraped: filename -> name
// Scan từng thư mục brand, map ảnh có sẵn với product name
const done = [];

scraped.forEach((p, idx) => {
  const brand = detectBrand(p.name);
  const fname = makeFilename(p.name, idx);
  const fp = path.join(BASE, brand, fname);
  
  // Kiểm tra file có tồn tại và > 3KB
  if (fs.existsSync(fp) && fs.statSync(fp).size > 3000) {
    const specs = detectSpecs(p.name);
    const cat = p.name.toUpperCase().match(/RADEON|\bRX\s*\d/) ? 'AMD'
      : p.name.toUpperCase().includes('ARC') ? 'Intel' : 'NVIDIA';
    done.push({
      name: p.name,
      brandKey: brand,
      brandName: brandDisplayMap[brand] || brand.toUpperCase(),
      imgPath: `/images/products/${brand}/${fname}`,
      ...specs, cat,
      price: getPrice(p.name),
      stock: (idx % 18) + 2,
      cool: coolMap[brand] || 'Dual Fan'
    });
    process.stdout.write('✅');
  } else {
    process.stdout.write('❌');
  }
});

console.log(`\n\n✅ ${done.length} sản phẩm có ảnh | ❌ ${scraped.length - done.length} không có ảnh`);

// Generate SQL
const brandList = [...new Set(done.map(p => p.brandName))];
const brandsMap = Object.fromEntries(brandList.map((b, i) => [b, i + 1]));
const catIds = { 'NVIDIA': 1, 'AMD': 2, 'Intel': 3 };

let sql = `-- VGA STORE SEED - ${done.length} SẢN PHẨM - MỖI SẢN PHẨM CÓ ẢNH RIÊNG TỪ GEARVN\n`;
sql += 'TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, brands RESTART IDENTITY CASCADE;\n\n';
sql += 'INSERT INTO brands (id, name, slug, status, deleted, created_at) VALUES\n';
sql += brandList.map((b, i) => `(${i+1},'${esc(b)}','${b.toLowerCase()}',true,false,NOW())`).join(',\n') + ';\n\n';
sql += "INSERT INTO categories (id, name, active, deleted, created_at) VALUES\n";
sql += "(1,'Card Đồ Họa NVIDIA',true,false,NOW()),(2,'Card Đồ Họa AMD',true,false,NOW()),(3,'Card Đồ Họa Intel Arc',true,false,NOW());\n\n";

const rows = done.map((p, i) => {
  const bId = brandsMap[p.brandName] || 1;
  const cId = catIds[p.cat] || 1;
  const pwr = p.psu === '1000W' ? '1x 16-pin (12VHPWR)' : p.psu === '850W' ? '2x 8-pin' : '1x 8-pin';
  const sku = `${p.brandName.substring(0,3)}-${p.gpu.replace(/\s+/g,'').substring(0,8)}-${String(i+1).padStart(3,'0')}`;
  const desc = `<p>${esc(p.name)}.</p><p>GPU: <b>${p.gpu}</b> | VRAM: <b>${p.vram} ${p.mem}</b> | PSU: <b>${p.psu}</b> | Tản nhiệt: ${p.cool}.</p>`;
  return `(${bId},${cId},'${esc(p.name)}','${esc(sku)}',${p.price},${p.stock},'${esc(desc)}','${p.imgPath}','${p.imgPath}','${esc(p.gpu)}','${esc(p.vram)}','${esc(p.mem)}','${esc(p.cool)}','${esc(pwr)}','${esc(p.psu)}','280x120x45mm',false,NOW())`;
});

sql += 'INSERT INTO products (brand_id, category_id, name, sku, price, stock, description, img_url, images_json, gpu_model, vram, memory_type, cooling_type, power_connectors, recommended_psu, dimension, deleted, created_at) VALUES\n';
sql += rows.join(',\n') + ';\n\n';
sql += "SELECT setval('products_id_seq',(SELECT MAX(id) FROM products));\n";
sql += "SELECT setval('brands_id_seq',(SELECT MAX(id) FROM brands));\n";
sql += "SELECT setval('categories_id_seq',3);\n";

fs.writeFileSync('c:/Users/thanh/vga-store/database/seed_vga.sql', sql, 'utf8');
console.log(`\n🎉 seed_vga.sql đã tạo với ${done.length} sản phẩm!`);
console.log('\n📁 Phân bố theo brand:');
brandList.forEach(b => {
  const cnt = done.filter(p => p.brandName === b).length;
  console.log(`   ${b.padEnd(10)} ← ${cnt} sản phẩm`);
});
console.log('\n⚠️  MỞ PGADMIN → QUERY TOOL → PASTE seed_vga.sql → F5');
