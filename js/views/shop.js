import { t, L, money } from '../i18n.js';
import { PRODUCTS, productById, boxById, BOXES, mixToContents } from '../data.js';
import { ICON, GL, esc, thumbHTML, productCard, hydrate, comboName, badgeHTML, toast, bumpCart, blobSVG } from '../ui.js';
import { cart, builder, saveBuilder } from '../store.js';
import { fudgeById, crustById } from '../data.js';
import { Stage } from '../three/brigadeiro.js';
import { splash } from '../paint.js';

const TAGS = ['all', 'classico', 'frutado', 'nozes', 'especiarias', 'tropical'];
let currentTag = 'all';

export function renderShop() {
  return `<section class="shop">
    <div class="wrap">
      <header class="page-head"><p class="eyebrow">Porto Sweets</p><h1 class="display-2">${t('shop.title')}</h1><p class="lead">${t('shop.sub')}</p></header>
      <div class="filters" role="tablist">${TAGS.map((g) => `<button type="button" class="filter ${g === currentTag ? 'on' : ''}" data-tag="${g}">${t('tag.' + g)}</button>`).join('')}</div>
      <div class="pgrid" id="pgrid"></div>
    </div>
  </section>`;
}
function grid() {
  const list = PRODUCTS.filter((p) => currentTag === 'all' || p.tags.includes(currentTag));
  const custom = `<a class="pcard pcard-custom" href="#/montador" data-reveal>
    <div class="pcard-media">${blobSVG('#fde3e8', 5)}<div class="custom-dice">${ICON.dice}</div></div>
    <div class="pcard-body"><h3>${t('shop.customT')}</h3><p>${t('shop.customX')}</p><div class="pcard-foot"><span class="price">${t('shop.from')} ${money(BOXES[0].price)}</span><span class="go">${ICON.arrow}</span></div></div></a>`;
  return list.map(productCard).join('') + custom;
}
export function mountShop(root) {
  const g = root.querySelector('#pgrid');
  const draw = () => { g.innerHTML = grid(); hydrate(g); if (window.gsap) window.gsap.from(g.children, { y: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }); };
  root.querySelector('.filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]');
    if (!b) return;
    currentTag = b.dataset.tag;
    root.querySelectorAll('.filter').forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });
  draw();
  if (window.gsap) window.gsap.from(root.querySelectorAll('.page-head > *'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' });
}

// ---------------------------------------------------------------- produto
const pstate = { box: null, qty: 1 };
export function renderProduct(params) {
  const p = productById(params.id);
  if (!p) return `<section class="wrap page-pad"><p>${t('p.notFound')}</p><a class="btn btn-primary" href="#/loja">${t('p.back')}</a></section>`;
  if (pstate.pid !== p.id) { pstate.pid = p.id; pstate.box = p.box; pstate.qty = 1; }
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3);
  return `<section class="product">
    <div class="wrap">
      <a class="back" href="#/loja">${ICON.back} ${t('p.back')}</a>
      <div class="p-grid">
        <div class="p-media">
          <div class="p-stage">${blobSVG('#fde3e8', p.id.length * 3, 'p-blob')}${GL ? '<canvas class="stage"></canvas>' : `<div class="b-fallback">${thumbHTML(p.mix[0][0], p.mix[0][1], 'xl')}</div>`}</div>
          <div class="p-combos">${p.mix.map(([f, c], i) => `<button type="button" class="p-combo ${i === 0 ? 'on' : ''}" data-i="${i}">${thumbHTML(f, c, 'mini')}<span>${comboName(f, c)}</span></button>`).join('')}</div>
        </div>
        <div class="p-info">
          ${badgeHTML(p.badge)}
          <h1 class="display-2">${esc(L(p.name))}</h1>
          <p class="p-tag">${esc(L(p.tagline))}</p>
          <p>${esc(L(p.desc))}</p>
          <h3 class="lbl">${t('p.inBox')}</h3>
          <ul class="inbox">${p.mix.map(([f, c]) => `<li><i class="sw" style="background:${fudgeById(f).color}"></i>${comboName(f, c)}</li>`).join('')}</ul>
          <h3 class="lbl">${t('p.size')}</h3>
          <div class="size-pills">${BOXES.map((b) => `<button type="button" class="size-pill ${b.id === pstate.box ? 'on' : ''}" data-box="${b.id}"><b>${b.size}</b><small>${money(b.price)}</small></button>`).join('')}</div>
          <div class="buy-row">
            <div class="stepper" id="pQty"><button type="button" data-step="-1" aria-label="-">${ICON.minus}</button><output>${pstate.qty}</output><button type="button" data-step="1" aria-label="+">${ICON.plus}</button></div>
            <button class="btn btn-primary" id="pAdd" type="button">${ICON.bag} ${t('p.add')} · <span id="pPrice">${money(boxById(pstate.box).price * pstate.qty)}</span></button>
          </div>
          <button class="btn-text" id="pCustom" type="button">${ICON.dice} ${t('p.customize')}</button>
          <p class="note">${t('p.notes')}</p>
        </div>
      </div>
      <div class="sec-head"><h2>${t('p.related')}</h2></div>
      <div class="pgrid three">${related.map(productCard).join('')}</div>
    </div>
  </section>`;
}
export function mountProduct(root, params) {
  const p = productById(params.id);
  if (!p) return;
  let stage = null;
  if (GL) stage = new Stage(root.querySelector('.p-stage .stage'), { fudge: fudgeById(p.mix[0][0]), crust: crustById(p.mix[0][1]), galaxy: 'crust', galaxySize: 0.6, camDist: 7.6, quality: window.innerWidth > 900 ? 1 : 0.6 });
  root.querySelector('.p-combos').addEventListener('click', (e) => {
    const b = e.target.closest('.p-combo');
    if (!b) return;
    root.querySelectorAll('.p-combo').forEach((x) => x.classList.toggle('on', x === b));
    const [f, c] = p.mix[+b.dataset.i];
    if (stage) stage.setCombo(fudgeById(f), crustById(c));
  });
  const price = () => { root.querySelector('#pPrice').textContent = money(boxById(pstate.box).price * pstate.qty); };
  root.querySelector('.size-pills').addEventListener('click', (e) => {
    const b = e.target.closest('[data-box]');
    if (!b) return;
    pstate.box = b.dataset.box;
    root.querySelectorAll('.size-pill').forEach((x) => x.classList.toggle('on', x === b));
    price();
  });
  root.querySelector('#pQty').addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    pstate.qty = Math.max(1, Math.min(20, pstate.qty + +b.dataset.step));
    root.querySelector('#pQty output').textContent = pstate.qty;
    price();
  });
  root.querySelector('#pAdd').addEventListener('click', (e) => {
    const box = boxById(pstate.box);
    cart.add({ kind: 'product', productId: p.id, boxId: box.id, contents: mixToContents(p.mix, box.size), qty: pstate.qty });
    toast(`${ICON.bag} ${t('cart.added')} · <a href="#/carrinho">${t('nav.cart')} →</a>`);
    bumpCart();
    splash(e.clientX, e.clientY, 14, undefined, 1.2);
  });
  root.querySelector('#pCustom').addEventListener('click', () => {
    const box = boxById(pstate.box);
    builder.boxId = box.id;
    builder.contents = mixToContents(p.mix, box.size);
    builder.fudge = p.mix[0][0]; builder.crust = p.mix[0][1];
    saveBuilder();
    location.hash = '#/montador';
  });
  hydrate(root);
  if (window.gsap) window.gsap.from(root.querySelectorAll('.p-info > *'), { y: 24, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' });
  return () => stage && stage.dispose();
}
