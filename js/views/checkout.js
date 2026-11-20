import { t, L, money, fmtDate } from '../i18n.js';
import { productById, boxById, PICKUP_ADDRESS, DELIVERY_FEE } from '../data.js';
import { ICON, esc, thumbHTML, hydrate, comboName, giftbox, toast } from '../ui.js';
import { cart, account } from '../store.js';
import { confetti, splash } from '../paint.js';

const itemTitle = (it) => (it.kind === 'product' ? L(productById(it.productId)?.name) : t('cart.custom'));

// ---------------------------------------------------------------- carrinho
export function renderCart() {
  if (!cart.items.length) {
    return `<section class="cart wrap page-pad"><header class="page-head"><h1 class="display-2">${t('cart.title')}</h1></header>
      <div class="empty-state card">${thumbHTML('morango', 'perolas', 'big')}<p>${t('cart.empty')}</p><a class="btn btn-primary" href="#/montador">${ICON.dice} ${t('cart.emptyCta')}</a><a class="btn-text" href="#/loja">${t('nav.shop')} →</a></div></section>`;
  }
  return `<section class="cart wrap page-pad">
    <header class="page-head"><h1 class="display-2">${t('cart.title')}</h1></header>
    <div class="cart-grid">
      <ul class="cart-list">${cart.items.map((it) => {
        const box = boxById(it.boxId);
        const shown = it.contents.slice(0, 4);
        return `<li class="cart-item card" data-uid="${it.uid}">
          <div class="ci-box">${giftbox(box.id, it.contents, { thumbs: false, lid: it.kind === 'product' ? 'framboesa' : 'marinho' })}</div>
          <div class="ci-info">
            <h3>${esc(itemTitle(it))}</h3>
            <p class="muted">${t('cart.boxOf', { n: box.size })}</p>
            <ul class="ci-contents">${shown.map((c) => `<li>${thumbHTML(c.fudge, c.crust, 'mini')}<span>${comboName(c.fudge, c.crust)}</span><b>×${c.qty}</b></li>`).join('')}${it.contents.length > 4 ? `<li class="more">+${it.contents.length - 4}</li>` : ''}</ul>
          </div>
          <div class="ci-side">
            <b class="ci-price">${money(cart.linePrice(it))}</b>
            <div class="stepper" data-q="${it.uid}"><button type="button" data-step="-1" aria-label="-">${ICON.minus}</button><output>${it.qty}</output><button type="button" data-step="1" aria-label="+">${ICON.plus}</button></div>
            <button type="button" class="btn-text danger" data-rm="${it.uid}">${t('cart.remove')}</button>
          </div>
        </li>`;
      }).join('')}</ul>
      <aside class="summary card">
        <h2>${t('co.summary')}</h2>
        <div class="sum-row"><span>${t('cart.subtotal')}</span><b>${money(cart.subtotal())}</b></div>
        <p class="muted small">${t('cart.shipNote')}</p>
        <a class="btn btn-primary btn-wide" href="#/checkout">${ICON.lock} ${t('cart.checkout')}</a>
        <a class="btn-text" href="#/loja">${t('cart.continue')}</a>
      </aside>
    </div>
  </section>`;
}
export function mountCart(root, params, rerender) {
  root.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]');
    if (rm) { cart.remove(rm.dataset.rm); rerender(); return; }
    const st = e.target.closest('[data-step]');
    const q = st && st.closest('[data-q]');
    if (q) {
      const it = cart.items.find((i) => i.uid === q.dataset.q);
      cart.setQty(it.uid, it.qty + +st.dataset.step);
      rerender();
    }
  });
  hydrate(root);
}

// ---------------------------------------------------------------- checkout
const co = { step: 1, name: '', email: '', phone: '', method: 'pickup', address: '', postal: '', date: '', time: '', notes: '' };
const SLOTS = { pickup: ['10:00–12:00', '12:00–14:00', '14:00–16:00', '16:00–18:00'], delivery: ['12:00–15:00', '15:00–18:00', '18:00–21:00'] };
const minDate = () => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); };

