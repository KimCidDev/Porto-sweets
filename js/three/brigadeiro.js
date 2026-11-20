// Porto Sweets — motor 3D do brigadeiro (Three.js)
// v1: tudo procedural (fudge, crostas, forminha). Na v2 as geometrias de cada
// ingrediente podem ser trocadas por GLBs do Blender em GEOS (mesma API).
import * as THREE from 'three';
import { RoomEnvironment } from '../../vendor/RoomEnvironment.js';

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const SQUASH = 0.96;      // achatamento vertical (brigadeiro "assentado")
const FLAT = -9;          // (sem forminha: bolinha inteira, sem base achatada)
const CRUST_YMIN = -1;    // crosta cobre a bolinha inteira (flutuando, sem forminha)
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ---------------------------------------------------------------- noise
function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  const r = l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v), w);
  return r * 2 - 1;
}

// ---------------------------------------------------------------- shape
function shapeRadius(x, y, z) {
  return 1 + 0.03 * vnoise(x * 1.6 + 3, y * 1.6, z * 1.6) + 0.012 * vnoise(x * 4 + 11, y * 4, z * 4);
}
function shapePoint(nx, ny, nz, out) {
  const r = shapeRadius(nx, ny, nz);
  let y = ny * r * SQUASH;
  if (y < FLAT) y = FLAT + (y - FLAT) * 0.3;
  return out.set(nx * r, y, nz * r);
}
function silhouette(y) {
  if (y < FLAT) return 0.64;
  return Math.sqrt(Math.max(0, 1 - (y / SQUASH) ** 2));
}

// ---------------------------------------------------------------- shared geometry
const GEO = {};
function bendX(geo, curl, twist = 0) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = x * twist;
    p.setY(i, y + curl * x * x + Math.sin(a) * z * 0.5);
  }
  geo.computeVertexNormals();
  return geo;
}
function chunkGeo(radius, seed, flat = 0.75) {
  const g = new THREE.IcosahedronGeometry(radius, 1);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 0.72 + 0.55 * hash3(Math.round(v.x * 1000) + seed, Math.round(v.y * 1000), Math.round(v.z * 1000));
    v.multiplyScalar(k);
    v.y *= flat;
    v.x *= 1.15;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  // mistura normal facetada com normal suave: corte de faca, mas sem cara de low-poly
  const nn = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    const fx = nn.getX(i), fy = nn.getY(i), fz = nn.getZ(i);
    const x = fx * 0.45 + v.x * 0.55, y = fy * 0.45 + v.y * 0.55, z = fz * 0.45 + v.z * 0.55;
    const l = Math.hypot(x, y, z) || 1;
    nn.setXYZ(i, x / l, y / l, z / l);
  }
  return g;
}
function almondGeo() {
  const s = new THREE.Shape();
  const L = 0.07, W = 0.036;
  s.moveTo(-L, 0);
  s.bezierCurveTo(-L * 0.6, W * 1.25, L * 0.35, W * 1.15, L, 0);
  s.bezierCurveTo(L * 0.35, -W * 1.15, -L * 0.6, -W * 1.25, -L, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1, curveSegments: 10 });
  g.rotateX(-Math.PI / 2);
  g.center();
  // cor por vértice: bordas tostadas, centro claro
  const p = g.attributes.position;
  const col = new Float32Array(p.count * 3);
  const a = new THREE.Color('#f6ead2'), b = new THREE.Color('#b98a52'), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const ex = Math.hypot(p.getX(i) / L, p.getZ(i) / W);
    c.copy(a).lerp(b, clamp01((ex - 0.55) / 0.5));
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}
function getGeo(name) {
  if (GEO[name]) return GEO[name];
  let g;
  switch (name) {
    case 'sprinkle': g = new THREE.CapsuleGeometry(0.02, 0.07, 2, 6); g.rotateZ(Math.PI / 2); break;
    case 'nonpareil': g = new THREE.SphereGeometry(0.03, 8, 6); break;
    case 'pearl': g = new THREE.SphereGeometry(0.078, 16, 12); break;
    case 'chunkA': g = chunkGeo(0.07, 17); break;
    case 'chunkB': g = chunkGeo(0.065, 91, 0.6); break;
    case 'chunkC': g = chunkGeo(0.06, 333, 0.9); break;
    case 'crumb': g = chunkGeo(0.028, 7, 0.8); break;
    case 'grain': g = new THREE.BoxGeometry(0.02, 0.012, 0.016); break;
    case 'crystal': g = new THREE.BoxGeometry(0.036, 0.036, 0.036); break;
    case 'zest': g = bendX(new THREE.BoxGeometry(0.08, 0.008, 0.013, 6, 1, 1), 2.5, 8); break;
    case 'stripA': g = bendX(new THREE.BoxGeometry(0.14, 0.008, 0.02, 10, 1, 1), 3.2, 6); break;
    case 'stripB': g = bendX(new THREE.BoxGeometry(0.11, 0.008, 0.018, 10, 1, 1), -2.4, -9); break;
    case 'shavingA': g = bendX(new THREE.BoxGeometry(0.12, 0.009, 0.075, 8, 1, 3), 3.5); break;
    case 'shavingB': g = bendX(new THREE.BoxGeometry(0.09, 0.009, 0.06, 8, 1, 3), -2.2, 4); break;
    case 'almond': g = almondGeo(); break;
    default: throw new Error('geo ' + name);
  }
  GEO[name] = g;
  return g;
}

