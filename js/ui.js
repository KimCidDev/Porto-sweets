// Componentes de interface compartilhados
import { t, L, money } from './i18n.js';
import { fudgeById, crustById, boxById } from './data.js';
import { thumbnail, webglAvailable } from './three/brigadeiro.js';

export const GL = webglAvailable();
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ICON = {
  dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" fill="var(--heart-fill, none)" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.8" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h11v9H3zM14 9.5h4l3 3.2v2.8h-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.8"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8l-5.4 2.9 1.2-5.9L3.4 9.7l6-.7z" fill="currentColor"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9.5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3.5c.4 2.6 2 4.2 4.5 4.4v3.2a7.7 7.7 0 0 1-4.4-1.4v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.5 2.2V3.5z" fill="currentColor"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8.4 19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.5c0 3.2 2.8 6.5 6.3 6.5l1-1.4-1.9-.9-.8.8c-1.2-.4-2.3-1.5-2.7-2.7l.8-.8-.9-1.9z" fill="currentColor"/></svg>',
};

export const fudgeName = (id) => L(fudgeById(id).name);
export const crustName = (id) => L(crustById(id).name);
const noCrust = (c) => crustById(c).kind === 'none';
export const comboName = (f, c) => (noCrust(c) ? `${fudgeName(f)}<span class="amp">,</span> ${crustName(c).toLowerCase()}` : `${fudgeName(f)} <span class="amp">&amp;</span> ${crustName(c)}`);
export const comboText = (f, c) => (noCrust(c) ? `${fudgeName(f)}, ${crustName(c).toLowerCase()}` : `${fudgeName(f)} & ${crustName(c)}`);

export function ballVars(f, c) {
  const fu = fudgeById(f), cr = crustById(c);
  if (cr.kind === 'none') return `--fc:${fu.color};--c1:${fu.color};--c2:${fu.color};--c3:${fu.color}`;
  return `--fc:${fu.color};--c1:${cr.swatch[0]};--c2:${cr.swatch[1]};--c3:${cr.swatch[2] || cr.swatch[0]}`;
}
export function crustSwatch(c) {
  const cr = crustById(c);
  if (cr.kind === 'none') return 'background:linear-gradient(135deg,transparent 44%,#e23a55 44% 56%,transparent 56%),#fffdf9;box-shadow:inset 0 0 0 1.6px #e4d9cc';
  return `--c1:${cr.swatch[0]};--c2:${cr.swatch[1]};--c3:${cr.swatch[2] || cr.swatch[0]};--c4:${cr.swatch[3] || cr.swatch[1]}`;
}

// miniatura renderizada pelo mesmo motor 3D; enquanto carrega, mostra uma bolinha em CSS
export function thumbHTML(f, c, cls = '', cup = 'framboesa') {
  return `<span class="thumb ${cls}" style="${ballVars(f, c)}"><span class="ball"></span><img alt="${esc(comboText(f, c))}" data-f="${f}" data-c="${c}" data-cup="${cup}"></span>`;
}
export function hydrate(root) {
  if (!GL || !root) return;
  root.querySelectorAll('img[data-f]:not([src])').forEach((img) => {
    img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    thumbnail(fudgeById(img.dataset.f), crustById(img.dataset.c), img.dataset.cup || 'framboesa').then((u) => {
      if (!u) return;
      img.onload = () => img.parentElement && img.parentElement.classList.add('ready');
      img.src = u;
    });
  });
}

