/**
 * download_blog_images.js
 * Tải toàn bộ ảnh blog từ Unsplash về local /public/images/blog/
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=900&q=85', name: 'blog-rtx5090-leak.jpg' },
  { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&q=85', name: 'blog-asus-rog-rtx4090.jpg' },
  { url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=900&q=85', name: 'blog-undervolt-guide.jpg' },
  { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&q=85', name: 'blog-top5-budget.jpg' },
  { url: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=900&q=85', name: 'blog-amd-rx7900xtx.jpg' },
  { url: 'https://images.unsplash.com/photo-1593640408182-31c228edb04e?w=900&q=85', name: 'blog-intel-arc-b580.jpg' },
  { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=900&q=85', name: 'blog-dlss4-framegeneration.jpg' },
  { url: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=900&q=85', name: 'blog-build-gaming-pc.jpg' },
  // Service / About images
  { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59abe6?w=1200&q=85', name: 'service-tech-repair.jpg' },
  { url: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=1200&q=85', name: 'service-showroom.jpg' },
];

const BASE = path.join('c:/Users/thanh/vga-store/fontend/user/public/images/blog');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      process.stdout.write('⏭ ');
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); process.stdout.write('✅ '); resolve(); });
    }).on('error', (e) => {
      fs.existsSync(dest) && fs.unlinkSync(dest);
      process.stdout.write('❌ ');
      resolve(); // don't reject so others continue
    });
  });
}

(async () => {
  console.log(`Tải ${IMAGES.length} ảnh về ${BASE}\n`);
  for (const img of IMAGES) {
    process.stdout.write(`${img.name}: `);
    await download(img.url, path.join(BASE, img.name));
    console.log('');
  }
  console.log('\nHoàn thành!');
})();