let FUDGE_GEO = null;
function getFudgeGeo() {
  if (FUDGE_GEO) return FUDGE_GEO;
  const g = new THREE.SphereGeometry(1, 160, 120);
  const p = g.attributes.position;
  const v = new THREE.Vector3(), o = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    shapePoint(v.x, v.y, v.z, o);
    p.setXYZ(i, o.x, o.y, o.z);
  }
  g.computeVertexNormals();
  FUDGE_GEO = g;
  return g;
}

let SHELL_GEO = null;
function getShellGeo() {
  if (SHELL_GEO) return SHELL_GEO;
  const g = new THREE.SphereGeometry(1, 128, 96);
  const p = g.attributes.position;
  const v = new THREE.Vector3(), o = new THREE.Vector3();
  const col = new Float32Array(p.count * 3);
  const amber = new THREE.Color('#c97520'), deep = new THREE.Color('#7a3309'), burnt = new THREE.Color('#3f1806'), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    shapePoint(v.x, v.y, v.z, o);
    const bump = 1.035 + 0.012 * vnoise(v.x * 9, v.y * 9, v.z * 9) + 0.006 * vnoise(v.x * 23 + 4, v.y * 23, v.z * 23);
    o.multiplyScalar(bump);
    p.setXYZ(i, o.x, o.y, o.z);
    const n = vnoise(v.x * 3.2 + 8, v.y * 3.2, v.z * 3.2) * 0.5 + 0.5;
    const torch = clamp01((v.y - 0.1) * 1.4) * 0.6 + n * 0.5;
    c.copy(amber).lerp(deep, clamp01(torch));
    if (n > 0.72 && v.y > 0.2) c.lerp(burnt, (n - 0.72) * 2.2);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  SHELL_GEO = g;
  return g;
}

let CUP_GEO = null;
function getCupGeo() {
  if (CUP_GEO) return CUP_GEO;
  const pts = [new THREE.Vector2(0.001, -0.805)];
  for (let i = 1; i <= 4; i++) pts.push(new THREE.Vector2(0.64 * i / 4, -0.805));
  const yTop = -0.3;
  for (let i = 0; i <= 26; i++) {
    const y = -0.8 + (yTop + 0.8) * (i / 26);
    pts.push(new THREE.Vector2(silhouette(y) + 0.05, y));
  }
  pts.push(new THREE.Vector2(silhouette(yTop) + 0.085, yTop + 0.035));
  pts.push(new THREE.Vector2(silhouette(yTop) + 0.11, yTop + 0.05));
  const g = new THREE.LatheGeometry(pts, 168);
  const p = g.attributes.position;
  const N = 30; // pregas da forminha
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 0.66 && y < -0.79) continue;
    const th = Math.atan2(z, x);
    const f = ((th / TAU) * N) % 1;
    const tri = Math.abs((f < 0 ? f + 1 : f) * 2 - 1) * 2 - 1;
    const h = clamp01((y + 0.8) / 0.5);
    const r2 = r + 0.028 * (0.35 + h) * tri;
    const k = r2 / r;
    p.setXYZ(i, x * k, y + (y > yTop ? 0.01 * tri : 0), z * k);
  }
  g.computeVertexNormals();
  CUP_GEO = g;
  return g;
}

let BUMP_TEX = null;
function getBumpTex() {
  if (BUMP_TEX) return BUMP_TEX;
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#808080';
  x.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 26000; i++) {
    const v = Math.floor(rand(90, 170));
    x.fillStyle = `rgba(${v},${v},${v},${rand(0.25, 0.7)})`;
    x.beginPath();
    x.arc(Math.random() * c.width, Math.random() * c.height, rand(0.6, 2.4), 0, TAU);
    x.fill();
  }
  // marcas de mão (rolagem)
  for (let i = 0; i < 60; i++) {
    x.strokeStyle = `rgba(${Math.random() > 0.5 ? 200 : 60},0,0,0.08)`;
    x.lineWidth = rand(6, 18);
    x.beginPath();
    const sx = Math.random() * c.width, sy = Math.random() * c.height;
    x.moveTo(sx, sy);
    x.quadraticCurveTo(sx + rand(-80, 80), sy + rand(-30, 30), sx + rand(-160, 160), sy + rand(-20, 20));
    x.stroke();
  }
  BUMP_TEX = new THREE.CanvasTexture(c);
  BUMP_TEX.wrapS = BUMP_TEX.wrapT = THREE.RepeatWrapping;
  return BUMP_TEX;
}