// forma orgânica (gota / mancha de tinta) — path SVG suave e fechado
export function blobPath(seed = 1, pts = 7, wobble = 0.22) {
  let s = seed * 9301 + 49297;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const P = [];
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const rad = 80 * (1 - wobble + r() * wobble * 2);
    P.push([100 + Math.cos(a) * rad, 100 + Math.sin(a) * rad]);
  }
  let d = '';
  for (let i = 0; i < pts; i++) {
    const p0 = P[(i - 1 + pts) % pts], p1 = P[i], p2 = P[(i + 1) % pts], p3 = P[(i + 2) % pts];
    if (i === 0) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
export const blobSVG = (color, seed, cls = '') => `<svg class="blob ${cls}" viewBox="0 0 200 200" aria-hidden="true"><path d="${blobPath(seed)}" fill="${color}"/></svg>`;

export function badgeHTML(b) { return b ? `<span class="badge badge-${b}">${t('badge.' + b)}</span>` : ''; }

export function productCard(p) {
  const box = boxById(p.box);
  const [a, b, c] = p.mix;
  return `<a class="pcard" href="#/produto/${p.id}" data-reveal>
    <div class="pcard-media">
      ${blobSVG(['#fde3e8', '#e9f2d2', '#fdebd7', '#e3eef8'][p.id.length % 4], p.id.length * 7)}
      <div class="pcard-trio">${thumbHTML(a[0], a[1], 't1')}${b ? thumbHTML(b[0], b[1], 't2') : ''}${c ? thumbHTML(c[0], c[1], 't3') : ''}</div>
      ${badgeHTML(p.badge)}
    </div>
    <div class="pcard-body">
      <h3>${esc(L(p.name))}</h3>
      <p>${esc(L(p.tagline))}</p>
      <div class="pcard-foot"><span class="price">${money(box.price)} <small>· ${t('cart.boxOf', { n: box.size })}</small></span><span class="go">${ICON.arrow}</span></div>
    </div>
  </a>`;
}

// Caixa de presente no estilo das caixas de teste (azul-marinho + divisórias coloridas)
const DIVIDERS = ['#9cc9e6', '#b5cf3a', '#f39a4a', '#ec6f9c'];
export function expandContents(contents) {
  const slots = [];
  contents.forEach((c) => { for (let i = 0; i < c.qty; i++) slots.push(c); });
  return slots;
}
export function giftbox(boxId, contents, { thumbs = true, lid = 'marinho' } = {}) {
  const box = boxById(boxId);
  const slots = expandContents(contents);
  const useThumbs = thumbs && box.size <= 24;
  let cells = '';
  for (let i = 0; i < box.size; i++) {
    const s = slots[i];
    const col = i % box.cols;
    const div = DIVIDERS[col % DIVIDERS.length];
    const inner = s ? (useThumbs ? thumbHTML(s.fudge, s.crust, 'mini') : `<span class="dot" style="${ballVars(s.fudge, s.crust)}"></span>`) : '<span class="slot-empty"></span>';
    cells += `<span class="gb-cell${s ? ' filled' : ''}" style="--div:${col === box.cols - 1 ? 'transparent' : div}">${inner}</span>`;
  }
  return `<div class="giftbox gb-${box.size} lid-${lid}" style="--cols:${box.cols}"><div class="gb-inner">${cells}</div></div>`;
}

export function stepper(id, val, min = 1, max = 20) {
  return `<div class="stepper" data-stepper="${id}" data-min="${min}" data-max="${max}">
    <button type="button" data-step="-1" aria-label="-">${ICON.minus}</button>
    <output>${val}</output>
    <button type="button" data-step="1" aria-label="+">${ICON.plus}</button></div>`;
}
export function bindStepper(root, id, onChange) {
  const el = root.querySelector(`[data-stepper="${id}"]`);
  if (!el) return;
  const out = el.querySelector('output');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    const min = +el.dataset.min, max = +el.dataset.max;
    const v = Math.max(min, Math.min(max, +out.textContent + +b.dataset.step));
    out.textContent = v;
    onChange(v);
  });
  return (v, max) => { if (max != null) el.dataset.max = max; out.textContent = v; };
}

let toastTimer;
export function toast(msg) {
  const box = document.getElementById('toast');
  if (!box) return;
  box.innerHTML = `<div class="toast-in">${msg}</div>`;
  box.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('show'), 2600);
}

export function bumpCart() {
  const el = document.querySelector('.cart-btn');
  if (el && window.gsap) window.gsap.fromTo(el, { scale: 1.35, rotate: -10 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
}
