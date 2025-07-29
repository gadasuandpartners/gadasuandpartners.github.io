const fs = require('fs');
const path = require('path');

const images = [
  { src: 'azure_mosque.png', dest: 'project-azure-mosque-main.png' },
  { src: 'copper_tower.png', dest: 'project-copper-tower-main.png' },
  { src: 'harmony_heights.png', dest: 'project-harmony-heights-main.png' },
];

const targetDir = path.join(__dirname, 'public', 'images', 'projects');

for (const img of images) {
  const srcPath = path.join(__dirname, img.src);
  const destPath = path.join(targetDir, img.dest);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`Moved ${img.src} → ${destPath}`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
}
