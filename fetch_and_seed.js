const https = require('https');
const fs = require('fs');
const path = require('path');

// Fetch một URL và trả về HTML text
const fetchHtml = (url) => new Promise((resolve, reject) => {
  const opts = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'vi-VN,vi;q=0.9',
      'Referer': 'https://gearvn.com/'
    }
  };
  https.get(url, opts, res => {
    if ([301,302,303,307].includes(res.statusCode)) {
      return fetchHtml(res.headers.location).then(resolve).catch(reject);
    }
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => resolve(data));
  }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('timeout')); });
});

// Parse sản phẩm từ HTML của GearVN
function parseProducts(html) {
  const products = [];
  // Match product link blocks - GearVN pattern
  const linkRe = /href="(\/products\/[^"]+)"[^>]*title="([^"]+)"[\s\S]*?<img[^>]+(?:data-src|src)="([^"]+hstatic[^"]+)"/g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const name = m[2].trim();
    let img = m[3].trim();
    if (img.startsWith('//')) img = 'https:' + img;
    img = img.replace('_compact','_grande').replace('_small','_grande').replace('_medium','_grande').replace('_large','_grande');
    if (name.length < 8 || !img.includes('hstatic')) continue;
    products.push({ name, img });
  }
  return products;
}

// Download ảnh
const downloadImg = (url, dest, redir = 0) => new Promise(resolve => {
  if (redir > 5) return resolve(false);
  const fp = path.join('c:\\Users\\thanh\\vga-store\\fontend\\user\\public\\images\\products', dest);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  if (fs.existsSync(fp) && fs.statSync(fp).size > 3000) return resolve(true);
  const f = fs.createWriteStream(fp);
  const req = https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://gearvn.com/' },
    timeout: 20000
  }, res => {
    if ([301,302,303,307].includes(res.statusCode)) {
      f.close(); try { fs.unlinkSync(fp); } catch(e){}
      return downloadImg(res.headers.location, dest, redir+1).then(resolve);
    }
    res.pipe(f);
    f.on('finish', () => f.close(() => {
      const s = fs.existsSync(fp) ? fs.statSync(fp).size : 0;
      resolve(s > 3000);
    }));
  });
  req.on('error', () => { f.close(); resolve(false); });
  req.on('timeout', () => { req.destroy(); resolve(false); });
});

// Tạo tên file an toàn từ product name
function makeFilename(name, brand) {
  return name.toLowerCase()
    .replace(/card màn hình\s*/i, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 60) + '.png';
}

// Detect brand từ tên
function detectBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('asus')) return 'asus';
  if (n.includes('msi')) return 'msi';
  if (n.includes('gigabyte') || n.includes('aorus')) return 'gigabyte';
  if (n.includes('zotac')) return 'zotac';
  if (n.includes('sparkle')) return 'sparkle';
  if (n.includes('palit')) return 'palit';
  if (n.includes('inno3d') || n.includes('inno')) return 'inno3d';
  if (n.includes('powercolor')) return 'powercolor';
  if (n.includes('sapphire')) return 'sapphire';
  return 'other';
}

