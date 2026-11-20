// Porto Sweets — app (rotas, cabeçalho, rodapé, animações gerais)
import { t, lang, setLang, onLang, money } from './i18n.js';
import { FREE_SHIPPING } from './data.js';
import { ICON, hideToast } from './ui.js';
import { cart, bus } from './store.js';
import { initPaint } from './paint.js';
import * as home from './views/home.js';
import * as builderV from './views/builder.js';
import * as shop from './views/shop.js';
import * as ck from './views/checkout.js';

const ROUTES = {
  '': { render: home.render, mount: home.mount, nav: 'home' },
  montador: { render: builderV.render, mount: builderV.mount, nav: 'montador' },
  loja: { render: shop.renderShop, mount: shop.mountShop, nav: 'loja' },
  produto: { render: shop.renderProduct, mount: shop.mountProduct, nav: 'loja', param: 'id' },
  carrinho: { render: ck.renderCart, mount: ck.mountCart, nav: 'carrinho' },
  checkout: { render: ck.renderCheckout, mount: ck.mountCheckout, nav: 'carrinho' },
  pedido: { render: ck.renderOrder, mount: ck.mountOrder, nav: 'conta', param: 'id' },
  conta: { render: ck.renderAccount, mount: ck.mountAccount, nav: 'conta' },
};

const app = document.getElementById('app');
let cleanup = null;
let current = null;

function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean);
  const key = ROUTES[parts[0]] ? parts[0] : '';
  const r = ROUTES[key];
  const params = { query: Object.fromEntries(new URLSearchParams(qs || '')) };
  if (r.param) params[r.param] = parts[1];
  return { key, r, params };
}

function killTriggers() { if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((s) => s.kill()); }

function reveal(root) {
  const g = window.gsap;
  if (!g || !window.ScrollTrigger) return;
  const els = root.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  // entrada curta e cedo (assim que a borda aparece): o espaço nunca fica vazio ao rolar
  g.set(els, { y: 24, opacity: 0 });
  window.ScrollTrigger.batch(els, { start: 'top bottom', once: true, onEnter: (b) => g.to(b, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power2.out', overwrite: true }) });
  root.querySelectorAll('.blob').forEach((b) => {
    g.fromTo(b, { scale: 0.6, rotate: -20 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: b.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });
}

function show(animate = true) {
  const { key, r, params } = parse();
  const same = current === location.hash;
  current = location.hash;
  if (cleanup) { try { cleanup(); } catch (e) { console.warn(e); } cleanup = null; }
  hideToast();
  killTriggers();
  const rerender = () => show(false);
  app.innerHTML = r.render(params);
  cleanup = r.mount(app, params, rerender) || null;
  reveal(app);
  setNav(r.nav);
  closeMenu();
  if (animate && !same) {
    window.scrollTo(0, 0);
    if (window.gsap) window.gsap.fromTo(app, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform' });
  }
  const goto = sessionStorage.getItem('ps_goto');
  if (goto && key === '') { sessionStorage.removeItem('ps_goto'); setTimeout(() => scrollToId(goto), 350); }
  document.title = key === '' ? 'Porto Sweets — Brigadeiros' : `${(app.querySelector('h1')?.textContent || '').trim()} · Porto Sweets`;
  if (window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 200);
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

// ---------------------------------------------------------------- cabeçalho/rodapé
const header = document.getElementById('header');
const footer = document.getElementById('footer');

function renderHeader() {
  header.innerHTML = `<div class="wrap hdr">
    <a class="brand" href="#/" aria-label="Porto Sweets"><img src="assets/logo-icone.webp" alt=""><span>Porto Sweets</span></a>
    <nav class="nav" id="nav">
      <a href="#/montador" data-nav="montador">${t('nav.builder')}</a>
      <a href="#/loja" data-nav="loja">${t('nav.shop')}</a>
      <button type="button" data-goto="historia">${t('nav.story')}</button>
      <a href="#/conta" data-nav="conta" class="nav-acc">${ICON.user}<span>${t('nav.account')}</span></a>
    </nav>
    <div class="hdr-actions">
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="pt" class="${lang === 'pt' ? 'on' : ''}">PT</button><button type="button" data-lang="en" class="${lang === 'en' ? 'on' : ''}">EN</button></div>
      <a class="cart-btn" href="#/carrinho" aria-label="${t('nav.cart')}">${ICON.bag}<span class="count" id="cartCount"></span></a>
      <button class="burger" type="button" aria-label="${t('nav.menu')}" aria-expanded="false"><i></i><i></i></button>
    </div>
  </div>`;
  updateCount();
}
function renderFooter() {
  footer.innerHTML = `<div class="wrap foot">
    <div class="foot-brand"><img src="assets/logo-completo.webp" alt="Porto Sweets"><p>${t('foot.tag')}</p></div>
    <div><h4>${t('foot.nav')}</h4><a href="#/montador">${t('nav.builder')}</a><a href="#/loja">${t('nav.shop')}</a><button type="button" data-goto="historia">${t('nav.story')}</button><a href="#/conta">${t('nav.account')}</a></div>
    <div><h4>${t('foot.visit')}</h4><p>${t('foot.visitText', { free: money(FREE_SHIPPING) })}</p></div>
    <!-- Redes sociais: os ícones (ICON.instagram/tiktok/facebook/whatsapp em ui.js) voltam quando os perfis existirem -->
  </div>
  <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} Porto Sweets · ${t('foot.demo')}</span><span>${t('foot.by')} <a href="https://femik.ca" target="_blank" rel="noopener">Femik</a></span></div>`;
}
function updateCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cart.count();
  el.textContent = n;
  el.classList.toggle('show', n > 0);
}
function setNav(key) { header.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === key)); }
function closeMenu() { document.body.classList.remove('menu-open'); header.querySelector('.burger')?.setAttribute('aria-expanded', 'false'); }

document.addEventListener('click', (e) => {
  const l = e.target.closest('[data-lang]');
  if (l) { setLang(l.dataset.lang); return; }
  const g = e.target.closest('[data-goto]');
  if (g) {
    e.preventDefault();
    closeMenu();
    if (parse().key === '') scrollToId(g.dataset.goto);
    else { sessionStorage.setItem('ps_goto', g.dataset.goto); location.hash = '#/'; }
    return;
  }
  const b = e.target.closest('.burger');
  if (b) { const open = document.body.classList.toggle('menu-open'); b.setAttribute('aria-expanded', String(open)); }
});

onLang(() => { renderHeader(); renderFooter(); show(false); });
bus.addEventListener('cart', updateCount);
window.addEventListener('hashchange', () => show(true));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// ---------------------------------------------------------------- start
if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
renderHeader();
renderFooter();
initPaint();
document.querySelector('#loader p').textContent = t('loader');
const t0 = performance.now();
show(false);
const hideLoader = () => {
  const el = document.getElementById('loader');
  const wait = Math.max(0, 1300 - (performance.now() - t0));
  setTimeout(() => {
    if (window.gsap) {
      window.gsap.to(el, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'power3.inOut', onComplete: () => el.remove() });
    } else el.remove();
    document.body.classList.add('ready');
  }, wait);
};
let hidden = false;
const once = () => { if (!hidden) { hidden = true; hideLoader(); } };
if (document.readyState === 'complete') once(); else { window.addEventListener('load', once); setTimeout(once, 3200); }
