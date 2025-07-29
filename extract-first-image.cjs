const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const csvPath = path.join(__dirname, 'supabase_download.csv');
const outDir = path.join(__dirname, 'public', 'images', 'projects');
const outFile = path.join(outDir, 'villa-neon-et-cuivre.png');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const parser = fs.createReadStream(csvPath).pipe(parse({ columns: true, relax_quotes: true, max_record_size: 100 * 1024 * 1024 }));

parser.on('readable', () => {
  const record = parser.read();
  if (record) {
    let img = record.imageUrl;
    if (!img) {
      console.error('No imageUrl found in first data row.');
      process.exit(1);
    }
    const m = img.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!m) {
      console.error('Invalid base64 imageUrl format.');
      process.exit(1);
    }
    const ext = m[1].split('/')[1];
    const b64 = m[2];
    fs.writeFileSync(outFile, Buffer.from(b64, 'base64'));
    console.log('Image saved to:', outFile);
    parser.destroy();
  }
});
parser.on('error', err => {
  console.error('CSV parse error:', err);
  process.exit(1);
});
