/**
 * Optimize certificate images in /assets/certificates/.
 *
 * The raw scans are 2–3 MB each which makes the Recognition page
 * slow to load. This script writes web-sized, compressed copies to
 * /assets/certificates/optimized/ so the originals stay intact as
 * archival record while the site serves the optimized versions.
 *
 * Strategy:
 *   - Resize so the longest side is at most MAX_DIM (keeps fine print legible
 *     while killing the bulk of the file weight).
 *   - Re-encode JPGs with mozjpeg quality 80, progressive.
 *   - Re-encode PNGs with compressionLevel 9 + adaptiveFiltering.
 *   - Always normalize rotation via EXIF.
 *
 * Usage: node scripts/optimize-certificates.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'assets', 'certificates');
const OUT = path.join(SRC, 'optimized');
const MAX_DIM = 1600;
const JPG_QUALITY = 80;

async function optimizeOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const inPath = path.join(SRC, file);
  const outPath = path.join(OUT, file);
  const srcSize = fs.statSync(inPath).size;

  let pipeline = sharp(inPath).rotate().resize({
    width: MAX_DIM,
    height: MAX_DIM,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true });
  }

  await pipeline.toFile(outPath);

  const outSize = fs.statSync(outPath).size;
  const saved = ((1 - outSize / srcSize) * 100).toFixed(1);
  const fmt = (n) => (n / 1024 < 1024 ? `${(n / 1024).toFixed(0)}K` : `${(n / 1024 / 1024).toFixed(2)}M`);
  console.log(`  ✓ ${file.padEnd(26)} ${fmt(srcSize).padStart(7)} → ${fmt(outSize).padStart(7)}  (-${saved}%)`);
  return { srcSize, outSize };
}

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`Source folder not found: ${SRC}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(SRC).filter((f) => {
    const p = path.join(SRC, f);
    return fs.statSync(p).isFile();
  });

  console.log(`Optimizing ${files.length} certificate(s) → assets/certificates/optimized/`);
  console.log(`  max dimension: ${MAX_DIM}px · jpg quality: ${JPG_QUALITY}`);
  console.log('');

  let totalIn = 0, totalOut = 0, done = 0, skipped = 0;
  for (const f of files) {
    const res = await optimizeOne(f);
    if (res) { totalIn += res.srcSize; totalOut += res.outSize; done++; }
    else skipped++;
  }

  const fmt = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
  console.log('');
  console.log(`  Processed: ${done}  ·  Skipped: ${skipped}`);
  console.log(`  Total: ${fmt(totalIn)} → ${fmt(totalOut)}  (saved ${fmt(totalIn - totalOut)})`);
})();
