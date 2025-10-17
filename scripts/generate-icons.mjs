import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgBuffer = readFileSync(join(__dirname, '../public/icon.svg'));
const svgMaskableBuffer = readFileSync(join(__dirname, '../public/icon-maskable.svg'));

const sizes = [48, 72, 96, 144, 192, 384, 512];
const maskableSizes = [192, 512];

console.log('🎨 Generating PWA icons...\n');

// Generate regular icons
for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icon-${size}.png`));
  console.log(`✓ Generated icon-${size}.png`);
}

// Generate maskable icons
for (const size of maskableSizes) {
  await sharp(svgMaskableBuffer)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icon-${size}-maskable.png`));
  console.log(`✓ Generated icon-${size}-maskable.png (maskable)`);
}

// Generate favicon.ico (using 32x32)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, '../public/favicon-32.png'));

// Note: Converting to .ico requires additional library
// For now, we'll use the PNG as favicon
console.log('✓ Generated favicon-32.png');

console.log('\n🎉 All icons generated successfully!');
console.log(`📊 Total: ${sizes.length} regular + ${maskableSizes.length} maskable + 1 favicon`);