// ---------------------------------------------------------------- materials (shared)
const MAT = {};
function getMat(name) {
  if (MAT[name]) return MAT[name];
  let m;
  switch (name) {
    case 'choc': m = new THREE.MeshPhysicalMaterial({ roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 }); break;
    case 'gloss': m = new THREE.MeshPhysicalMaterial({ roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.3 }); break;
    case 'pearl': m = new THREE.MeshPhysicalMaterial({ roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.6, sheenColor: new THREE.Color('#ffd7cf'), sheenRoughness: 0.4 }); break;
    case 'nut': m = new THREE.MeshStandardMaterial({ roughness: 0.78 }); break;
    case 'dust': m = new THREE.MeshStandardMaterial({ roughness: 0.95 }); break;
    case 'crystal': m = new THREE.MeshPhysicalMaterial({ roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, ior: 1.55, transparent: true, opacity: 0.88 }); break;
    case 'zest': m = new THREE.MeshStandardMaterial({ roughness: 0.5 }); break;
    case 'coconut': m = new THREE.MeshStandardMaterial({ roughness: 0.85 }); break;
    case 'almond': m = new THREE.MeshStandardMaterial({ roughness: 0.7, vertexColors: true }); break;
    case 'shell': m = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.96 }); break;
    default: throw new Error('mat ' + name);
  }
  MAT[name] = m;
  return m;
}

// ---------------------------------------------------------------- crust recipes
// orient: lie (deitado na superfície), chunk (pedaço com giro), any (aleatório)
const RECIPES = {
  none: [],
  sprinkles: [{ geo: ['sprinkle'], mat: 'choc', count: 4200, colors: ['#2a140c', '#3b1d10', '#4a2615', '#31170d'], off: 0.016, s: [0.85, 1.2], orient: 'lie', tilt: [-0.15, 0.4] }],
  nonpareils: [{ geo: ['nonpareil'], mat: 'gloss', count: 3600, colors: ['#e8283d', '#f7b80f', '#1f8fe0', '#3fb83a', '#ef4f9c', '#ffffff', '#f57a14', '#7a4fe0'], off: 0.024, s: [0.85, 1.1], orient: 'any', jitter: 0.02 }],
  chunks: [{ geo: ['chunkA', 'chunkB', 'chunkC'], mat: 'nut', count: 1100, colors: ['#ecc893', '#dcae70', '#f2dcb2', '#c99355'], off: 0.03, s: [0.8, 1.4], orient: 'chunk', tilt: [-0.7, 0.7] }],
  'chunks-small': [{ geo: ['chunkA', 'chunkB', 'chunkC'], mat: 'nut', count: 1900, colors: ['#f3dcac', '#e2bd85', '#cf9d62', '#f7e7c4', '#a8723f'], off: 0.022, s: [0.55, 1.0], orient: 'chunk', tilt: [-0.8, 0.8] }],
  pistachio: [{ geo: ['chunkA', 'chunkB', 'chunkC'], mat: 'nut', count: 2300, colors: ['#8fae4a', '#a9bf5a', '#c3cc6c', '#6f8f3a', '#9bb24e', '#d4d48a', '#7a4d47'], off: 0.02, s: [0.5, 0.95], orient: 'chunk', tilt: [-0.9, 0.9] }],
  dust: [{ geo: ['grain'], mat: 'dust', count: 5200, colors: ['#8a5a35', '#6e4527', '#a8794d', '#5e3a20'], off: 0.004, s: [0.6, 1.2], orient: 'any', jitter: 0 },
    { geo: ['crystal'], mat: 'crystal', count: 500, colors: ['#f4e8d6', '#ffffff'], off: 0.01, s: [0.4, 0.7], orient: 'any' }],
  sugar: [{ geo: ['crystal'], mat: 'crystal', count: 5200, colors: ['#c58f52', '#e8c9a0', '#f6ead6', '#ffffff', '#b98450'], off: 0.012, s: [0.6, 1.1], orient: 'any', jitter: 0.01 }],
  zest: [{ geo: ['crystal'], mat: 'crystal', count: 4800, colors: ['#ffffff', '#f6f1e2', '#efe6cc'], off: 0.012, s: [0.6, 1.1], orient: 'any', jitter: 0.01 },
    { geo: ['zest'], mat: 'zest', count: 260, colors: ['#f2cf2d', '#e9c021', '#f7dd5a', '#9ac43a'], off: 0.022, s: [0.8, 1.2], orient: 'lie', tilt: [-0.1, 0.5] }],
  coconut: [{ geo: ['stripA', 'stripB'], mat: 'coconut', count: 2600, colors: ['#ffffff', '#fbf8f1', '#f3eee2', '#ece5d4'], off: 0.012, s: [0.8, 1.25], orient: 'lie', tilt: [-0.2, 0.85] }],
  'coconut-toasted': [{ geo: ['stripA', 'stripB'], mat: 'coconut', count: 2200, colors: ['#f2dfba', '#e3bb7c', '#cf9655', '#b0702f', '#8a5426', '#f7ecd4'], off: 0.012, s: [0.8, 1.25], orient: 'lie', tilt: [-0.2, 0.9] },
    { geo: ['crumb'], mat: 'nut', count: 900, colors: ['#9a5e2a', '#7a451c', '#b77a3d'], off: 0.01, s: [0.6, 1.1], orient: 'any' }],
  shavings: [{ geo: ['shavingA', 'shavingB'], mat: 'choc', count: 1700, colors: ['#3b1d12', '#4d2817', '#5c321d', '#2f170e', '#6a3b22'], off: 0.02, s: [0.75, 1.25], orient: 'lie', tilt: [-0.35, 1.0] }],
  almond: [{ geo: ['almond'], mat: 'almond', count: 760, colors: ['#ffffff', '#f6efe2', '#efe2c8'], off: 0.018, s: [0.85, 1.2], orient: 'lie', tilt: [-0.25, 0.55] }],
  pearls: [{ geo: ['pearl'], mat: 'pearl', count: 460, dist: 'fib', colors: ['#e2554f', '#d9443f', '#eb6a5c', '#f07a68', '#d64a45'], off: 0.052, s: [0.93, 1.05], orient: 'any' }],
  'sugar-pink': [{ geo: ['crystal'], mat: 'crystal', count: 5400, colors: ['#f06d93', '#f7b2c4', '#fde4ea', '#ffffff', '#ee7896'], off: 0.012, s: [0.6, 1.1], orient: 'any', jitter: 0.01 }],
  brulee: [{ shell: true },
    { geo: ['crystal'], mat: 'crystal', count: 380, colors: ['#e6a44f', '#c97e2c', '#f5c879'], off: 0.045, s: [0.5, 0.9], orient: 'any' }],
};

