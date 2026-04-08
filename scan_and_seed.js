/**
 * scan_and_seed.js
 * Scan TẤT CẢ ảnh thực tế trong thư mục brand,
 * map ngược về tên sản phẩm từ scraped_products.json,
 * tạo seed_vga.sql hoàn chỉnh.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'c:/Users/thanh/vga-store/fontend/user/public/images/products';
const scraped = JSON.parse(fs.readFileSync('c:/Users/thanh/vga-store/scraped_products.json','utf8'));

// ── Tạo slug chuẩn để match ──────────────────────────
function slugify(name) {
  return name.toLowerCase()
    .replace(/card màn hình\s*/gi, '')
    .replace(/card man hinh\s*/gi, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^\w]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

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

// ── Build slug map từ scraped ──────────────────────────
// Mỗi index trong scraped -> slug của tên
const scrapedSlugMap = scraped.map((p, i) => ({
  idx: i, name: p.name, slug: slugify(p.name)
}));

// ── Scan thư mục ảnh, tạo danh sách entries ──────────
const BRANDS = ['asus','msi','gigabyte','zotac','sparkle','palit','other'];
const entries = [];

for (const brand of BRANDS) {
  const dir = path.join(BASE, brand);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => {
    const fp = path.join(dir, f);
    return fs.statSync(fp).size > 3000 && /\.(jpg|jpeg|png|webp)$/i.test(f);
  });
  
  for (const file of files) {
    // Tạo slug từ tên file (bỏ số index ở cuối và đuôi)
    const fileSlug = file
      .replace(/\.\w+$/, '')         // bỏ đuôi .jpg
      .replace(/_\d{3}$/, '')        // bỏ _003
      .replace(/_/g, ' ')
      .trim();
    
    // Tìm product name khớp tốt nhất từ scraped
    let bestMatch = null;
    let bestScore = 0;
    
    for (const sp of scrapedSlugMap) {
      // So sánh slug
      const spWords = sp.slug.split(' ').filter(w => w.length > 2);
      const fileWords = fileSlug.split(' ').filter(w => w.length > 2);
      const common = spWords.filter(w => fileWords.includes(w)).length;
      const score = common / Math.max(spWords.length, fileWords.length);
      
      if (score > bestScore && score > 0.4) {
        bestScore = score;
        bestMatch = sp;
      }
    }
    
    const productName = bestMatch ? bestMatch.name : fileSlug;
    const imgPath = `/images/products/${brand}/${file}`;
    
    entries.push({ brand, productName, imgPath, file });
  }
}

// Dedup by productName (giữ 1 ảnh tốt nhất cho mỗi sản phẩm)
const seen = new Set();
const unique = [];
for (const e of entries) {
  if (!seen.has(e.productName)) {
    seen.add(e.productName);
    unique.push(e);
  }
}

console.log(`\n📦 Tổng ảnh scan: ${entries.length} | Unique sản phẩm: ${unique.length}\n`);

// ── Generate SQL ──────────────────────────────────────
const brandList = [...new Set(unique.map(e => brandDisplayMap[e.brand] || 'OTHER'))];
const brandsMap = Object.fromEntries(brandList.map((b, i) => [b, i + 1]));
const catIds = { 'NVIDIA': 1, 'AMD': 2, 'Intel': 3 };

let sql = `-- VGA STORE SEED - ${unique.length} SẢN PHẨM - MỖI SẢN PHẨM CÓ ẢNH RIÊNG TỪ GEARVN\n`;
sql += 'TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, brands RESTART IDENTITY CASCADE;\n\n';
sql += 'INSERT INTO brands (id, name, slug, status, deleted, created_at) VALUES\n';
sql += brandList.map((b, i) => `(${i+1},'${esc(b)}','${b.toLowerCase()}',true,false,NOW())`).join(',\n') + ';\n\n';
sql += "INSERT INTO categories (id, name, active, deleted, created_at) VALUES\n";
sql += "(1,'Card Đồ Họa NVIDIA',true,false,NOW()),(2,'Card Đồ Họa AMD',true,false,NOW()),(3,'Card Đồ Họa Intel Arc',true,false,NOW());\n\n";

const rows = unique.map((e, i) => {
  const brandName = brandDisplayMap[e.brand] || 'OTHER';
  const bId = brandsMap[brandName] || 1;
  const specs = detectSpecs(e.productName);
  const cat = e.productName.toUpperCase().match(/RADEON|\bRX\s*\d/) ? 'AMD'
    : e.productName.toUpperCase().includes('ARC') ? 'Intel' : 'NVIDIA';
  const cId = catIds[cat] || 1;
  const cool = coolMap[e.brand] || 'Dual Fan';
  const psu = specs.psu;
  const pwr = psu === '1000W' ? '1x 16-pin (12VHPWR)' : psu === '850W' ? '2x 8-pin' : '1x 8-pin';
  const sku = `${brandName.substring(0,3)}-${specs.gpu.replace(/\s+/g,'').substring(0,8)}-${String(i+1).padStart(3,'0')}`;
  const price = getPrice(e.productName);
  const stock = (i % 18) + 2;
  const desc = `<p>${esc(e.productName)}.</p><p>GPU: <b>${specs.gpu}</b> | VRAM: <b>${specs.vram} ${specs.mem}</b> | PSU: <b>${psu}</b> | Tản nhiệt: ${cool}.</p>`;
  return `(${bId},${cId},'${esc(e.productName)}','${esc(sku)}',${price},${stock},'${esc(desc)}','${e.imgPath}','${e.imgPath}','${esc(specs.gpu)}','${esc(specs.vram)}','${esc(specs.mem)}','${esc(cool)}','${esc(pwr)}','${esc(psu)}','280x120x45mm',false,NOW())`;
});

sql += 'INSERT INTO products (brand_id, category_id, name, sku, price, stock, description, img_url, images_json, gpu_model, vram, memory_type, cooling_type, power_connectors, recommended_psu, dimension, deleted, created_at) VALUES\n';
sql += rows.join(',\n') + ';\n\n';
sql += "SELECT setval('products_id_seq',(SELECT MAX(id) FROM products));\n";
sql += "SELECT setval('brands_id_seq',(SELECT MAX(id) FROM brands));\n";
sql += "SELECT setval('categories_id_seq',3);\n";

fs.writeFileSync('c:/Users/thanh/vga-store/database/seed_vga.sql', sql, 'utf8');

console.log(`🎉 seed_vga.sql: ${unique.length} sản phẩm`);
brandList.forEach(b => {
  const cnt = unique.filter(e => (brandDisplayMap[e.brand]||'OTHER') === b).length;
  console.log(`   ${b.padEnd(10)} ← ${cnt} sản phẩm`);
});
console.log('\n⚠️  Mở PgAdmin → Query Tool → paste seed_vga.sql → F5');