// Detect GPU model để điền thông số
function detectSpecs(name) {
  const n = name.toUpperCase();
  let gpu = 'N/A', vram = '8GB', mem = 'GDDR6', psu = '550W';
  
  // GPU model
  const gpuMatch = n.match(/(RTX\s*50[0-9][05](?:\s*TI)?|RTX\s*40[0-9][05](?:\s*(?:TI|SUPER|Ti))?|RX\s*7[0-9]{3}\s*(?:XTX|XT)?|GTX\s*16[0-9][50]\s*(?:SUPER)?|ARC\s*[AB][0-9]+)/);
  if (gpuMatch) gpu = gpuMatch[1].replace(/\s+/g,' ').trim();
  
  // VRAM
  if (n.includes('32G') || n.includes('32 G') || n.includes('32GB')) { vram = '32GB'; mem = 'GDDR7'; }
  else if (n.includes('24G') || n.includes('24GB')) { vram = '24GB'; mem = 'GDDR6X'; }
  else if (n.includes('20G') || n.includes('20GB')) { vram = '20GB'; }
  else if (n.includes('16G') || n.includes('16GB')) { vram = '16GB'; if (n.includes('GDDR7')) mem = 'GDDR7'; }
  else if (n.includes('12G') || n.includes('12GB')) { vram = '12GB'; }
  else if (n.includes('8G') || n.includes('8GB')) { vram = '8GB'; }
  else if (n.includes('6G') || n.includes('6GB')) { vram = '6GB'; }
  else if (n.includes('4G') || n.includes('4GB')) { vram = '4GB'; }
  
  // GDDR type
  if (n.includes('GDDR7')) mem = 'GDDR7';
  else if (n.includes('GDDR6X')) mem = 'GDDR6X';
  else if (n.includes('GDDR6')) mem = 'GDDR6';
  else if (n.includes('GDDR5')) mem = 'GDDR5';
  
  // PSU estimate
  if (n.includes('5090') || n.includes('4090')) psu = '1000W';
  else if (n.includes('5080') || n.includes('4080')) psu = '850W';
  else if (n.includes('5070') || n.includes('4070') || n.includes('7900')) psu = '750W';
  else if (n.includes('5060 TI') || n.includes('4060 TI') || n.includes('7800') || n.includes('7700')) psu = '650W';
  else if (n.includes('5060') || n.includes('4060') || n.includes('7600') || n.includes('B580')) psu = '550W';
  else if (n.includes('3060') || n.includes('6600')) psu = '550W';
  else if (n.includes('3050') || n.includes('6500') || n.includes('1650') || n.includes('5050')) psu = '450W';

  return { gpu, vram, mem, psu };
}

function getPrice(name) {
  const n = name.toUpperCase();
  if (n.includes('5090')) return 85000000;
  if (n.includes('5080')) return 55000000;
  if (n.includes('4090')) return 55000000;
  if (n.includes('5070 TI') || n.includes('5070TI')) return 35000000;
  if (n.includes('5070')) return 28000000;
  if (n.includes('4080 SUPER') || n.includes('4080SUPER')) return 31000000;
  if (n.includes('4080')) return 28000000;
  if (n.includes('5060 TI') || n.includes('5060TI')) return 19000000;
  if (n.includes('4070 TI SUPER') || n.includes('4070TISUPER')) return 24000000;
  if (n.includes('4070 SUPER') || n.includes('4070SUPER')) return 19000000;
  if (n.includes('4070 TI') || n.includes('4070TI')) return 21000000;
  if (n.includes('4070')) return 16000000;
  if (n.includes('5060')) return 14000000;
  if (n.includes('4060 TI') || n.includes('4060TI')) { if (n.includes('16G') || n.includes('16GB')) return 12500000; return 11000000; }
  if (n.includes('4060')) return 9000000;
  if (n.includes('7900 XTX') || n.includes('7900XTX')) return 28000000;
  if (n.includes('7900 XT') || n.includes('7900XT')) return 22000000;
  if (n.includes('7900')) return 20000000;
  if (n.includes('7800')) return 15000000;
  if (n.includes('7700')) return 10000000;
  if (n.includes('7600')) return 7500000;
  if (n.includes('6700')) return 8000000;
  if (n.includes('6600')) return 5500000;
  if (n.includes('6500')) return 3200000;
  if (n.includes('5050') || n.includes('3060')) return 7500000;
  if (n.includes('3050')) return 5500000;
  if (n.includes('1650 SUPER') || n.includes('1650S')) return 3800000;
  if (n.includes('1650')) return 3200000;
  if (n.includes('B580')) return 9800000;
  if (n.includes('B570')) return 7800000;
  return 8000000;
}

