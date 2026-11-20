import { t, L, money } from '../i18n.js';
import { FUDGES, CRUSTS, PRODUCTS, BOXES, TESTIMONIALS, DELIVERY_FEE, FREE_SHIPPING, fudgeById, crustById, randomCombo } from '../data.js';
import { ICON, GL, esc, thumbHTML, productCard, giftbox, blobSVG, crustSwatch, hydrate } from '../ui.js';
import { Stage, setBurst } from '../three/brigadeiro.js';

const TEASER_BOX = [['chocolate', 'granulado'], ['morango', 'acucar-rosa'], ['pistache', 'pistache'], ['coco', 'coco-tostado'], ['branquinho', 'colorido'], ['choc-pimenta', 'lascas'], ['maracuja', 'coco-ralado'], ['morango', 'perolas'], ['erva-mate', 'canela']];

export function render() {
  const featured = PRODUCTS.slice(0, 4); // caixas da casa (dentro de "Caixas prontas")
  const marquee = [...FUDGES.map((f) => [L(f.name), f.color]), ...CRUSTS.filter((c) => c.kind !== 'none').map((c) => [L(c.name), c.swatch[0]])];
  const mq = marquee.map(([n, c]) => `<span><i style="background:${c}"></i>${esc(n)}</span>`).join('');
  return `
  <section class="hero">
    <div class="hero-stage">${GL ? '<canvas class="stage" aria-label="Brigadeiro 3D"></canvas>' : `<div class="hero-fallback">${thumbHTML('chocolate', 'granulado', 'xl')}</div>`}</div>
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${t('hero.eyebrow')}</p>
        <h1 class="display"><span class="line">${t('hero.t1')}</span><span class="line"><em>${t('hero.t2')}</em></span></h1>
        <p class="lead">${t('hero.sub')}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#/montador">${t('hero.cta')} ${ICON.arrow}</a>
          <button class="btn btn-ghost" data-goto="caixas">${t('hero.cta2')}</button>
        </div>
        <p class="stats">${t('hero.stats')}</p>
      </div>
      <div class="hero-tags" aria-live="polite">
        <div class="tag-float tf1"><i class="sw" id="hfSw"></i><span><small>${t('hero.fudge')}</small><b id="hfName"></b></span></div>
        <div class="tag-float tf2"><i class="sw crust" id="hcSw"></i><span><small>${t('hero.crust')}</small><b id="hcName"></b></span></div>
        <p class="hint">${t('hint.drag')}</p>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true"><div class="marquee-track">${mq}${mq}</div></div>

  <section class="section featured">
    <div class="wrap">
      <div class="sec-head row" data-reveal><div><p class="eyebrow">${t('feat.eyebrow')}</p><h2>${t('feat.title')}</h2></div>
        <a class="link-arrow" href="#/loja">${t('feat.all')} ${ICON.arrow}</a></div>
      <div class="pgrid carousel" id="featCar">${featured.map(productCard).join('')}</div>
      <div class="car-dots" id="featDots" aria-hidden="true">${featured.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    </div>
  </section>

  <section class="section what" id="sobre">
    <div class="wrap">
      <div class="sec-head" data-reveal><p class="eyebrow">${t('what.eyebrow')}</p><h2>${t('what.title')}</h2><p class="lead">${t('what.lead')}</p></div>
      <div class="steps">
        ${[1, 2, 3].map((i) => `<article class="step" data-reveal>
          ${blobSVG(['#fde0e6', '#fbe7cf', '#e7f0cf'][i - 1], i * 11, 'step-blob')}
          <span class="step-n">${i}</span>
          <h3>${t('what.s' + i)}</h3><p>${t('what.s' + i + 't')}</p></article>`).join('')}
      </div>
      <div class="diff" data-reveal>
        <div class="diff-copy"><p class="eyebrow">${t('what.diffEy')}</p><h3>${t('what.diffT')}</h3><p>${t('what.diffX')}</p></div>
        <div class="diff-math"><span><b>4–5</b><small>${t('what.diffTrad')}</small></span><i>→</i><span class="big"><b>160</b><small>${t('what.diffOurs')}</small></span></div>
      </div>
    </div>
  </section>

  <section class="section teaser">
    <div class="wrap teaser-grid">
      <div class="teaser-copy" data-reveal>
        <p class="eyebrow">${t('teaser.eyebrow')}</p>
        <h2 class="display-2">${t('teaser.title')}</h2>
        <p class="lead">${t('teaser.text')}</p>
        <a class="btn btn-primary" href="#/montador">${ICON.dice} ${t('teaser.cta')}</a>
      </div>
      <div class="teaser-box" data-reveal>
        ${blobSVG('#fde3e8', 3, 'teaser-blob')}
        ${giftbox('b9', TEASER_BOX.map(([fudge, crust]) => ({ fudge, crust, qty: 1 })))}
        <img class="teaser-seal" src="assets/logo-icone.webp" alt="">
      </div>
    </div>
  </section>

  <section class="section boxes" id="caixas">
    <div class="wrap">
      <div class="sec-head" data-reveal><p class="eyebrow">${t('boxes.eyebrow')}</p><h2>${t('boxes.title')}</h2><p class="lead">${t('boxes.gift')}</p></div>
      <div class="box-cards">
        ${BOXES.map((b, i) => `<article class="box-card" data-reveal style="--accent:${['#9cc9e6', '#b5cf3a', '#f39a4a', '#ec6f9c'][i]}">
          <div class="box-mini lid-${i % 2 ? 'framboesa' : 'marinho'}"><span>${b.size}</span></div>
          <p class="box-use">${t('box.' + b.id)}</p>
          <h3>${b.size} <small>${t('boxes.units')}</small></h3>
          <p class="box-price">${money(b.price)}</p>
          <p class="box-each">${money(b.price / b.size)} ${t('boxes.each')}</p>
          <a class="btn btn-small" href="#/montador?box=${b.id}">${t('boxes.cta')}</a>
        </article>`).join('')}
      </div>
      <div class="deliv" data-reveal>
        <div>${ICON.truck}<span><b>${t('deliv.delivery')}</b> · ${t('deliv.deliveryText', { fee: money(DELIVERY_FEE), free: money(FREE_SHIPPING) })}</span></div>
        <div>${ICON.pin}<span><b>${t('deliv.pickup')}</b> · ${t('deliv.pickupText')}</span></div>
        <div>${ICON.clock}<span>${t('deliv.ahead')}</span></div>
      </div>
    </div>
  </section>

  <section class="section story" id="historia">
    <div class="story-band">
      <div class="wrap story-grid">
        <div class="story-seal" data-reveal><div class="story-logo"><img src="assets/logo-marca.webp" alt="Porto Sweets"></div></div>
        <div class="story-copy" data-reveal>
          <p class="eyebrow">${t('story.eyebrow')}</p>
          <h2>${t('story.title')}</h2>
          <p>${t('story.p1')}</p>
          <p>${t('story.p2')}</p>
          <p class="story-quote">${t('story.p3')}</p>
          <p class="story-sign">— ${t('story.sign')}</p>
        </div>
      </div>
    </div>
    <svg class="drip" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 H1440 V38 C1400,38 1392,70 1372,96 C1360,112 1340,108 1338,90 C1335,62 1318,44 1270,42 C1210,40 1190,46 1170,62 C1155,74 1150,104 1128,104 C1108,104 1108,74 1092,56 C1070,36 1010,42 940,44 C880,46 868,52 860,70 C852,88 846,118 822,118 C800,118 800,86 790,66 C778,44 740,40 660,42 C600,44 584,48 572,62 C562,74 560,92 544,92 C528,92 528,74 516,60 C500,44 460,40 400,40 C330,40 300,46 290,66 C282,82 280,112 256,112 C232,112 234,80 224,62 C212,40 170,38 120,40 C70,42 56,48 48,64 C40,80 36,98 22,98 C8,98 8,70 0,60 Z"/></svg>
  </section>

  <section class="section testi">
    <div class="wrap">
      <div class="sec-head" data-reveal><p class="eyebrow">${t('testi.eyebrow')}</p><h2>${t('testi.title')}</h2></div>
      <div class="tgrid">
        ${TESTIMONIALS.map((x, i) => `<figure class="tcard" data-reveal style="--tc:${['#fde3e8', '#e9f2d2', '#fdebd7'][i]}">
          <div class="stars">${ICON.star.repeat(x.stars)}</div>
          <blockquote>“${esc(L(x.text))}”</blockquote>
          <figcaption><b>${esc(x.name)}</b> · ${esc(x.city)} <span class="sample">${t('testi.sample')}</span></figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </section>

  <section class="section final">
    <div class="wrap final-inner" data-reveal>
      <div class="final-trio">${thumbHTML('morango', 'perolas', 'f1')}${thumbHTML('chocolate', 'lascas', 'f2')}${thumbHTML('pistache', 'pistache', 'f3')}</div>
      <h2 class="display-2">${t('final.title')}</h2>
      <a class="btn btn-primary btn-big" href="#/montador">${t('final.cta')} ${ICON.arrow}</a>
    </div>
  </section>`;
}

export function mount(root) {
  const cleanups = [];
  hydrate(root);
  // carrossel das caixas da casa (celular): bolinhas acompanham o swipe
  const car = root.querySelector('#featCar'), dots = root.querySelectorAll('#featDots i');
  if (car && dots.length) {
    const onScroll = () => {
      const cards = [...car.children];
      const mid = car.scrollLeft + car.clientWidth / 2;
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      dots.forEach((d, i) => d.classList.toggle('on', i === best));
    };
    car.addEventListener('scroll', onScroll, { passive: true });
  }
  if (GL) {
    const canvas = root.querySelector('.hero .stage');
    const wide = () => window.innerWidth > 900;
    setBurst(wide() ? 1 : 0.55);
    const start = { fudge: 'chocolate', crust: 'granulado' };
    const stage = new Stage(canvas, { fudge: fudgeById(start.fudge), crust: crustById(start.crust), galaxy: 'mix', galaxySize: 0.7, galaxyCount: 70, galaxyOpt: wide() ? { rMin: 1.7, rMax: 2.8, zScale: 0.5, zShift: -1.3, leftScale: 0.45, yMin: -1.1, yMax: 1.2, still: true } : { rMin: 1.6, rMax: 2.6, zScale: 0.5, zShift: -1.3, still: true }, offsetX: wide() ? 0.22 : 0, camDist: wide() ? 8.8 : 7.6, quality: wide() ? 1 : 0.6, scrollSpin: true });
    const onR = () => { stage.offsetX = wide() ? 0.2 : 0; stage.resize(); };
    window.addEventListener('resize', onR);
    const nameF = root.querySelector('#hfName'), nameC = root.querySelector('#hcName');
    const swF = root.querySelector('#hfSw'), swC = root.querySelector('#hcSw');
    const label = (f, c) => {
      nameF.textContent = L(fudgeById(f).name); nameC.textContent = L(crustById(c).name);
      swF.style.background = fudgeById(f).color; swC.setAttribute('style', crustSwatch(c));
      if (window.gsap) window.gsap.fromTo(root.querySelectorAll('.tag-float'), { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(2)' });
    };
    label(start.fudge, start.crust);
    let cur = start;
    const iv = setInterval(() => {
      if (document.hidden) return;
      let n;
      do { n = randomCombo(); } while (n.crust === cur.crust);
      cur = n;
      stage.setCombo(fudgeById(n.fudge), crustById(n.crust));
      label(n.fudge, n.crust);
    }, 6000); // troca de sabor a cada 6 s (0,7x a frequência anterior de 4,2 s)
    cleanups.push(() => { setBurst(1); clearInterval(iv); window.removeEventListener('resize', onR); stage.dispose(); });
  }
  const g = window.gsap;
  if (g) {
    g.from(root.querySelectorAll('.hero .line'), { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.15 });
    g.from(root.querySelectorAll('.hero .eyebrow, .hero .lead, .hero .cta-row, .hero .stats'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, delay: 0.45, ease: 'power3.out' });
    if (window.ScrollTrigger) {
      g.to(root.querySelector('.teaser-seal'), { rotate: 30, scrollTrigger: { trigger: '.teaser', scrub: true } });
    }
  }
  return () => cleanups.forEach((f) => f());
}
