// Carrinho e conta — guardados no navegador (v1 simulada, sem servidor).
import { boxById, DELIVERY_FEE, FREE_SHIPPING, GST } from './data.js';

const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage indisponível */ } };
export const bus = new EventTarget();
const emit = (type) => bus.dispatchEvent(new Event(type));
const uid = () => Math.random().toString(36).slice(2, 9);

export const cart = {
  items: load('ps_cart', []),
  persist() { save('ps_cart', this.items); emit('cart'); },
  add(item) { this.items.push({ uid: uid(), qty: 1, ...item }); this.persist(); },
  remove(id) { this.items = this.items.filter((i) => i.uid !== id); this.persist(); },
  setQty(id, q) { const it = this.items.find((i) => i.uid === id); if (it) { it.qty = Math.max(1, Math.min(20, q)); this.persist(); } },
  clear() { this.items = []; this.persist(); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  linePrice(i) { return boxById(i.boxId).price * i.qty; },
  subtotal() { return this.items.reduce((s, i) => s + this.linePrice(i), 0); },
  // mesma regra no carrinho e no checkout: entrega CA$15, grátis a partir de CA$300; retirada grátis
  shipping(method = 'delivery') { return method === 'delivery' && this.subtotal() < FREE_SHIPPING ? DELIVERY_FEE : 0; },
  toFree() { return Math.max(0, FREE_SHIPPING - this.subtotal()); },
  totals(method = 'delivery') {
    const sub = this.subtotal();
    const ship = this.shipping(method);
    const gst = Math.round((sub + ship) * GST * 100) / 100;
    return { sub, ship, gst, total: Math.round((sub + ship + gst) * 100) / 100 };
  },
};

export const account = {
  data: load('ps_account', { user: null, orders: [], favorites: [] }),
  persist() { save('ps_account', this.data); emit('account'); },
  login(name, email) { this.data.user = { name, email, phone: '' }; this.persist(); },
  update(u) { this.data.user = { ...this.data.user, ...u }; this.persist(); },
  logout() { this.data.user = null; this.persist(); },
  addOrder(o) { this.data.orders.unshift(o); this.persist(); },
  order(id) { return this.data.orders.find((o) => o.id === id); },
  isFav(f, c) { return this.data.favorites.some((x) => x.fudge === f && x.crust === c); },
  toggleFav(f, c) {
    if (this.isFav(f, c)) this.data.favorites = this.data.favorites.filter((x) => !(x.fudge === f && x.crust === c));
    else this.data.favorites.unshift({ fudge: f, crust: c });
    this.persist();
    return this.isFav(f, c);
  },
};

// Estado do montador sobrevive à troca de página/idioma
export const builder = load('ps_builder', { fudge: 'chocolate', crust: 'granulado', cup: 'framboesa', boxId: 'b9', contents: [], qty: 1 });
export const saveBuilder = () => save('ps_builder', builder);
