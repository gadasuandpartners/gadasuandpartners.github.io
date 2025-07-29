const fs = require('fs');
const path = require('path');
const readline = require('readline');

const csvPath = path.join(__dirname, 'supabase_download.csv');
const outDir = path.join(__dirname, 'public', 'images', 'projects');
const outFile = path.join(outDir, 'villa-neon-et-cuivre.png');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const rl = readline.createInterface({
  input: fs.createReadStream(csvPath),
  crlfDelay: Infinity,
});

let headers;
rl.on('line', (line) => {
  if (!headers) {
    headers = line.split(',');
  } else {
    // Split CSV fields, handling quoted commas
    const fields = line.match(/\s*("(?:[^"]|"")*"|[^,]*)/g).map(f => f.replace(/^\s*"|"\s*$/g, ''));
    const idx = headers.indexOf('imageUrl');
    let img = fields[idx];
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
    rl.close();
  }
});
rl.on('close', () => process.exit(0));
