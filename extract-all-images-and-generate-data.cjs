const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const csvPath = path.join(__dirname, 'supabase_download.csv');
const outDir = path.join(__dirname, 'public', 'images', 'projects');
const dataOutPath = path.join(__dirname, 'src', 'data', 'projects.ts');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const projects = [];
const parser = fs.createReadStream(csvPath).pipe(parse({ columns: true, relax_quotes: true, max_record_size: 100 * 1024 * 1024 }));

function sanitizeFilename(str) {
  return String(str).replace(/[^a-zA-Z0-9_-]/g, '');
}

parser.on('readable', () => {
  let record;
  while ((record = parser.read())) {
    const id = record.id;
    const safeId = sanitizeFilename(id);
    // --- Main image ---
    let mainImagePath = '';
    if (record.imageUrl && record.imageUrl.startsWith('data:image/')) {
      const m = record.imageUrl.match(/^data:(image\/(\w+));base64,(.+)$/);
      if (m) {
        const ext = m[2];
        const b64 = m[3];
        mainImagePath = `/images/projects/project-${safeId}-main.${ext}`;
        fs.writeFileSync(path.join(outDir, `project-${safeId}-main.${ext}`), Buffer.from(b64, 'base64'));
      }
    }
    // --- Gallery images ---
    let galleryImages = [];
    if (record.galleryImages && record.galleryImages.startsWith('[')) {
      try {
        const arr = JSON.parse(record.galleryImages);
        if (Array.isArray(arr)) {
          arr.forEach((img, idx) => {
            if (typeof img === 'string' && img.startsWith('data:image/')) {
              const m = img.match(/^data:(image\/(\w+));base64,(.+)$/);
              if (m) {
                const ext = m[2];
                const b64 = m[3];
                const relPath = `/images/projects/project-${safeId}-gallery-${idx}.${ext}`;
                fs.writeFileSync(path.join(outDir, `project-${safeId}-gallery-${idx}.${ext}`), Buffer.from(b64, 'base64'));
                galleryImages.push(relPath);
              }
            }
          });
        }
      } catch (e) {
        galleryImages = [];
      }
    }
    // --- Add project ---
    projects.push({
      ...record,
      imageUrl: mainImagePath,
      galleryImages,
    });
  }
});

parser.on('end', () => {
  // Output as TypeScript file
  const fileHeader = `// AUTO-GENERATED FILE. DO NOT EDIT\nimport { Project } from '../lib/projectsSupabase';\n\nexport const projects: Project[] = `;
  const fileBody = JSON.stringify(projects, null, 2);
  const fileFooter = ` as Project[];\n`;
  fs.writeFileSync(dataOutPath, fileHeader + fileBody + fileFooter);
  console.log('All images extracted and data written to:', dataOutPath);
});

parser.on('error', err => {
  console.error('CSV parse error:', err);
  process.exit(1);
});
