/**
 * STRONG BUILT · ADMIN AUTH WORKER
 * ─────────────────────────────────────────────────────────────
 * A tiny Cloudflare Worker that gates access to /admin.html behind
 * a real password (stored as a bcrypt-equivalent hash in env vars,
 * not in the public source). Issues a signed session cookie on
 * successful login. Free tier: 100,000 requests/day.
 *
 * DEPLOYMENT (5 minutes, all in the Cloudflare dashboard):
 * ─────────────────────────────────────────────────────────────
 * 1. Cloudflare dashboard → Workers & Pages → Create → Hello World
 * 2. Replace the default Worker code with the contents of THIS file
 * 3. Click "Save and deploy"
 * 4. In the Worker's Settings → Variables → Add:
 *      ADMIN_PASSWORD_HASH = (SHA-256 hash of your password — see below)
 *      SESSION_SECRET      = (any random 32+ char string)
 * 5. In the Worker's Triggers → Custom Domains → Add:
 *      strongbuilt.in/admin*   (or whatever your live domain becomes)
 *      strongbuilt.in/api/auth*
 *    The Worker will intercept /admin.html requests and require login.
 *    All other paths fall through to Cloudflare Pages normally.
 *
 * GENERATE THE HASH (locally, one-time):
 * ─────────────────────────────────────────────────────────────
 *   echo -n "YourPassword123" | sha256sum
 *   → paste the hex string into ADMIN_PASSWORD_HASH
 *
 * GENERATE THE SECRET:
 * ─────────────────────────────────────────────────────────────
 *   openssl rand -hex 32
 *   → paste into SESSION_SECRET
 *
 * The session cookie expires after 7 days. The user is redirected to
 * /admin/login.html (a tiny login form, included below) when the
 * cookie is missing/expired.
 * ─────────────────────────────────────────────────────────────
 */

const SESSION_COOKIE = 'sb_admin_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const PROTECTED_PREFIX = '/admin';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── Login form (POSTed credentials) ──
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      return handleLogin(request, env);
    }

    // ── Logout ──
    if (url.pathname === '/api/auth/logout') {
      return new Response('Logged out', {
        status: 200,
        headers: {
          'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
          'Content-Type': 'text/plain',
        },
      });
    }

    // ── Login page (HTML) ──
    if (url.pathname === '/admin/login') {
      return new Response(LOGIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ── Protect /admin/* and /admin.html ──
    const isProtected =
      url.pathname.startsWith(PROTECTED_PREFIX) &&
      url.pathname !== '/admin/login';

    if (isProtected) {
      const session = getSessionCookie(request);
      const valid = session && await verifySession(session, env);
      if (!valid) {
        return Response.redirect(`${url.origin}/admin/login`, 302);
      }
    }

    // Pass through all other requests to Cloudflare Pages
    return fetch(request);
  },
};

// ──────────────────────────────────────────────────────────────
// LOGIN HANDLER
// ──────────────────────────────────────────────────────────────
async function handleLogin(request, env) {
  const formData = await request.formData();
  const password = formData.get('password') || '';
  const submitted = await sha256(password);

  if (submitted !== env.ADMIN_PASSWORD_HASH) {
    return new Response(
      LOGIN_HTML.replace('<!--ERROR-->', '<p class="err">Incorrect password.</p>'),
      { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Build signed session token: "expiry.signature"
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const sig = await hmacSign(`${expiry}`, env.SESSION_SECRET);
  const token = `${expiry}.${sig}`;

  return new Response('OK', {
    status: 302,
    headers: {
      'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`,
      'Location': '/admin.html',
    },
  });
}

// ──────────────────────────────────────────────────────────────
// SESSION VERIFICATION
// ──────────────────────────────────────────────────────────────
function getSessionCookie(request) {
  const header = request.headers.get('Cookie') || '';
  const m = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

async function verifySession(token, env) {
  const [expiryStr, sig] = token.split('.');
  if (!expiryStr || !sig) return false;
  const expiry = parseInt(expiryStr, 10);
  if (!isFinite(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmacSign(expiryStr, env.SESSION_SECRET);
  return constantTimeEqual(sig, expected);
}

// ──────────────────────────────────────────────────────────────
// CRYPTO HELPERS (Web Crypto, available in Workers runtime)
// ──────────────────────────────────────────────────────────────
async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSign(str, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(str));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

// ──────────────────────────────────────────────────────────────
// LOGIN PAGE HTML (inlined so no extra fetch needed)
// ──────────────────────────────────────────────────────────────
const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Login · Strong Built</title>
<style>
  body{margin:0;background:#000;color:#FAFAFA;font-family:Inter,system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem;}
  .card{width:min(380px,100%);padding:2rem;background:#000;border:1px solid rgba(255,255,255,0.18);border-radius:6px;box-shadow:0 16px 48px rgba(0,0,0,0.7),0 0 0 1px rgba(245,158,11,0.18);text-align:center;}
  h1{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#F59E0B;margin:0 0 0.4rem;}
  p.desc{color:rgba(180,180,190,0.7);font-size:0.78rem;margin:0 0 1.5rem;}
  input{width:100%;padding:0.85rem 1rem;background:#000;border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:6px;font-size:0.9rem;margin-bottom:0.8rem;font-family:inherit;}
  input:focus{outline:none;border-color:#F59E0B;box-shadow:0 0 0 3px rgba(245,158,11,0.15);}
  button{width:100%;padding:0.85rem 1rem;background:#F59E0B;color:#000;border:none;border-radius:6px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;}
  button:hover{background:#FFB526;}
  p.err{color:#f87171;font-size:0.78rem;margin:0 0 0.8rem;font-weight:600;}
</style>
</head>
<body>
  <form class="card" method="POST" action="/api/auth/login">
    <h1>Admin Access</h1>
    <p class="desc">Enter passcode to continue.</p>
    <!--ERROR-->
    <input type="password" name="password" placeholder="Passcode" autofocus required>
    <button type="submit">Unlock →</button>
  </form>
</body>
</html>`;
