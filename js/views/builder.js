import { t, L, money } from '../i18n.js';
import { FUDGES, CRUSTS, BOXES, fudgeById, crustById, boxById, randomCombo } from '../data.js';
import { ICON, GL, esc, thumbHTML, hydrate, giftbox, crustSwatch, comboName, comboText, toast, bumpCart } from '../ui.js';
import { builder, saveBuilder, account, cart } from '../store.js';
import { Stage } from '../three/brigadeiro.js';
import { splash } from '../paint.js';

const used = () => builder.contents.reduce((s, c) => s + c.qty, 0);

function dd(kind, items, current) {
  const isF = kind === 'fudge';
  const sw = (id) => (isF ? `style="background:${fudgeById(id).color}"` : `style="${crustSwatch(id)}"`);
  return `<div class="dd" data-dd="${kind}">
    <button class="dd-btn" type="button" aria-haspopup="listbox" aria-expanded="false"><i class="sw ${isF ? '' : 'crust'}" ${sw(current)}></i><span class="dd-label">${esc(L((isF ? fudgeById : crustById)(current).name))}</span>${ICON.chev}</button>
    <ul class="dd-list" role="listbox">${items.map((it) => `<li role="option" data-id="${it.id}" aria-selected="${it.id === current}"><i class="sw ${isF ? '' : 'crust'}" ${sw(it.id)}></i>${esc(L(it.name))}</li>`).join('')}</ul>
  </div>`;
}
function chips(kind, items, current) {
  const isF = kind === 'fudge';
  return `<div class="chips ${isF ? 'chips-f' : 'chips-c'}" data-chips="${kind}">${items.map((it) => `<button type="button" class="chip ${it.id === current ? 'on' : ''}" data-id="${it.id}" title="${esc(L(it.name))}" aria-label="${esc(L(it.name))}"><i class="sw ${isF ? '' : 'crust'}" style="${isF ? 'background:' + it.color : crustSwatch(it.id)}"></i></button>`).join('')}</div>`;
}

