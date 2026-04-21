/**
 * Convert all JPG logos in /assets/Clients/ and /assets/partners/ to PNG
 * with white backgrounds keyed out via luminance-as-alpha.
 *
 * Usage: node scripts/convert-logos-to-png.js
 *
 * Approach (luminance keying, much better than binary threshold):
 *   1. Read each JPG as raw RGB pixels via sharp.
 *   2. For every pixel, compute alpha = 255 - min(R,G,B). This means:
 *        - pure white (255,255,255) → alpha 0 (fully transparent)
 *        - pure black (0,0,0)       → alpha 255 (fully opaque)
 *        - anti-aliased grays       → proportional alpha (smooth edges)
 *   3. Force RGB to black (the PNG becomes a silhouette mask).
 *      CSS can then tint it any color via filter.
 *   4. Write out the matching .png file alongside the original .jpg.
 *
 * Result: clean dark-silhouette PNGs with proper anti-aliased edges.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const FOLDERS = [
  path.join(__dirname, '..', 'assets', 'Clients'),
  path.join(__dirname, '..', 'assets', 'partners'),
];

// Small epsilon — treat pixels with alpha below this as fully transparent
// to eliminate low-opacity "haze" on white backgrounds.
const ALPHA_EPSILON = 12;

async function convertOne(jpgPath) {
  const pngPath = jpgPath.replace(/\.jpe?g$/i, '.png');
  const rel = path.relative(path.join(__dirname, '..'), jpgPath).replace(/\\/g, '/');

  try {
    const { data, info } = await sharp(jpgPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    if (channels !== 4) {
      throw new Error(`Expected 4 channels, got ${channels}`);
    }

    // Luminance-as-alpha:
    //   alpha = 255 - min(R,G,B)
    //   RGB   = black (silhouette mask)
    // Using min() instead of average handles colored logos on white bg:
    // a red logo (255, 0, 0) → min=0 → alpha=255 (fully opaque) ✓
    let opaquePixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lightness = Math.min(r, g, b);
      let alpha = 255 - lightness;
      if (alpha < ALPHA_EPSILON) alpha = 0;
      data[i]     = 0;      // R
      data[i + 1] = 0;      // G
      data[i + 2] = 0;      // B
      data[i + 3] = alpha;  // A
      if (alpha > 128) opaquePixels++;
    }

    await sharp(data, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(pngPath);

    const total = width * height;
    const pct = ((opaquePixels / total) * 100).toFixed(1);
    console.log(`  ✓ ${rel} → ${path.basename(pngPath)}  (${width}×${height}, ${pct}% logo ink)`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${rel}  ${err.message}`);
    return false;
  }
}

async function convertFolder(folder) {
  const name = path.basename(folder);
  if (!fs.existsSync(folder)) {
    console.log(`\n[${name}] folder not found, skipping.`);
    return;
  }
  const files = fs.readdirSync(folder)
    .filter(f => /\.jpe?g$/i.test(f) && !f.startsWith('.'))
    .map(f => path.join(folder, f));

  console.log(`\n[${name}]  ${files.length} JPG(s) to convert`);
  let ok = 0, fail = 0;
  for (const file of files) {
    const success = await convertOne(file);
    success ? ok++ : fail++;
  }
  console.log(`[${name}]  done — ${ok} converted, ${fail} failed`);
}

(async () => {
  console.log('Converting JPG logos → silhouette PNG (luminance-as-alpha)');
  console.log(`Alpha epsilon: ${ALPHA_EPSILON} (pixels with alpha below this become fully transparent)`);

  for (const folder of FOLDERS) {
    await convertFolder(folder);
  }
  console.log('\nAll done. Display in CSS with: filter: invert(1); (or none to render as dark silhouette)');
})();
