// Camada de "tinta": o fundo é uma tela em branco; as cores aparecem conforme a pessoa interage.
export const PALETTE = ['#e23a55', '#f39a4a', '#b5cf3a', '#9cc9e6', '#ec6f9c', '#d4a94e', '#8fae4a', '#f6c445'];
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let cv, ctx, blobs = [], raf = 0, W = 0, H = 0, dpr = 1, lx = -999, ly = -999, last = 0;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function blob(x, y, r, color, life = 3.6, alpha = 0.16, grow = 1.6) {
  const pts = 10 + Math.floor(Math.random() * 6);
  const offs = Array.from({ length: pts }, () => 0.78 + Math.random() * 0.4);
  blobs.push({ x, y, r, color, life, age: 0, alpha, grow, offs, rot: Math.random() * 6.28, vx: (Math.random() - 0.5) * 6, vy: 8 + Math.random() * 16 });
  if (!raf) raf = requestAnimationFrame(tick);
}

function draw(b, k) {
  const e = b.age / b.life;
  const r = b.r * (1 + (b.grow - 1) * (1 - Math.pow(1 - Math.min(1, e * 2.2), 3)));
  const a = b.alpha * (e < 0.12 ? e / 0.12 : 1 - Math.pow((e - 0.12) / 0.88, 1.6));
  ctx.globalAlpha = Math.max(0, a);
  ctx.fillStyle = b.color;
  ctx.beginPath();
  const n = b.offs.length;
  for (let i = 0; i <= n + 1; i++) {
    const i0 = i % n, i1 = (i + 1) % n;
    const a0 = b.rot + (i0 / n) * Math.PI * 2, a1 = b.rot + (i1 / n) * Math.PI * 2;
    const x0 = b.x + Math.cos(a0) * r * b.offs[i0], y0 = b.y + Math.sin(a0) * r * b.offs[i0];
    const x1 = b.x + Math.cos(a1) * r * b.offs[i1], y1 = b.y + Math.sin(a1) * r * b.offs[i1];
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    if (i === 0) ctx.moveTo(mx, my); else ctx.quadraticCurveTo(x0, y0, mx, my);
  }
  ctx.fill();
}

function tick(t) {
  const dt = Math.min(0.05, (t - (last || t)) / 1000);
  last = t;
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply';
  blobs = blobs.filter((b) => (b.age += dt) < b.life);
  for (const b of blobs) { b.y += b.vy * dt * 0.3; b.x += b.vx * dt * 0.3; draw(b); }
  ctx.globalAlpha = 1;
  if (blobs.length) raf = requestAnimationFrame(tick);
  else { raf = 0; last = 0; }
}

export function splash(x, y, n = 9, colors = PALETTE, power = 1) {
  if (!ctx || reduce) return;
  const c = colors[Math.floor(Math.random() * colors.length)];
  blob(x, y, 26 * power, c, 3.4, 0.22, 2.2);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = (30 + Math.random() * 90) * power;
    blob(x + Math.cos(a) * d, y + Math.sin(a) * d, (3 + Math.random() * 9) * power, colors[Math.floor(Math.random() * colors.length)], 2.4 + Math.random() * 1.6, 0.26, 1.3);
  }
}

export function confetti() {
  if (!ctx) return;
  for (let i = 0; i < 7; i++) setTimeout(() => splash(W * (0.15 + Math.random() * 0.7), H * (0.2 + Math.random() * 0.5), 12, PALETTE, 1.3), i * 140);
}

export function initPaint() {
  cv = document.getElementById('paint');
  if (!cv || reduce) return;
  ctx = cv.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  let ci = 0;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const d = Math.hypot(e.clientX - lx, e.clientY - ly);
    if (d < 70) return;
    lx = e.clientX; ly = e.clientY;
    ci = (ci + 1) % PALETTE.length;
    blob(e.clientX, e.clientY, 18 + Math.random() * 22, PALETTE[ci], 3.2, 0.1, 2.4);
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, select, textarea, canvas.stage')) return;
    splash(e.clientX, e.clientY, 7, PALETTE, 0.8);
  }, { passive: true });
}