export function render(params) {
  if (params.query.box && boxById(params.query.box).id === params.query.box) {
    builder.boxId = params.query.box;
    trimToBox();
  }
  const f = fudgeById(builder.fudge), c = crustById(builder.crust);
  return `
  <section class="builder">
    <div class="wrap">
      <header class="page-head"><p class="eyebrow">${t('b.combos', { n: FUDGES.length * CRUSTS.length })}</p><h1 class="display-2">${t('b.title')}</h1><p class="lead">${t('b.sub')}</p></header>
      <div class="b-grid">
        <aside class="b-col b-left">
          <h2 class="b-step"><span>1</span>${t('b.fudge')} <small>${t('b.fudgeHint')}</small></h2>
          ${dd('fudge', FUDGES, f.id)}
          <p class="b-desc" id="fDesc">${esc(L(f.desc))}</p>
          ${chips('fudge', FUDGES, f.id)}
        </aside>
        <div class="b-center">
          <div class="b-stage">${GL ? '<canvas class="stage" aria-label="Brigadeiro 3D"></canvas>' : `<div class="b-fallback" id="bFallback">${thumbHTML(f.id, c.id, 'xl')}</div>`}</div>
          <p class="b-name" id="bName">${comboName(f.id, c.id)}</p>
          <div class="b-actions">
            <button class="btn btn-primary" id="surprise" type="button">${ICON.dice} ${t('b.surprise')}</button>
            <button class="btn-icon ${account.isFav(f.id, c.id) ? 'on' : ''}" id="fav" type="button" aria-label="${t('b.fav')}">${ICON.heart}</button>
          </div>
          <p class="hint">${t('hint.drag')}</p>
        </div>
        <aside class="b-col b-right">
          <h2 class="b-step"><span>2</span>${t('b.crust')} <small>${t('b.crustHint')}</small></h2>
          ${dd('crust', CRUSTS, c.id)}
          <p class="b-desc" id="cDesc">${esc(L(c.desc))}</p>
          ${chips('crust', CRUSTS, c.id)}
        </aside>
      </div>

      <div class="b-box card" id="boxArea">
        <h2 class="b-step"><span>3</span>${t('b.box')}</h2>
        <div class="size-tabs" role="tablist">${BOXES.map((b) => `<button type="button" role="tab" class="size-tab" data-box="${b.id}"><b>${b.size}</b><small>${money(b.price)}</small></button>`).join('')}</div>
        <div class="b-box-grid">
          <div class="b-box-left">
            <div class="add-row">
              <div class="add-combo">${thumbHTML(f.id, c.id, 'mini')}<span id="addName">${comboName(f.id, c.id)}</span></div>
              <label class="lbl">${t('b.qty')}</label>
              <div class="add-ctrls">
                <div class="stepper" id="qtyStep"><button type="button" data-step="-1" aria-label="-">${ICON.minus}</button><output id="qtyOut">1</output><button type="button" data-step="1" aria-label="+">${ICON.plus}</button></div>
                <button class="btn btn-dark" id="addBox" type="button">${ICON.plus} ${t('b.add')}</button>
              </div>
            </div>
            <ul class="contents" id="contents"></ul>
            <div class="box-tools"><button class="btn btn-ghost btn-small" id="fillBox" type="button">${ICON.dice} ${t('b.fill')}</button><button class="btn-text" id="clearBox" type="button">${t('b.clear')}</button></div>
          </div>
          <div class="b-box-right">
            <div id="boxVisual"></div>
            <div class="progress"><span id="progBar"></span></div>
            <div class="box-total"><span id="progTxt"></span><b id="boxPrice"></b></div>
            <button class="btn btn-primary btn-wide" id="boxToCart" type="button">${ICON.bag} ${t('b.addCart')}</button>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function trimToBox() {
  const max = boxById(builder.boxId).size;
  let total = 0;
  builder.contents = builder.contents.filter((c) => {
    if (total >= max) return false;
    if (total + c.qty > max) c.qty = max - total;
    total += c.qty;
    return c.qty > 0;
  });
  saveBuilder();
}
function addContent(fudge, crust, qty) {
  const ex = builder.contents.find((x) => x.fudge === fudge && x.crust === crust);
  if (ex) ex.qty += qty; else builder.contents.push({ fudge, crust, qty });
}

export function mount(root) {
  const g = window.gsap;
  let stage = null;
  if (GL) stage = new Stage(root.querySelector('.b-stage .stage'), { fudge: fudgeById(builder.fudge), crust: crustById(builder.crust), galaxy: 'crust', galaxySize: 0.6, camDist: 7.4, quality: window.innerWidth > 900 ? 1 : 0.6 });
  let qty = 1;

  const updateCombo = (animate = true) => {
    const f = fudgeById(builder.fudge), c = crustById(builder.crust);
    saveBuilder();
    if (stage) stage.setCombo(f, c, animate);
    else { const fb = root.querySelector('#bFallback'); if (fb) fb.innerHTML = thumbHTML(f.id, c.id, 'xl'); }
    // dropdowns + chips
    [['fudge', f], ['crust', c]].forEach(([k, it]) => {
      const box = root.querySelector(`[data-dd="${k}"]`);
      box.querySelector('.dd-label').textContent = L(it.name);
      box.querySelector('.dd-btn .sw').setAttribute('style', k === 'fudge' ? `background:${it.color}` : crustSwatch(it.id));
      box.querySelectorAll('li').forEach((li) => li.setAttribute('aria-selected', li.dataset.id === it.id));
      root.querySelectorAll(`[data-chips="${k}"] .chip`).forEach((ch) => ch.classList.toggle('on', ch.dataset.id === it.id));
    });
    root.querySelector('#fDesc').textContent = L(f.desc);
    root.querySelector('#cDesc').textContent = L(c.desc);
    root.querySelector('#bName').innerHTML = comboName(f.id, c.id);
    root.querySelector('#addName').innerHTML = comboName(f.id, c.id);
    const ac = root.querySelector('.add-combo');
    ac.querySelector('.thumb').outerHTML = thumbHTML(f.id, c.id, 'mini');
    hydrate(ac);
    root.querySelector('#fav').classList.toggle('on', account.isFav(f.id, c.id));
    if (g && animate) g.fromTo('#bName', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
  };

  const renderBox = () => {
    const box = boxById(builder.boxId);
    const n = used();
    root.querySelectorAll('.size-tab').forEach((b) => b.classList.toggle('on', b.dataset.box === box.id));
    root.querySelector('#boxVisual').innerHTML = giftbox(box.id, builder.contents);
    root.querySelector('#contents').innerHTML = builder.contents.length
      ? builder.contents.map((c, i) => `<li>${thumbHTML(c.fudge, c.crust, 'mini')}<span class="cn">${comboName(c.fudge, c.crust)}</span><b>× ${c.qty}</b><button type="button" class="btn-x" data-rm="${i}" aria-label="remove">${ICON.x}</button></li>`).join('')
      : `<li class="empty">${t('b.empty')}</li>`;
    const rem = box.size - n;
    root.querySelector('#progBar').style.width = `${(n / box.size) * 100}%`;
    root.querySelector('#progTxt').innerHTML = `<b>${n}/${box.size}</b> · ${rem > 0 ? t('b.remaining', { n: rem }) : `<span class="ok">${t('b.full')}</span>`}`;
    root.querySelector('#boxPrice').textContent = money(box.price);
    root.querySelector('#boxToCart').disabled = rem > 0;
    root.querySelector('#addBox').disabled = rem <= 0;
    root.querySelector('#fillBox').disabled = rem <= 0;
    qty = Math.max(1, Math.min(qty, Math.max(1, rem)));
    root.querySelector('#qtyOut').textContent = qty;
    hydrate(root.querySelector('#boxArea'));
  };

  // dropdowns
  const closeAll = () => root.querySelectorAll('.dd.open').forEach((d) => { d.classList.remove('open'); d.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); });
  root.querySelectorAll('.dd').forEach((d) => {
    d.querySelector('.dd-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !d.classList.contains('open');
      closeAll();
      d.classList.toggle('open', open);
      d.querySelector('.dd-btn').setAttribute('aria-expanded', String(open));
      if (open) { const sel = d.querySelector('[aria-selected="true"]'); if (sel) sel.scrollIntoView({ block: 'nearest' }); }
    });
    d.querySelector('.dd-list').addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      builder[d.dataset.dd] = li.dataset.id;
      closeAll();
      updateCombo();
      const r = d.getBoundingClientRect();
      splash(r.left + r.width / 2, r.top + 20, 6);
    });
  });
  const docClick = () => closeAll();
  document.addEventListener('click', docClick);

  root.querySelectorAll('[data-chips]').forEach((wrap) => wrap.addEventListener('click', (e) => {
    const ch = e.target.closest('.chip');
    if (!ch) return;
    const k = wrap.dataset.chips;
    if (builder[k] === ch.dataset.id) { stage && stage.brig.squish(1); return; }
    builder[k] = ch.dataset.id;
    updateCombo();
    const r = ch.getBoundingClientRect();
    const cols = k === 'fudge' ? [fudgeById(ch.dataset.id).color] : crustById(ch.dataset.id).swatch;
    splash(r.left + r.width / 2, r.top + r.height / 2, 8, cols, 0.8);
  }));

  // Surpreenda-me: roleta de nomes e depois a combinação
  let spinning = false;
  root.querySelector('#surprise').addEventListener('click', (e) => {
    if (spinning) return;
    spinning = true;
    const nameEl = root.querySelector('#bName');
    let i = 0;
    const spin = setInterval(() => {
      const r = randomCombo();
      nameEl.innerHTML = comboName(r.fudge, r.crust);
      if (++i > 9) {
        clearInterval(spin);
        let n;
        do { n = randomCombo(); } while (n.fudge === builder.fudge && n.crust === builder.crust);
        builder.fudge = n.fudge; builder.crust = n.crust;
        updateCombo();
        spinning = false;
      }
    }, 70);
    splash(e.clientX, e.clientY, 14, undefined, 1.1);
  });

  root.querySelector('#fav').addEventListener('click', (e) => {
    const on = account.toggleFav(builder.fudge, builder.crust);
    e.currentTarget.classList.toggle('on', on);
    toast(on ? `${ICON.heart} ${t('fav.added')}` : t('fav.removed'));
    if (on) splash(e.clientX, e.clientY, 8, ['#e23a55', '#ec6f9c']);
  });

  // caixa
  root.querySelector('.size-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-box]');
    if (!b || b.dataset.box === builder.boxId) return;
    builder.boxId = b.dataset.box;
    trimToBox();
    renderBox();
    if (g) g.from('#boxVisual .giftbox', { scale: 0.92, opacity: 0, duration: 0.5, ease: 'back.out(1.6)' });
  });
  root.querySelector('#qtyStep').addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    const rem = boxById(builder.boxId).size - used();
    qty = Math.max(1, Math.min(Math.max(1, rem), qty + +b.dataset.step));
    root.querySelector('#qtyOut').textContent = qty;
  });
  root.querySelector('#addBox').addEventListener('click', (e) => {
    const rem = boxById(builder.boxId).size - used();
    if (rem <= 0) return;
    addContent(builder.fudge, builder.crust, Math.min(qty, rem));
    saveBuilder();
    renderBox();
    stage && stage.brig.squish(0.8);
    splash(e.clientX, e.clientY, 8, [fudgeById(builder.fudge).color, ...crustById(builder.crust).swatch]);
    if (g) g.from('#boxVisual .gb-cell.filled', { scale: 0.4, duration: 0.5, stagger: 0.01, ease: 'back.out(3)' });
  });
  root.querySelector('#contents').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rm]');
    if (!b) return;
    builder.contents.splice(+b.dataset.rm, 1);
    saveBuilder();
    renderBox();
  });
  root.querySelector('#fillBox').addEventListener('click', (e) => {
    let rem = boxById(builder.boxId).size - used();
    while (rem > 0) {
      const r = randomCombo();
      const k = Math.min(rem, 1 + Math.floor(Math.random() * Math.max(1, Math.ceil(rem / 4))));
      addContent(r.fudge, r.crust, k);
      rem -= k;
    }
    saveBuilder();
    renderBox();
    splash(e.clientX, e.clientY, 14);
  });
  root.querySelector('#clearBox').addEventListener('click', () => { builder.contents = []; saveBuilder(); renderBox(); });
  root.querySelector('#boxToCart').addEventListener('click', (e) => {
    const box = boxById(builder.boxId);
    if (used() < box.size) return;
    cart.add({ kind: 'custom', boxId: box.id, contents: builder.contents.map((c) => ({ ...c })) });
    builder.contents = [];
    saveBuilder();
    renderBox();
    toast(`${ICON.bag} ${t('cart.added')} · <a href="#/carrinho">${t('nav.cart')} →</a>`);
    bumpCart();
    splash(e.clientX, e.clientY, 16, undefined, 1.3);
  });

  updateCombo(false);
  renderBox();
  hydrate(root);
  if (g) {
    g.from(root.querySelectorAll('.page-head > *'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' });
    g.from(root.querySelectorAll('.b-col'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, delay: 0.2, ease: 'power3.out' });
  }
  return () => { document.removeEventListener('click', docClick); stage && stage.dispose(); };
}
