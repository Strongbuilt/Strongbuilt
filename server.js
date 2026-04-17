/**
 * Strong Built — On-Premise Server
 * Serves the static site + exposes a simple API so admin.html
 * can read/write data files on disk in real time.
 *
 * Usage:  npm start        (production)
 *         npm run dev      (auto-restart on file changes)
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname; // serve files from project root

// ── Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.static(ROOT, { extensions: ['html'] }));

// ── Data-file registry ───────────────────────────────────────
// Maps each admin "type" to its JS file + variable name.
const DATA_FILES = {
  projects:       { file: 'projects-data.js',        constName: 'PROJECT_DATA' },
  testimonials:   { file: 'testimonials-data.js',    constName: 'TESTIMONIALS_DATA' },
  timeline:       { file: 'timeline-data.js',        constName: 'TIMELINE_DATA' },
  awards:         { file: 'awards-data.js',          constName: 'AWARDS_DATA' },
  activeProjects: { file: 'active-projects-data.js', constName: 'ACTIVE_PROJECTS_DATA' },
  leadership:     { file: 'leadership-data.js',       constName: 'LEADERSHIP_DATA' },
  siteInfo:       { file: 'site-info.js',            constName: 'SITE_INFO' },
};

// ── Helpers ──────────────────────────────────────────────────
function dataFilePath(type) {
  const entry = DATA_FILES[type];
  if (!entry) return null;
  return path.join(ROOT, entry.file);
}

function readDataFile(type) {
  const filePath = dataFilePath(type);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw   = fs.readFileSync(filePath, 'utf-8');
  const entry = DATA_FILES[type];

  // Strategy: execute the JS file in a sandboxed scope and extract the variable.
  // This handles unquoted keys, trailing commas, helper functions — any valid JS.
  try {
    const sandbox = {};
    const wrapped = raw + `\n;__result__ = typeof ${entry.constName} !== 'undefined' ? ${entry.constName} : undefined;`;
    const fn = new Function(wrapped + '\nreturn __result__;');
    const result = fn();
    if (result !== undefined) return JSON.parse(JSON.stringify(result)); // deep clone
  } catch (e) {
    console.warn(`[readDataFile] JS eval fallback failed for ${type}:`, e.message);
  }

  // Regex fallback for simpler files
  const regex = new RegExp(
    `\\bconst\\s+${entry.constName}\\s*=\\s*([\\s\\S]*?);\\s*(?:if\\s*\\(|function\\s|//|$)`
  );
  const match = raw.match(regex);
  if (!match) return null;

  let jsonStr = match[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

  try {
    return JSON.parse(jsonStr);
  } catch {
    jsonStr = jsonStr
      .replace(/([{,]\s*)([a-zA-Z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/'/g, '"');
    return JSON.parse(jsonStr);
  }
}

function writeDataFile(type, data) {
  const filePath = dataFilePath(type);
  if (!filePath) return false;

  const entry = DATA_FILES[type];
  const timestamp = new Date().toISOString();
  const json = JSON.stringify(data, null, 2);

  const content = [
    `/**`,
    ` * ${type.charAt(0).toUpperCase() + type.slice(1)} Data — saved by Admin Studio on ${timestamp}`,
    ` */`,
    `const ${entry.constName} = ${json};`,
    `if (typeof window !== 'undefined') window.${entry.constName} = ${entry.constName};`,
    ``
  ].join('\n');

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// ── API Routes ───────────────────────────────────────────────

// GET /api/data/:type  — read a data file
app.get('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (!DATA_FILES[type]) {
    return res.status(404).json({ error: `Unknown data type: ${type}` });
  }
  try {
    const data = readDataFile(type);
    if (data === null) {
      return res.status(404).json({ error: `Data file not found for: ${type}` });
    }
    res.json({ ok: true, type, data });
  } catch (err) {
    console.error(`[API] Error reading ${type}:`, err.message);
    res.status(500).json({ error: 'Failed to read data file', detail: err.message });
  }
});

// POST /api/upload/:folder  — upload an image file
app.post('/api/upload/:folder', (req, res) => {
  const { folder } = req.params;
  const ALLOWED_FOLDERS = ['Projects', 'Leaders'];
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return res.status(400).json({ error: `Upload folder must be one of: ${ALLOWED_FOLDERS.join(', ')}` });
  }

  // Read raw body as binary
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const filename = (req.headers['x-filename'] || 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const destDir = path.join(ROOT, 'assets', folder);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const destPath = path.join(destDir, filename);
    fs.writeFileSync(destPath, buffer);
    const relativePath = `assets/${folder}/${filename}`;
    console.log(`[API] Uploaded ${relativePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    res.json({ ok: true, path: relativePath });
  });
  req.on('error', err => {
    console.error('[API] Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  });
});

// PUT /api/data/:type  — write a data file (publish)
app.put('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (!DATA_FILES[type]) {
    return res.status(404).json({ error: `Unknown data type: ${type}` });
  }
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).json({ error: 'Missing "data" in request body' });
  }
  try {
    writeDataFile(type, data);
    console.log(`[API] Published ${type} (${DATA_FILES[type].file})`);
    res.json({ ok: true, type, message: `${type} published successfully` });
  } catch (err) {
    console.error(`[API] Error writing ${type}:`, err.message);
    res.status(500).json({ error: 'Failed to write data file', detail: err.message });
  }
});

// GET /api/data  — list all data types + their current item counts
app.get('/api/data', (_req, res) => {
  const summary = {};
  for (const [type, entry] of Object.entries(DATA_FILES)) {
    try {
      const data = readDataFile(type);
      let count = '—';
      if (Array.isArray(data)) count = data.length;
      else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // keyed (awards) or single object (siteInfo)
        const vals = Object.values(data);
        if (vals.every(Array.isArray)) count = vals.reduce((n, a) => n + a.length, 0);
        else count = 1;
      }
      summary[type] = { file: entry.file, count };
    } catch {
      summary[type] = { file: entry.file, count: 'error' };
    }
  }
  res.json({ ok: true, types: summary });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │  Strong Built — On-Premise Server       │
  │                                         │
  │  Site:   http://localhost:${PORT}          │
  │  Admin:  http://localhost:${PORT}/admin    │
  │  API:    http://localhost:${PORT}/api/data │
  └─────────────────────────────────────────┘
  `);
});
