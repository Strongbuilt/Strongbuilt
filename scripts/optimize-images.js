#!/usr/bin/env node
/**
 * Strong Built — image optimisation pipeline
 * ──────────────────────────────────────────
 * Resizes every JPG/PNG under assets/Projects and assets/images to
 * three widths (480, 960, 1600) in three formats (jpg, webp, avif).
 * Outputs land in sibling `opt/` folders so originals stay untouched.
 *
 * Prereq:   npm install --save-dev sharp
 * Run:      node scripts/optimize-images.js
 *
 * The site's <picture> tags already reference the output paths
 * (e.g. assets/Projects/opt/monticello-960.webp). Until you run this
 * script, browsers gracefully fall back to the original JPG via the
 * <img> tag inside each <picture>.
 */

const fs = require('fs');
const path = require('path');

let sharp;
try { sharp = require('sharp'); }
catch (e) {
  console.error('\n[x] sharp is not installed. Run:\n    npm install --save-dev sharp\n');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const INPUT_DIRS = [
  path.join(ROOT, 'assets', 'Projects'),
  path.join(ROOT, 'assets', 'images'),
];
const WIDTHS = [480, 960, 1600];
const EXTS_IN = new Set(['.jpg', '.jpeg', '.png']);

// Skip files already in an opt/ directory or matching our output pattern
const isSource = (filePath) => {
  const rel = path.relative(ROOT, filePath);
  if (rel.includes(`${path.sep}opt${path.sep}`)) return false;
  const name = path.basename(filePath, path.extname(filePath));
  if (/-\d{3,4}$/.test(name)) return false;   // e.g. foo-960
  return EXTS_IN.has(path.extname(filePath).toLowerCase());
};

async function processFile(srcPath) {
  const dir = path.dirname(srcPath);
  const outDir = path.join(dir, 'opt');
  fs.mkdirSync(outDir, { recursive: true });

  const name = path.basename(srcPath, path.extname(srcPath));
  const meta = await sharp(srcPath).metadata();
  const sourceWidth = meta.width || WIDTHS[WIDTHS.length - 1];

  const sizes = WIDTHS.filter(w => w <= sourceWidth);
  if (sizes.length === 0) sizes.push(sourceWidth);   // tiny source: keep native

  for (const w of sizes) {
    const base = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
    const jobs = [
      base.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toFile(path.join(outDir, `${name}-${w}.jpg`)),
      base.clone().webp({ quality: 80 })
          .toFile(path.join(outDir, `${name}-${w}.webp`)),
      base.clone().avif({ quality: 55 })
          .toFile(path.join(outDir, `${name}-${w}.avif`)),
    ];
    await Promise.all(jobs);
  }
  console.log(`  ✓ ${path.relative(ROOT, srcPath)}  →  ${sizes.length} × 3 variants`);
}

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'opt') continue;
      yield* walk(full);
    } else if (entry.isFile() && isSource(full)) {
      yield full;
    }
  }
}

(async () => {
  console.log('\nStrong Built — image optimiser\n──────────────────────────────');
  const tStart = Date.now();
  let count = 0;
  for (const dir of INPUT_DIRS) {
    console.log(`\n· Scanning ${path.relative(ROOT, dir)}/`);
    for (const file of walk(dir)) {
      try { await processFile(file); count++; }
      catch (e) { console.error(`  ✗ ${file}: ${e.message}`); }
    }
  }
  const seconds = ((Date.now() - tStart) / 1000).toFixed(1);
  console.log(`\nDone. Processed ${count} source image(s) in ${seconds}s.\n`);
})();