function summary() {
  const tt = cart.totals(co.method);
  return `<aside class="summary card">
    <h2>${t('co.summary')}</h2>
    <ul class="sum-items">${cart.items.map((it) => `<li><span>${it.qty} × ${esc(itemTitle(it))} <small>(${boxById(it.boxId).size})</small></span><b>${money(cart.linePrice(it))}</b></li>`).join('')}</ul>
    <div class="sum-row"><span>${t('cart.subtotal')}</span><b>${money(tt.sub)}</b></div>
    <div class="sum-row"><span>${t('co.ship')}</span><b>${tt.ship ? money(tt.ship) : t('co.free')}</b></div>
    <div class="sum-row"><span>${t('co.gst')}</span><b>${money(tt.gst)}</b></div>
    <div class="sum-row total"><span>${t('co.total')}</span><b>${money(tt.total)}</b></div>
  </aside>`;
}

function field(id, label, type = 'text', extra = '') {
  return `<label class="field"><span>${label}</span><input id="${id}" name="${id}" type="${type}" value="${esc(co[id] ?? '')}" ${extra}><em class="err" data-err="${id}"></em></label>`;
}

function stepBody() {
  if (co.step === 1) {
    const u = account.data.user;
    if (u && !co.name) { co.name = u.name; co.email = u.email; co.phone = u.phone || ''; }
    return `<div class="co-step">${field('name', t('co.name'), 'text', 'autocomplete="name"')}${field('email', t('co.email'), 'email', 'autocomplete="email"')}${field('phone', t('co.phone'), 'tel', 'autocomplete="tel"')}
      <div class="co-nav"><a class="btn-text" href="#/carrinho">${ICON.back} ${t('nav.cart')}</a><button class="btn btn-primary" data-next>${t('co.next')} ${ICON.arrow}</button></div></div>`;
  }
  if (co.step === 2) {
    return `<div class="co-step">
      <div class="methods">
        <label class="method ${co.method === 'pickup' ? 'on' : ''}"><input type="radio" name="method" value="pickup" ${co.method === 'pickup' ? 'checked' : ''}>${ICON.pin}<span><b>${t('co.pickup')}</b><small>${t('co.pickupX')} · ${esc(PICKUP_ADDRESS)}</small></span></label>
        <label class="method ${co.method === 'delivery' ? 'on' : ''}"><input type="radio" name="method" value="delivery" ${co.method === 'delivery' ? 'checked' : ''}>${ICON.truck}<span><b>${t('co.delivery')}</b><small>+${money(DELIVERY_FEE)} · ${t('co.deliveryX')}</small></span></label>
      </div>
      ${co.method === 'delivery' ? `<div class="two">${field('address', t('co.address'), 'text', 'autocomplete="street-address"')}${field('postal', t('co.postal'), 'text', 'autocomplete="postal-code" maxlength="7"')}</div>` : ''}
      <div class="two">${field('date', t('co.date'), 'date', `min="${minDate()}"`)}
        <label class="field"><span>${t('co.time')}</span><select id="time">${SLOTS[co.method].map((s) => `<option ${co.time === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label></div>
      <label class="field"><span>${t('co.notes')}</span><textarea id="notes" rows="2" placeholder="${esc(t('co.notesPh'))}">${esc(co.notes)}</textarea></label>
      <div class="co-nav"><button class="btn-text" data-back>${ICON.back} ${t('co.back')}</button><button class="btn btn-primary" data-next>${t('co.next')} ${ICON.arrow}</button></div></div>`;
  }
  const tt = cart.totals(co.method);
  return `<div class="co-step">
    <p class="demo-note">${t('co.demo')}</p>
    <div class="stripe">
      <label class="field"><span>${t('co.card')}</span><div class="card-input"><input id="card" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" maxlength="19"><i class="brand" id="brand"></i></div><em class="err" data-err="card"></em></label>
      <div class="two"><label class="field"><span>${t('co.exp')}</span><input id="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / AA" maxlength="7"><em class="err" data-err="exp"></em></label>
        <label class="field"><span>${t('co.cvc')}</span><input id="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4"><em class="err" data-err="cvc"></em></label></div>
      <label class="field"><span>${t('co.cardName')}</span><input id="cname" autocomplete="cc-name" value="${esc(co.name)}"></label>
    </div>
    <div class="co-nav"><button class="btn-text" data-back>${ICON.back} ${t('co.back')}</button><button class="btn btn-primary btn-pay" data-pay>${ICON.lock} ${t('co.pay', { total: money(tt.total) })}</button></div>
    <p class="secure">${ICON.lock} ${t('co.secure')}</p></div>`;
}

export function renderCheckout() {
  if (!cart.items.length) return `<section class="wrap page-pad"><p>${t('co.emptyCart')}</p><a class="btn btn-primary" href="#/loja">${t('nav.shop')}</a></section>`;
  if (!co.time) co.time = SLOTS[co.method][1];
  return `<section class="checkout wrap page-pad">
    <header class="page-head"><h1 class="display-2">${t('co.title')}</h1></header>
    <ol class="co-steps">${[1, 2, 3].map((i) => `<li class="${co.step === i ? 'on' : co.step > i ? 'done' : ''}"><span>${i}</span>${t('co.s' + i)}</li>`).join('')}</ol>
    <div class="co-grid"><form class="co-form card" novalidate>${stepBody()}</form>${summary()}</div>
  </section>`;
}

const luhn = (n) => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };

export function mountCheckout(root, params, rerender) {
  const form = root.querySelector('.co-form');
  if (!form) return;
  const val = (id) => (form.querySelector('#' + id)?.value || '').trim();
  const err = (id, msg) => { const e = form.querySelector(`[data-err="${id}"]`); if (e) e.textContent = msg || ''; return !msg; };
  const collect = () => { ['name', 'email', 'phone', 'address', 'postal', 'date', 'time', 'notes'].forEach((k) => { const el = form.querySelector('#' + k); if (el) co[k] = el.value.trim(); }); };
  const validate = () => {
    collect();
    let ok = true;
    if (co.step === 1) {
      ok = err('name', co.name ? '' : t('co.req')) & err('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(co.email) ? '' : (co.email ? t('co.emailErr') : t('co.req'))) & err('phone', co.phone ? '' : t('co.req'));
    } else if (co.step === 2) {
      if (co.method === 'delivery') {
        ok = err('address', co.address ? '' : t('co.req')) & err('postal', /^T(1Y|2[A-Z]|3[A-Z])\s?\d[A-Z]\d$/i.test(co.postal) ? '' : t('co.postalErr'));
      }
      ok = err('date', co.date && co.date >= minDate() ? '' : t('co.dateErr')) && ok;
    }
    return !!ok;
  };
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('change', (e) => {
    if (e.target.name === 'method') { collect(); co.method = e.target.value; co.time = SLOTS[co.method][1]; rerender(); }
  });
  form.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]')) { e.preventDefault(); if (validate()) { co.step++; rerender(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    if (e.target.closest('[data-back]')) { e.preventDefault(); collect(); co.step--; rerender(); }
    if (e.target.closest('[data-pay]')) { e.preventDefault(); pay(e); }
  });
  // máscaras do cartão (estilo Stripe)
  const card = form.querySelector('#card');
  if (card) {
    card.addEventListener('input', () => {
      const d = card.value.replace(/\D/g, '').slice(0, 16);
      card.value = d.replace(/(.{4})/g, '$1 ').trim();
      const b = d[0] === '4' ? 'visa' : d[0] === '5' ? 'mc' : d[0] === '3' ? 'amex' : '';
      form.querySelector('#brand').className = 'brand ' + b;
      form.querySelector('#brand').textContent = { visa: 'VISA', mc: 'MC', amex: 'AMEX' }[b] || '';
    });
    const exp = form.querySelector('#exp');
    exp.addEventListener('input', () => {
      const d = exp.value.replace(/\D/g, '').slice(0, 4);
      exp.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    });
    form.querySelector('#cvc').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, ''); });
  }
  function pay(ev) {
    const num = val('card').replace(/\s/g, '');
    const [mm, yy] = val('exp').split('/').map((s) => +s.trim());
    const now = new Date();
    const expOk = mm >= 1 && mm <= 12 && yy >= 0 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
    const ok = err('card', num.length >= 15 && luhn(num) ? '' : t('co.cardErr')) & err('exp', expOk ? '' : t('co.expErr')) & err('cvc', /^\d{3,4}$/.test(val('cvc')) ? '' : t('co.cvcErr'));
    if (!ok) return;
    const ov = document.getElementById('processing');
    ov.querySelector('p').textContent = t('co.processing');
    ov.classList.add('show');
    splash(ev.clientX, ev.clientY, 10);
    setTimeout(() => {
      const tt = cart.totals(co.method);
      const id = 'PS-' + String(Math.floor(1000 + Math.random() * 9000));
      const order = { id, at: new Date().toISOString(), items: cart.items.map((i) => ({ ...i })), method: co.method, date: co.date, time: co.time, address: co.method === 'delivery' ? `${co.address}, ${co.postal.toUpperCase()}` : PICKUP_ADDRESS, name: co.name, email: co.email, phone: co.phone, notes: co.notes, totals: tt, card: num.slice(-4) };
      if (!account.data.user) account.login(co.name, co.email);
      account.addOrder(order);
      cart.clear();
      Object.assign(co, { step: 1, notes: '' });
      ov.classList.remove('show');
      location.hash = `#/pedido/${id}`;
      setTimeout(confetti, 300);
    }, 2300);
  }
}