const esc = s => s.replace(/'/g, "''");

(async () => {
  console.log('🌐 Đang fetch GearVN bằng HTTP trực tiếp...\n');
  
  const allProducts = new Map(); // name -> img
  
  // Fetch nhiều trang + filter bằng brand
  const urls = [
    'https://gearvn.com/collections/vga-card-man-hinh',
    'https://gearvn.com/collections/vga-card-man-hinh?page=2',
    'https://gearvn.com/collections/vga-card-man-hinh?page=3',
    'https://gearvn.com/collections/vga-card-man-hinh?page=4',
    'https://gearvn.com/collections/vga-card-man-hinh?page=5',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=asus',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=msi',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=gigabyte',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=zotac',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=asus&page=2',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=msi&page=2',
    'https://gearvn.com/collections/vga-card-man-hinh?hang=gigabyte&page=2',
  ];
  
  for (const url of urls) {
    try {
      process.stdout.write(`Fetching: ${url.replace('https://gearvn.com','')} ... `);
      const html = await fetchHtml(url);
      const ps = parseProducts(html);
      let added = 0;
      ps.forEach(p => { if (!allProducts.has(p.name)) { allProducts.set(p.name, p.img); added++; } });
      console.log(`${ps.length} tìm thấy, +${added} mới (tổng: ${allProducts.size})`);
      await new Promise(r => setTimeout(r, 500)); // polite delay
    } catch(e) {
      console.log(`❌ lỗi: ${e.message}`);
    }
  }
  
  console.log(`\n📦 Tổng sản phẩm unique: ${allProducts.size}`);
  
  if (allProducts.size < 10) {
    console.log('❌ Không parse được HTML - GearVN có thể dùng JS rendering. Dùng tập dữ liệu backup...');
    process.exit(1);
  }
  
  // Lưu raw scrape để debug
  fs.writeFileSync('c:\\Users\\thanh\\vga-store\\scraped_products.json',
    JSON.stringify([...allProducts.entries()].map(([name,img])=>({name,img})), null, 2));
  console.log(`💾 Lưu scraped_products.json (${allProducts.size} sản phẩm)\n`);
  
  // ─── DOWNLOAD ẢNH ───
  console.log('⬇️  Bắt đầu tải ảnh...\n');
  const dbProducts = [];
  let dlOk = 0, dlFail = 0;
  
  for (const [name, imgUrl] of allProducts) {
    const brand = detectBrand(name);
    const filename = makeFilename(name, brand);
    const relPath = `${brand}/${filename}`;
    
    process.stdout.write(`  [${brand}] ${filename.substring(0,45).padEnd(45)} `);
    const ok = await downloadImg(imgUrl, relPath, 0);
    if (ok) {
      process.stdout.write('✅\n');
      const specs = detectSpecs(name);
      dbProducts.push({
        name, brand: brand.toUpperCase(), imgPath: `/images/products/${relPath}`,
        ...specs, price: getPrice(name), stock: Math.floor(Math.random()*20)+2
      });
      dlOk++;
    } else {
      process.stdout.write('❌ skip\n');
      dlFail++;
    }
  }
  
  console.log(`\n✅ Tải thành công: ${dlOk} | ❌ Thất bại: ${dlFail}`);
  
  if (dbProducts.length < 5) { console.log('Không đủ sản phẩm!'); process.exit(1); }
  
  // ─── GENERATE SQL ───
  const brandList = [...new Set(dbProducts.map(p => p.brand))].filter(Boolean);
  const brandsMap = Object.fromEntries(brandList.map((b,i) => [b, i+1]));
  const catIds = { 'NVIDIA':1, 'AMD':2, 'Intel':3 };
  
  function detectCat(name) {
    const n = name.toLowerCase();
    if (n.includes('radeon') || n.includes(' rx ') || n.includes('r7 ') || n.includes('r9 ')) return 'AMD';
    if (n.includes('arc') || n.includes('intel')) return 'Intel';
    return 'NVIDIA';
  }
  
  const coolMap = { asus:'Axial-tech Fan', msi:'TORX FAN 5.0', gigabyte:'WINDFORCE', zotac:'Twin Edge Fan', sparkle:'Titan Fan', palit:'Dual Fan', inno3d:'iChiLL Fan', powercolor:'Red Dragon Fan', sapphire:'Tri-X Fan', other:'Dual Fan' };
  
  let sql = '-- VGA STORE - DỮ LIỆU THẬT TỪ GEARVN - ẢNH RIÊNG TỪNG SẢN PHẨM\n';
  sql += 'TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, brands RESTART IDENTITY CASCADE;\n\n';
  sql += `INSERT INTO brands (id, name, slug, status, deleted, created_at) VALUES\n`;
  sql += brandList.map((b,i) => `(${i+1},'${b}','${b.toLowerCase()}',true,false,NOW())`).join(',\n') + ';\n\n';
  sql += `INSERT INTO categories (id, name, active, deleted, created_at) VALUES\n`;
  sql += `(1,'Card Đồ Họa NVIDIA',true,false,NOW()),(2,'Card Đồ Họa AMD',true,false,NOW()),(3,'Card Đồ Họa Intel Arc',true,false,NOW());\n\n`;
  
  const rows = dbProducts.map((p, i) => {
    const bId = brandsMap[p.brand] || 1;
    const cat = detectCat(p.name);
    const cId = catIds[cat] || 1;
    const cool = coolMap[p.brand.toLowerCase()] || 'Dual Fan';
    const sku = `${p.brand.substring(0,3)}-${p.gpu.replace(/\s+/g,'').substring(0,8)}-${String(i+1).padStart(3,'0')}`;
    const desc = `<p>${esc(p.name)}.</p><p>GPU: <b>${p.gpu}</b> | VRAM: <b>${p.vram} ${p.mem}</b> | PSU tối thiểu: <b>${p.psu}</b>.</p>`;
    const pwr = p.psu === '1000W' ? '1x 16-pin (12VHPWR)' : p.psu === '850W' ? '2x 8-pin' : '1x 8-pin';
    const dim = '280x120x45mm';
    return `(${bId},${cId},'${esc(p.name)}','${esc(sku)}',${p.price},${p.stock},'${esc(desc)}','${p.imgPath}','${p.imgPath}','${esc(p.gpu)}','${esc(p.vram)}','${esc(p.mem)}','${esc(cool)}','${esc(pwr)}','${esc(p.psu)}','${esc(dim)}',false,NOW())`;
  });
  
  sql += `INSERT INTO products (brand_id, category_id, name, sku, price, stock, description, img_url, images_json, gpu_model, vram, memory_type, cooling_type, power_connectors, recommended_psu, dimension, deleted, created_at) VALUES\n`;
  sql += rows.join(',\n') + ';\n\n';
  sql += `SELECT setval('products_id_seq',(SELECT MAX(id) FROM products));\nSELECT setval('brands_id_seq',(SELECT MAX(id) FROM brands));\nSELECT setval('categories_id_seq',3);\n`;
  
  fs.writeFileSync('c:\\Users\\thanh\\vga-store\\database\\seed_vga.sql', sql, 'utf8');
  console.log(`\n🎉 Xong! ${dbProducts.length} sản phẩm với ảnh riêng → seed_vga.sql`);
  console.log(`\n📁 Ảnh tổ chức theo brand:`);
  brandList.forEach(b => {
    const cnt = dbProducts.filter(p=>p.brand===b).length;
    console.log(`   /images/products/${b.toLowerCase()}/ ← ${cnt} sản phẩm`);
  });
  console.log(`\n⚠️  BƯỚC CUỐI: Mở PgAdmin → Query Tool → Paste seed_vga.sql → F5 Execute`);
})();
