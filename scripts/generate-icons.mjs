import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../public/icons');

const sizes = [
  { name: 'icon-512x512.png', size: 512, radius: 96 },
  { name: 'icon-192x192.png', size: 192, radius: 36 },
  { name: 'apple-touch-icon.png', size: 180, radius: 36 },
  { name: 'favicon-32x32.png', size: 32, radius: 6 },
  { name: 'favicon-16x16.png', size: 16, radius: 3 },
];

function createSvg(size, radius) {
  const fontSize = Math.round(size * 0.39);
  const textY = Math.round(size * 0.6);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#10B981"/>
  <text x="${size/2}" y="${textY}" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle" fill="white">MM</text>
</svg>`);
}

async function generateIcons() {
  await mkdir(iconsDir, { recursive: true });

  for (const { name, size, radius } of sizes) {
    const svg = createSvg(size, radius);
    const outputPath = join(iconsDir, name);

    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${name}`);
  }

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