// ---------------------------------------------------------------- confirmação
export function renderOrder(params) {
  const o = account.order(params.id);
  if (!o) return `<section class="wrap page-pad"><p>${t('ok.notFound')}</p><a class="btn btn-primary" href="#/loja">${t('ok.shop')}</a></section>`;
  const when = o.method === 'pickup' ? t('ok.pickup', { date: fmtDate(o.date), time: o.time }) : t('ok.delivery', { date: fmtDate(o.date), time: o.time, address: esc(o.address) });
  const all = o.items.flatMap((i) => i.contents).slice(0, 9);
  return `<section class="order-ok wrap page-pad">
    <div class="ok-card card">
      <img class="ok-seal" src="assets/logo-selo.svg" alt="">
      <h1 class="display-2">${t('ok.title')}</h1>
      <p class="lead">${t('ok.text', { name: esc(o.name.split(' ')[0]), id: `<b>${o.id}</b>`, email: esc(o.email) })}</p>
      <p class="ok-when">${o.method === 'pickup' ? ICON.pin : ICON.truck} ${when}</p>
      <div class="ok-trio">${all.slice(0, 5).map((c) => thumbHTML(c.fudge, c.crust, 'mid')).join('')}</div>
      <div class="sum-row total"><span>${t('co.total')}</span><b>${money(o.totals.total)}</b></div>
      <div class="cta-row center"><a class="btn btn-primary" href="#/conta">${t('ok.orders')}</a><a class="btn btn-ghost" href="#/loja">${t('ok.shop')}</a></div>
    </div>
  </section>`;
}
export function mountOrder(root) {
  hydrate(root);
  if (window.gsap) {
    window.gsap.from(root.querySelector('.ok-seal'), { scale: 0, rotate: -40, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
    window.gsap.from(root.querySelectorAll('.ok-trio .thumb'), { y: 40, opacity: 0, stagger: 0.08, delay: 0.3, ease: 'back.out(2)' });
  }
}

// ---------------------------------------------------------------- conta
let tab = 'orders';
export function renderAccount() {
  const u = account.data.user;
  if (!u) {
    return `<section class="account wrap page-pad"><div class="login card">
      <img class="login-seal" src="assets/logo-marca.svg" alt="">
      <h1 class="display-2">${t('acc.loginT')}</h1><p class="muted">${t('acc.loginX')}</p>
      <form id="login" novalidate>${field('name', t('co.name'))}${field('email', t('co.email'), 'email')}
      <button class="btn btn-primary btn-wide">${t('acc.enter')}</button></form></div></section>`;
  }
  const orders = account.data.orders, favs = account.data.favorites;
  if (tab === 'data') Object.assign(co, { name: u.name, email: u.email, phone: u.phone || '' });
  const body = tab === 'orders'
    ? (orders.length ? `<ul class="orders">${orders.map((o) => `<li class="order card"><div><b>${o.id}</b><span class="status">${t('acc.status')}</span><p class="muted small">${fmtDate(o.date)} · ${o.time} · ${o.method === 'pickup' ? t('co.pickup') : t('co.delivery')}</p></div>
        <div class="order-thumbs">${o.items.flatMap((i) => i.contents).slice(0, 4).map((c) => thumbHTML(c.fudge, c.crust, 'mini')).join('')}</div><b>${money(o.totals.total)}</b></li>`).join('')}</ul>`
      : `<div class="empty-state">${thumbHTML('coco', 'coco-ralado', 'big')}<p>${t('acc.noOrders')}</p><a class="btn btn-primary" href="#/loja">${t('nav.shop')}</a></div>`)
    : tab === 'favs'
      ? (favs.length ? `<div class="favs">${favs.map((f) => `<div class="fav card">${thumbHTML(f.fudge, f.crust, 'mid')}<p>${comboName(f.fudge, f.crust)}</p><button class="btn-text" data-open="${f.fudge}|${f.crust}">${t('acc.open')} →</button></div>`).join('')}</div>`
        : `<div class="empty-state">${thumbHTML('morango', 'acucar-rosa', 'big')}<p>${t('acc.noFavs')}</p><a class="btn btn-primary" href="#/montador">${t('nav.builder')}</a></div>`)
      : `<form id="profile" class="profile" novalidate>${field('name', t('co.name'))}${field('email', t('co.email'), 'email')}${field('phone', t('co.phone'), 'tel')}<button class="btn btn-primary">${t('acc.save')}</button></form>`;
  return `<section class="account wrap page-pad">
    <header class="page-head row"><div><p class="eyebrow">${t('acc.title')}</p><h1 class="display-2">${t('acc.hello', { name: esc(u.name.split(' ')[0]) })}</h1></div><button class="btn-text" id="logout">${t('acc.logout')}</button></header>
    <div class="tabs">${['orders', 'favs', 'data'].map((k) => `<button type="button" class="tab ${tab === k ? 'on' : ''}" data-tab="${k}">${t('acc.' + k)}${k === 'favs' && favs.length ? ` <small>${favs.length}</small>` : ''}</button>`).join('')}</div>
    <div class="tab-body">${body}</div>
  </section>`;
}
export function mountAccount(root, params, rerender) {
  const login = root.querySelector('#login');
  if (login) {
    login.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = login.querySelector('#name').value.trim(), m = login.querySelector('#email').value.trim();
      login.querySelector('[data-err="name"]').textContent = n ? '' : t('co.req');
      login.querySelector('[data-err="email"]').textContent = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m) ? '' : t('co.emailErr');
      if (!n || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) return;
      account.login(n, m);
      rerender();
    });
  }
  root.querySelector('#logout')?.addEventListener('click', () => { account.logout(); rerender(); });
  root.querySelector('.tabs')?.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; rerender(); } });
  root.querySelector('.favs')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    import('../store.js').then(({ builder, saveBuilder }) => { [builder.fudge, builder.crust] = b.dataset.open.split('|'); saveBuilder(); location.hash = '#/montador'; });
  });
  const prof = root.querySelector('#profile');
  if (prof) prof.addEventListener('submit', (e) => {
    e.preventDefault();
    account.update({ name: prof.querySelector('#name').value.trim() || account.data.user.name, email: prof.querySelector('#email').value.trim() || account.data.user.email, phone: prof.querySelector('#phone').value.trim() });
    toast(t('acc.saved'));
    rerender();
  });
  hydrate(root);
}