function sampleDirs(n, dist) {
  const out = [];
  const ymin = CRUST_YMIN;
  if (dist === 'fib') {
    const total = Math.round(n / ((1 - ymin) / 2));
    for (let i = 0; i < total; i++) {
      const y = 1 - 2 * (i + 0.5) / total;
      if (y < ymin) continue;
      const r = Math.sqrt(1 - y * y);
      const th = i * GOLDEN + rand(-0.03, 0.03);
      out.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
  } else {
    for (let i = 0; i < n; i++) {
      const y = ymin + (1 - ymin) * Math.random();
      const r = Math.sqrt(1 - y * y);
      const th = Math.random() * TAU;
      out.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
  }
  return out;
}

// ---------------------------------------------------------------- instanced layer w/ fly-in
const _p = new THREE.Vector3(), _n = new THREE.Vector3(), _t = new THREE.Vector3(), _b = new THREE.Vector3();
const _q = new THREE.Quaternion(), _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
const _s = new THREE.Vector3(), _m = new THREE.Matrix4(), _e = new THREE.Euler(), _c = new THREE.Color();
const _r = new THREE.Vector3(1, 0, 0);

class InstLayer {
  constructor(geo, mat, items, colors, scaleMul = 1) {
    const n = items.length;
    this.n = n;
    this.mesh = new THREE.InstancedMesh(geo, mat, n);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.tp = new Float32Array(n * 3); this.tq = new Float32Array(n * 4); this.ts = new Float32Array(n * 3);
    this.sp = new Float32Array(n * 3); this.sq = new Float32Array(n * 4);
    this.delay = new Float32Array(n); this.swirl = new Float32Array(n);
    items.forEach((it, i) => {
      it.p.toArray(this.tp, i * 3); it.q.toArray(this.tq, i * 4); it.s.toArray(this.ts, i * 3);
      // ponto de partida: lá fora, na "galáxia"
      const d = it.p.clone().normalize();
      const R = rand(2.6, 5.2);
      _p.set(d.x * R, d.y * R + rand(-0.8, 1.6), d.z * R);
      _p.toArray(this.sp, i * 3);
      _q.setFromEuler(_e.set(rand(0, TAU), rand(0, TAU), rand(0, TAU))).toArray(this.sq, i * 4);
      this.delay[i] = Math.random() * 0.45;
      this.swirl[i] = rand(1.2, 3.4) * (Math.random() > 0.5 ? 1 : -1);
      _c.set(pick(colors));
      _c.offsetHSL(rand(-0.01, 0.01), rand(-0.04, 0.04), rand(-0.04, 0.04));
      this.mesh.setColorAt(i, _c);
    });
    this.scaleMul = scaleMul;
    this.setProgress(1);
  }
  setProgress(p) {
    const { n, tp, tq, ts, sp, sq, delay, swirl } = this;
    const span = 0.55;
    for (let i = 0; i < n; i++) {
      const l = clamp01((p - delay[i]) / span);
      if (l <= 0) {
        _m.makeScale(0, 0, 0);
      } else if (l >= 1) {
        _p.fromArray(tp, i * 3); _q.fromArray(tq, i * 4); _s.fromArray(ts, i * 3);
        _m.compose(_p, _q, _s);
      } else {
        const e = easeOutCubic(l);
        const x = sp[i * 3] + (tp[i * 3] - sp[i * 3]) * e;
        const y = sp[i * 3 + 1] + (tp[i * 3 + 1] - sp[i * 3 + 1]) * e + Math.sin(e * Math.PI) * 0.35;
        const z = sp[i * 3 + 2] + (tp[i * 3 + 2] - sp[i * 3 + 2]) * e;
        const a = (1 - e) * swirl[i];
        const ca = Math.cos(a), sa = Math.sin(a);
        _p.set(x * ca - z * sa, y, x * sa + z * ca);
        _qa.fromArray(sq, i * 4); _qb.fromArray(tq, i * 4);
        _q.slerpQuaternions(_qa, _qb, e);
        _s.fromArray(ts, i * 3).multiplyScalar(0.35 + 0.65 * e);
        _m.compose(_p, _q, _s);
      }
      this.mesh.setMatrixAt(i, _m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  dispose() { this.mesh.dispose(); }
}

function buildItems(spec, count) {
  const dirs = sampleDirs(count, spec.dist);
  const items = [];
  for (const d of dirs) {
    shapePoint(d[0], d[1], d[2], _p);
    _n.set(_p.x, _p.y / (SQUASH * SQUASH), _p.z).normalize();
    const sc = rand(spec.s[0], spec.s[1]);
    const pos = _p.clone().addScaledVector(_n, spec.off * sc);
    if (spec.jitter) pos.addScaledVector(_n, rand(-spec.jitter, spec.jitter) * 0.4);
    const q = new THREE.Quaternion();
    if (spec.orient === 'any') {
      q.setFromEuler(_e.set(rand(0, TAU), rand(0, TAU), rand(0, TAU)));
    } else {
      _r.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
      _t.crossVectors(_n, _r).normalize();
      _b.crossVectors(_t, _n).normalize();
      _m.makeBasis(_t, _n, _b);
      q.setFromRotationMatrix(_m);
      const tilt = spec.tilt ? rand(spec.tilt[0], spec.tilt[1]) : 0;
      const roll = spec.orient === 'chunk' ? rand(-0.6, 0.6) : rand(-0.15, 0.15);
      _qa.setFromEuler(_e.set(roll, spec.orient === 'chunk' ? rand(0, TAU) : 0, tilt));
      q.multiply(_qa);
    }
    const s = spec.orient === 'lie' ? new THREE.Vector3(sc, 1, 0.8 + sc * 0.2) : new THREE.Vector3(sc, sc, sc);
    items.push({ p: pos, q, s });
  }
  return items;
}

function buildCrust(crust, quality = 1) {
  const recipe = RECIPES[crust.kind] || RECIPES.sprinkles;
  const group = new THREE.Group();
  const layers = [];
  let shell = null;
  for (const spec of recipe) {
    if (spec.shell) {
      shell = new THREE.Mesh(getShellGeo(), getMat('shell'));
      shell.castShadow = true; shell.receiveShadow = true;
      group.add(shell);
      continue;
    }
    const total = Math.max(20, Math.round(spec.count * quality * 1.45));
    const geos = spec.geo;
    const items = buildItems(spec, total);
    // divide pelos variantes de geometria
    geos.forEach((gname, gi) => {
      const part = items.filter((_, i) => i % geos.length === gi);
      if (!part.length) return;
      const layer = new InstLayer(getGeo(gname), getMat(spec.mat), part, spec.colors);
      layers.push(layer);
      group.add(layer.mesh);
    });
  }
  return { group, layers, shell, setProgress(p) {
    layers.forEach((l) => l.setProgress(p));
    if (shell) {
      const e = easeOutCubic(clamp01(p * 1.4));
      shell.scale.setScalar(0.94 + 0.06 * e);
      shell.material.opacity = 0.96 * e;
      shell.visible = e > 0.01;
    }
  }, dispose() { layers.forEach((l) => l.dispose()); } };
}

// ---------------------------------------------------------------- Brigadeiro
export const CUP_COLORS = {
  framboesa: '#e23a55', dourado: '#d4a94e', marinho: '#232a55', branco: '#f5f1ea', chocolate: '#3a1f14',
};

export class Brigadeiro extends THREE.Group {
  constructor({ fudge, crust, cup = 'framboesa', quality = 1 }) {
    super();
    this.quality = quality;
    this.body = new THREE.Group();
    this.add(this.body);
    this.fudgeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(fudge.color), roughness: fudge.rough, clearcoat: fudge.coat, clearcoatRoughness: 0.4,
      sheen: 0.5, sheenRoughness: 0.55, sheenColor: new THREE.Color(fudge.color).offsetHSL(0, -0.05, 0.12),
      bumpMap: getBumpTex(), bumpScale: 1.6,
    });
    this.fudgeMesh = new THREE.Mesh(getFudgeGeo(), this.fudgeMat);
    this.fudgeMesh.castShadow = true; this.fudgeMesh.receiveShadow = true;
    this.body.add(this.fudgeMesh);
    // v1: sem forminha — o brigadeiro flutua (getCupGeo fica disponível para uso futuro)
    this.cupMat = null;
    this.crustId = null;
    this.crust = null;
    this.fudgeId = fudge.id;
    this.setCrust(crust, false);
  }
  setFudge(fudge, animate = true) {
    if (fudge.id === this.fudgeId) return;
    this.fudgeId = fudge.id;
    const c = new THREE.Color(fudge.color);
    const sc = c.clone().offsetHSL(0, -0.05, 0.12);
    const g = window.gsap;
    if (animate && g) {
      g.to(this.fudgeMat.color, { r: c.r, g: c.g, b: c.b, duration: 0.9, ease: 'power2.out' });
      g.to(this.fudgeMat.sheenColor, { r: sc.r, g: sc.g, b: sc.b, duration: 0.9 });
      g.to(this.fudgeMat, { roughness: fudge.rough, clearcoat: fudge.coat, duration: 0.9 });
      this.squish(0.6);
    } else {
      this.fudgeMat.color.copy(c); this.fudgeMat.sheenColor.copy(sc);
      this.fudgeMat.roughness = fudge.rough; this.fudgeMat.clearcoat = fudge.coat;
    }
  }
  setCrust(crust, animate = true) {
    if (crust.id === this.crustId) return;
    this.crustId = crust.id;
    const old = this.crust;
    const next = buildCrust(crust, this.quality);
    this.crust = next;
    this.body.add(next.group);
    const g = window.gsap;
    if (animate && g) {
      next.setProgress(0);
      const st = { p: 0 };
      g.to(st, { p: 1, duration: 1.6, ease: 'none', delay: 0.15, onUpdate: () => next.setProgress(st.p) });
      if (old) {
        const so = { p: 1 };
        g.to(so, { p: 0, duration: 0.9, ease: 'none', onUpdate: () => old.setProgress(so.p), onComplete: () => { this.body.remove(old.group); old.dispose(); } });
      }
    } else if (old) {
      this.body.remove(old.group); old.dispose();
    }
  }
  setCup() { /* sem forminha na v1 */ }
  squish(k = 1) {
    const g = window.gsap;
    if (!g) return;
    g.killTweensOf(this.body.scale);
    g.fromTo(this.body.scale, { x: 1 + 0.08 * k, y: 1 - 0.12 * k, z: 1 + 0.08 * k },
      { x: 1, y: 1, z: 1, duration: 1.1, ease: 'elastic.out(1.1, 0.35)' });
  }
  dispose() {
    if (this.crust) this.crust.dispose();
    this.fudgeMat.dispose();
  }
}

// ---------------------------------------------------------------- galaxy (pó estelar de ingredientes)
const GALAXY_SETS = {
  mix: [['shavingA', 'choc', ['#3b1d12', '#5c321d']], ['chunkA', 'nut', ['#ecc893', '#dcae70']], ['chunkB', 'nut', ['#8fae4a', '#a9bf5a']],
    ['sprinkle', 'choc', ['#2a140c', '#4a2615']], ['nonpareil', 'gloss', ['#e94b5a', '#f6c445', '#4fb0e8', '#f08ac0']], ['almond', 'almond', ['#ffffff']],
    ['stripA', 'coconut', ['#ffffff', '#f3eee2']], ['pearl', 'pearl', ['#e2554f']], ['crystal', 'crystal', ['#f7b2c4', '#ffffff']]],
};
function galaxyFor(crust) {
  const r = RECIPES[crust.kind] || [];
  const out = [];
  r.forEach((spec) => { if (!spec.shell) spec.geo.forEach((g) => out.push([g, spec.mat, spec.colors])); });
  if (crust.kind === 'brulee') out.push(['crumb', 'nut', ['#e6a44f', '#c97e2c']]);
  return out;
}

class Galaxy extends THREE.Group {
  constructor(set, count = 90, spread = 1, size = 1, opt = {}) {
    super();
    const { rMin = 1.6, rMax = 3.6, zScale = 0.8, zShift = -0.4, leftScale = 1, yMin = -0.9, yMax = 1.5 } = opt;
    this.opt = { zScale, zShift, leftScale };
    this.items = [];
    this.meshes = [];
    const per = Math.max(6, Math.round(count / set.length));
    set.forEach(([geo, mat, colors]) => {
      const mesh = new THREE.InstancedMesh(getGeo(geo), getMat(mat), per);
      mesh.frustumCulled = false;
      for (let i = 0; i < per; i++) {
        const big = /crystal|grain|nonpareil|crumb/.test(geo) ? rand(1.8, 2.8) : /pearl/.test(geo) ? rand(0.8, 1.3) : rand(1.1, 1.8);
        this.items.push({
          mesh, i, r: rand(rMin, rMax) * spread, a: rand(0, TAU), y: rand(yMin, yMax) * spread,
          sp: rand(0.05, 0.22) * (Math.random() > 0.2 ? 1 : -1), bob: rand(0, TAU), s: big * size,
          rot: new THREE.Euler(rand(0, TAU), rand(0, TAU), rand(0, TAU)), rs: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)),
        });
        _c.set(pick(colors)); mesh.setColorAt(i, _c);
      }
      this.meshes.push(mesh);
      this.add(mesh);
    });
    this.fade = 1;
  }
  update(t, dt) {
    for (const it of this.items) {
      it.a += it.sp * dt;
      it.rot.x += it.rs.x * dt * 0.6; it.rot.y += it.rs.y * dt * 0.6; it.rot.z += it.rs.z * dt * 0.6;
      const cx = Math.cos(it.a) * it.r;
      _p.set(cx < 0 ? cx * this.opt.leftScale : cx, it.y + Math.sin(t * 0.6 + it.bob) * 0.12, Math.sin(it.a) * it.r * this.opt.zScale + this.opt.zShift);
      _q.setFromEuler(it.rot);
      _s.setScalar(it.s * this.fade);
      _m.compose(_p, _q, _s);
      it.mesh.setMatrixAt(it.i, _m);
    }
    this.meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
  }
  dispose() { this.meshes.forEach((m) => m.dispose()); }
}

// ---------------------------------------------------------------- Stage (renderer + cena + interação)
function setupLights(scene) {
  scene.add(new THREE.HemisphereLight(0xfff6ec, 0xe9d8cc, 0.6));
  const key = new THREE.DirectionalLight(0xfff0de, 2.4);
  key.position.set(-2.6, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -2.5; sc.right = 2.5; sc.top = 2.5; sc.bottom = -2.5; sc.near = 0.5; sc.far = 12;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.012;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd4dc, 1.1);
  rim.position.set(3.2, 2.2, -3.4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xfff8f0, 0.45);
  fill.position.set(2.5, 0.4, 3);
  scene.add(fill);
}

let SOFT_TEX = null;
function softShadow(size = 2.6, opacity = 0.32) {
  if (!SOFT_TEX) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(58,31,20,1)');
    g.addColorStop(0.35, 'rgba(58,31,20,.55)');
    g.addColorStop(0.7, 'rgba(58,31,20,.12)');
    g.addColorStop(1, 'rgba(58,31,20,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    SOFT_TEX = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: SOFT_TEX, transparent: true, opacity, depthWrite: false, toneMapped: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

export class Stage {
  constructor(canvas, { fudge, crust, cup = 'framboesa', galaxy = 'mix', interactive = true, offsetX = 0, camDist = 5.4, quality = 1, scrollSpin = false, galaxySize = 1, galaxyCount = 110, galaxyOpt = {} } = {}) {
    this.galaxySize = galaxySize;
    this.galaxyOpt = galaxyOpt;
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(this.renderer);
    this.envTex = pm.fromScene(new RoomEnvironment(this.renderer), 0.04).texture;
    pm.dispose();
    this.scene.environment = this.envTex;
    setupLights(this.scene);
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    this.camDist = camDist;
    this.offsetX = offsetX;
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.pivot = new THREE.Group();
    this.root.add(this.pivot);
    this.brig = new Brigadeiro({ fudge, crust, cup, quality });
    this.pivot.add(this.brig);
    this.shadow = softShadow(2.4, 0.3);
    this.shadow.position.y = -1.6;
    this.root.add(this.shadow);
    this.galaxyMode = galaxy;
    this.galaxy = null;
    if (galaxy === 'mix') this.setGalaxy(GALAXY_SETS.mix, galaxyCount);
    else if (galaxy === 'crust') this.setGalaxy(galaxyFor(crust), 70);
    // interação
    this.rotY = 0.4; this.rotX = 0; this.velY = 0; this.targetX = 0;
    this.pointer = { x: 0, y: 0 };
    this.autoSpin = 0.25;
    this.scrollSpin = scrollSpin;
    this.clock = new THREE.Clock();
    this.running = true;
    this.visible = true;
    if (interactive) this._bindPointer();
    this._resize = this.resize.bind(this);
    this.ro = new ResizeObserver(this._resize);
    this.ro.observe(canvas.parentElement || canvas);
    this.io = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; });
    this.io.observe(canvas);
    this.resize();
    this._loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this._loop);
  }
  setGalaxy(set, count) {
    const old = this.galaxy;
    if (!set.length) {
      this.galaxy = null;
      if (old) { if (window.gsap) window.gsap.to(old, { fade: 0, duration: 0.6, onComplete: () => { this.root.remove(old); old.dispose(); } }); else { this.root.remove(old); old.dispose(); } }
      return;
    }
    const g = new Galaxy(set, count, 1, this.galaxySize, this.galaxyOpt);
    this.galaxy = g;
    this.root.add(g);
    if (window.gsap) {
      g.fade = 0;
      window.gsap.to(g, { fade: 1, duration: 1.2, delay: 0.4, ease: 'power2.out' });
      if (old) window.gsap.to(old, { fade: 0, duration: 0.6, onComplete: () => { this.root.remove(old); old.dispose(); } });
    } else if (old) { this.root.remove(old); old.dispose(); }
  }
  setCombo(fudge, crust, animate = true) {
    const crustChanged = crust.id !== this.brig.crustId;
    this.brig.setFudge(fudge, animate);
    this.brig.setCrust(crust, animate);
    if (crustChanged && this.galaxyMode === 'crust') this.setGalaxy(galaxyFor(crust), 70);
    if (animate) this.velY += 2.2;
  }
  setCup(name) { this.brig.setCup(name); }
  _bindPointer() {
    const el = this.canvas;
    let down = false, lx = 0, ly = 0, moved = 0;
    el.style.touchAction = 'pan-y';
    el.addEventListener('pointerdown', (e) => { down = true; moved = 0; lx = e.clientX; ly = e.clientY; el.setPointerCapture(e.pointerId); el.classList.add('grabbing'); });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!down) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      moved += Math.abs(dx) + Math.abs(dy);
      lx = e.clientX; ly = e.clientY;
      this.velY = dx * 0.35;
      this.rotX = Math.max(-0.5, Math.min(0.7, this.rotX + dy * 0.006));
    });
    const up = () => {
      if (down && moved < 6) this.brig.squish(1);
      down = false; el.classList.remove('grabbing');
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', () => { this.pointer.x = 0; this.pointer.y = 0; });
  }
  resize() {
    const p = this.canvas.parentElement || this.canvas;
    const w = Math.max(1, p.clientWidth), h = Math.max(1, p.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const aspect = w / h;
    const d = this.camDist * (aspect < 1 ? Math.min(1.6, 1 / aspect) : 1);
    this.camera.position.set(0, d * 0.2, d);
    this.camera.lookAt(0, -0.05, 0);
    this.camera.setViewOffset(w, h, -this.offsetX * w, 0, w, h);
    this.camera.updateProjectionMatrix();
  }
  loop() {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this._loop);
    if (!this.visible || document.hidden) { this.clock.getDelta(); return; }
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;
    this.velY *= Math.pow(0.04, dt);
    this.rotY += (this.autoSpin + this.velY) * dt;
    if (this.scrollSpin) this.rotY += (window.scrollY - (this._ls || 0)) * 0.004, this._ls = window.scrollY;
    this.pivot.rotation.y = this.rotY;
    const tx = this.rotX + this.pointer.y * 0.12;
    this.pivot.rotation.x += (tx - this.pivot.rotation.x) * 0.08;
    this.pivot.rotation.z += (-this.pointer.x * 0.06 - this.pivot.rotation.z) * 0.06;
    // flutuando no ar, suave
    this.brig.position.y = Math.sin(t * 0.9) * 0.09 + Math.sin(t * 0.37) * 0.03;
    this.brig.rotation.z = Math.sin(t * 0.6) * 0.05;
    this.brig.rotation.x = Math.cos(t * 0.5) * 0.04;
    const lift = this.brig.position.y;
    this.shadow.scale.setScalar(1 - lift * 1.2);
    this.shadow.material.opacity = 0.3 - lift * 0.6;
    if (this.galaxy) {
      if (!this.galaxyOpt.still) this.galaxy.rotation.y = this.pointer.x * 0.15;
      this.galaxy.update(t, dt);
    }
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect(); this.io.disconnect();
    this.brig.dispose();
    if (this.galaxy) this.galaxy.dispose();
    this.envTex.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
  }
}

// ---------------------------------------------------------------- thumbnails (mesmo motor, renderiza para imagem)
let TH = null;
const thumbCache = new Map();
const thumbQueue = [];
let thumbBusy = false;
function thumbRenderer() {
  if (TH) return TH;
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(360, 360, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pm.dispose();
  setupLights(scene);
  const sh = softShadow(2.3, 0.32);
  sh.position.y = -1.3;
  scene.add(sh);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 30);
  camera.position.set(0, 1.3, 5.6);
  camera.lookAt(0, -0.18, 0);
  TH = { renderer, scene, camera, canvas };
  return TH;
}
export function thumbnail(fudge, crust, cup = 'framboesa') {
  const key = `${fudge.id}|${crust.id}|${cup}`;
  if (thumbCache.has(key)) return Promise.resolve(thumbCache.get(key));
  return new Promise((resolve) => {
    thumbQueue.push({ key, fudge, crust, cup, resolve });
    pumpThumbs();
  });
}
function pumpThumbs() {
  if (thumbBusy || !thumbQueue.length) return;
  thumbBusy = true;
  setTimeout(() => {
    const job = thumbQueue.shift();
    if (thumbCache.has(job.key)) { job.resolve(thumbCache.get(job.key)); }
    else {
      try {
        const { renderer, scene, camera, canvas } = thumbRenderer();
        const b = new Brigadeiro({ fudge: job.fudge, crust: job.crust, cup: job.cup, quality: 0.65 });
        b.rotation.y = 0.6;
        scene.add(b);
        renderer.render(scene, camera);
        const url = canvas.toDataURL('image/png');
        scene.remove(b); b.dispose();
        thumbCache.set(job.key, url);
        job.resolve(url);
      } catch (e) { console.warn('thumb', e); job.resolve(''); }
    }
    thumbBusy = false;
    pumpThumbs();
  }, 16);
}
