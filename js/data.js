// Porto Sweets — "banco de dados" da v1 (estático).
// Para adicionar um sabor novo: acrescente um objeto em FUDGES ou CRUSTS.
// Crostas usam um "kind" que o motor 3D (js/three/brigadeiro.js) sabe desenhar.

export const FUDGES = [
  { id: 'chocolate', color: '#4a2618', rough: 0.5, coat: 0.12, tags: ['classico'],
    name: { pt: 'Chocolate Clássico', en: 'Classic Chocolate' },
    desc: { pt: 'O clássico de festa: cacau intenso, cozido devagar até virar fudge.', en: 'The party classic: deep cocoa, slow-cooked into fudge.' } },
  { id: 'morango', color: '#e2889a', rough: 0.55, coat: 0.15, tags: ['frutado'],
    name: { pt: 'Morango', en: 'Strawberry' },
    desc: { pt: 'Morango de verdade no leite condensado. Rosado, macio, perfumado.', en: 'Real strawberry in condensed milk. Pink, soft, fragrant.' } },
  { id: 'pistache', color: '#b4bf78', rough: 0.55, coat: 0.12, tags: ['nozes'],
    name: { pt: 'Pistache', en: 'Pistachio' },
    desc: { pt: 'Pistache torrado e moído, verde suave e amanteigado.', en: 'Toasted ground pistachio, softly green and buttery.' } },
  { id: 'erva-mate', color: '#8d9a52', rough: 0.58, coat: 0.1, tags: ['especiarias'],
    name: { pt: 'Erva-Mate', en: 'Yerba Mate' },
    desc: { pt: 'O chimarrão virou doce: herbal, levemente amargo, muito gaúcho.', en: 'Chimarrão turned into candy: herbal, gently bitter, very southern Brazil.' } },
  { id: 'bergamota', color: '#ee9e48', rough: 0.52, coat: 0.15, tags: ['frutado'],
    name: { pt: 'Bergamota', en: 'Tangerine' },
    desc: { pt: 'O cítrico do Sul do Brasil: perfumado, doce e solar.', en: 'The citrus of southern Brazil: fragrant, sweet and sunny.' } },
  { id: 'cha-limao', color: '#e9d898', rough: 0.55, coat: 0.12, tags: ['frutado'],
    name: { pt: 'Chá de Limão', en: 'Lemon Tea' },
    desc: { pt: 'Chá preto com limão siciliano. Fresco, delicado, elegante.', en: 'Black tea with Sicilian lemon. Fresh, delicate, elegant.' } },
  { id: 'choc-pimenta', color: '#55200f', rough: 0.5, coat: 0.12, tags: ['especiarias', 'classico'],
    name: { pt: 'Chocolate com Pimenta', en: 'Chili Chocolate' },
    desc: { pt: 'Chocolate amargo com um calorzinho que chega depois.', en: 'Dark chocolate with a warmth that arrives a beat later.' } },
  { id: 'coco', color: '#f1e9da', rough: 0.6, coat: 0.1, tags: ['classico', 'tropical'],
    name: { pt: 'Coco', en: 'Coconut' },
    desc: { pt: 'Coco fresco e cremoso. Praia em forma de doce.', en: 'Fresh, creamy coconut. A beach in candy form.' } },
  { id: 'branquinho', color: '#f2e0bd', rough: 0.55, coat: 0.15, tags: ['classico'],
    name: { pt: 'Branquinho', en: 'Sweet Cream' },
    desc: { pt: 'A base pura: leite condensado e manteiga, sem cacau.', en: 'The pure base: condensed milk and butter, no cocoa.' } },
  { id: 'maracuja', color: '#eebd36', rough: 0.5, coat: 0.18, tags: ['frutado', 'tropical'],
    name: { pt: 'Maracujá', en: 'Passion Fruit' },
    desc: { pt: 'Azedinho e tropical, para quem gosta de contraste.', en: 'Tangy and tropical, for lovers of contrast.' } },
];

// kind -> receita visual no motor 3D
export const CRUSTS = [
  { id: 'granulado', kind: 'sprinkles', swatch: ['#2b150d', '#4a2615', '#3a1d10'],
    name: { pt: 'Granulado Clássico', en: 'Chocolate Sprinkles' },
    desc: { pt: 'O granulado de chocolate de toda festa brasileira.', en: 'The chocolate sprinkles of every Brazilian party.' } },
  { id: 'caju', kind: 'chunks', swatch: ['#e8c48f', '#d3a66a', '#f2dcb2'],
    name: { pt: 'Castanha de Caju', en: 'Cashew' },
    desc: { pt: 'Caju torrado e picado grosso, crocante e amanteigado.', en: 'Toasted, coarsely chopped cashew. Crunchy and buttery.' } },
  { id: 'amendoim', kind: 'chunks-small', swatch: ['#f1d9a8', '#d9b07a', '#b98a55'],
    name: { pt: 'Amendoim', en: 'Peanut' },
    desc: { pt: 'Amendoim torrado, com aquele sal escondido.', en: 'Roasted peanut with a hidden pinch of salt.' } },
  { id: 'pistache', kind: 'pistachio', swatch: ['#8fae4a', '#b9c766', '#6f8f3a'],
    name: { pt: 'Pistache', en: 'Pistachio' },
    desc: { pt: 'Pistache picado, verde vivo e perfumado.', en: 'Chopped pistachio, bright green and fragrant.' } },
  { id: 'noz-moscada', kind: 'dust', swatch: ['#8a5a35', '#6e4527', '#b08356'],
    name: { pt: 'Noz-Moscada', en: 'Nutmeg' },
    desc: { pt: 'Uma poeira quente e aromática, para paladares curiosos.', en: 'A warm, aromatic dust for curious palates.' } },
  { id: 'canela', kind: 'sugar', swatch: ['#c99862', '#e3c49a', '#f4e6cf'],
    name: { pt: 'Açúcar & Canela', en: 'Cinnamon Sugar' },
    desc: { pt: 'Açúcar cristal com canela: churros vibes.', en: 'Crystal sugar with cinnamon: churro vibes.' } },
  { id: 'limao', kind: 'zest', swatch: ['#f5efd9', '#f2d33c', '#ffffff'],
    name: { pt: 'Raspas de Limão', en: 'Lemon Zest' },
    desc: { pt: 'Açúcar cristal e raspas de limão: brilho e frescor.', en: 'Crystal sugar and lemon zest: sparkle and freshness.' } },
  { id: 'coco-ralado', kind: 'coconut', swatch: ['#ffffff', '#f4efe4', '#e9e1d0'],
    name: { pt: 'Coco Ralado', en: 'Shredded Coconut' },
    desc: { pt: 'Fios de coco fresco, brancos e macios.', en: 'Fresh coconut threads, white and soft.' } },
  { id: 'coco-tostado', kind: 'coconut-toasted', swatch: ['#f0d9b0', '#c58c4e', '#8a5426'],
    name: { pt: 'Coco Tostado', en: 'Toasted Coconut' },
    desc: { pt: 'Coco dourado no forno: crocante e caramelizado.', en: 'Oven-golden coconut: crisp and caramelised.' } },
  { id: 'lascas', kind: 'shavings', swatch: ['#3b1d12', '#5c321d', '#4d2817'],
    name: { pt: 'Lascas de Chocolate', en: 'Chocolate Shavings' },
    desc: { pt: 'Chocolate raspado em lascas finas, como na confeitaria.', en: 'Fine chocolate shavings, pastry-shop style.' } },
  { id: 'colorido', kind: 'nonpareils', swatch: ['#e94b5a', '#f6c445', '#4fb0e8', '#7ccf6a'],
    name: { pt: 'Granulado Colorido', en: 'Rainbow Sprinkles' },
    desc: { pt: 'Bolinhas coloridas: a festa de criança, em versão adulta.', en: 'Rainbow nonpareils: the kids’ party, grown up.' } },
  { id: 'amendoa', kind: 'almond', swatch: ['#f1e2c4', '#e2c99c', '#c9a46e'],
    name: { pt: 'Amêndoa Laminada', en: 'Sliced Almond' },
    desc: { pt: 'Lâminas finas de amêndoa tostada.', en: 'Thin slices of toasted almond.' } },
  { id: 'perolas', kind: 'pearls', swatch: ['#e2554f', '#d9443f', '#f07a68'],
    name: { pt: 'Pérolas Vermelhas', en: 'Red Pearls' },
    desc: { pt: 'Pérolas crocantes, brilhantes como joias.', en: 'Crunchy pearls that shine like jewels.' } },
  { id: 'acucar-rosa', kind: 'sugar-pink', swatch: ['#f39ab0', '#f7c0cf', '#ffffff'],
    name: { pt: 'Açúcar Cristal Rosa', en: 'Pink Crystal Sugar' },
    desc: { pt: 'Cristais rosados que brilham na luz.', en: 'Pink crystals that sparkle in the light.' } },
  { id: 'brulee', kind: 'brulee', swatch: ['#c9832f', '#e0a24c', '#7a3f12'],
    name: { pt: 'Caramelo Brûlée', en: 'Caramel Brûlée' },
    desc: { pt: 'Casquinha de açúcar maçaricado, que estala na mordida.', en: 'A torched sugar shell that cracks when you bite.' } },
  // sempre por último: o cliente pode querer só o recheio
  { id: 'sem-crosta', kind: 'none', swatch: ['#f3ece2', '#e8dfd2', '#f3ece2'],
    name: { pt: 'Sem crosta', en: 'No crust' },
    desc: { pt: 'Só o recheio, liso e brilhante, para sentir o sabor puro.', en: 'Just the filling, smooth and glossy, for the pure flavour.' } },
];

export const BOXES = [
  { id: 'b9', size: 9, price: 32, cols: 3 },
  { id: 'b24', size: 24, price: 78, cols: 6 },
  { id: 'b50', size: 50, price: 150, cols: 10 },
  { id: 'b100', size: 100, price: 280, cols: 10 },
];

export const DELIVERY_FEE = 15;
export const GST = 0.05;
export const PICKUP_ADDRESS = '129 Westminster Drive SW, Calgary, AB T3C 2T2';

// Caixas curadas (produtos da loja)
export const PRODUCTS = [
  { id: 'classicos', box: 'b24', badge: 'best', tags: ['classico'],
    mix: [['chocolate', 'granulado'], ['branquinho', 'coco-ralado'], ['coco', 'coco-tostado']],
    name: { pt: 'Clássicos do Brasil', en: 'Brazilian Classics' },
    tagline: { pt: 'A festa de aniversário que você lembra.', en: 'The birthday party you remember.' },
    desc: { pt: 'O trio que todo brasileiro reconhece de olhos fechados: chocolate com granulado, branquinho com coco e coco tostado. Feitos à mão, um a um.', en: 'The trio every Brazilian knows with eyes closed: chocolate with sprinkles, sweet cream with coconut and toasted coconut. Hand-rolled, one by one.' } },
  { id: 'pistache', box: 'b24', badge: 'new', tags: ['nozes'],
    mix: [['pistache', 'pistache'], ['branquinho', 'pistache'], ['erva-mate', 'amendoa']],
    name: { pt: 'Jardim de Pistache', en: 'Pistachio Garden' },
    tagline: { pt: 'Verde, nobre e amanteigado.', en: 'Green, noble and buttery.' },
    desc: { pt: 'Para os fãs de pistache: fudge de pistache com crosta de pistache, branquinho com pistache e um toque gaúcho de erva-mate com amêndoa.', en: 'For pistachio lovers: pistachio on pistachio, sweet cream with pistachio, and a southern-Brazil twist of yerba mate with almond.' } },
  { id: 'pink', box: 'b9', badge: 'gift', tags: ['frutado'],
    mix: [['morango', 'acucar-rosa'], ['morango', 'perolas'], ['branquinho', 'colorido']],
    name: { pt: 'Pink Party', en: 'Pink Party' },
    tagline: { pt: 'Brilho, morango e pérolas.', en: 'Sparkle, strawberry and pearls.' },
    desc: { pt: 'Morango com açúcar cristal rosa, morango com pérolas vermelhas e branquinho com granulado colorido. Para celebrar alto.', en: 'Strawberry with pink crystal sugar, strawberry with red pearls and sweet cream with rainbow sprinkles. For loud celebrations.' } },
  { id: 'fogo', box: 'b24', badge: null, tags: ['especiarias', 'classico'],
    mix: [['choc-pimenta', 'lascas'], ['chocolate', 'brulee'], ['coco', 'brulee']],
    name: { pt: 'Fogo & Caramelo', en: 'Fire & Caramel' },
    tagline: { pt: 'Calor, crocância e açúcar queimado.', en: 'Heat, crunch and burnt sugar.' },
    desc: { pt: 'Chocolate com pimenta em lascas, chocolate e coco com casquinha de caramelo brûlée. O lado mais ousado da Porto Sweets.', en: 'Chili chocolate with shavings, chocolate and coconut under a caramel brûlée shell. Porto Sweets at its boldest.' } },
  { id: 'citricos', box: 'b9', badge: null, tags: ['frutado', 'tropical'],
    mix: [['bergamota', 'limao'], ['cha-limao', 'limao'], ['maracuja', 'coco-tostado']],
    name: { pt: 'Cítricos do Sul', en: 'Southern Citrus' },
    tagline: { pt: 'Fresco, solar, perfumado.', en: 'Fresh, sunny, fragrant.' },
    desc: { pt: 'Bergamota e chá de limão com raspas de limão, e maracujá com coco tostado. Leve como tarde de verão.', en: 'Tangerine and lemon tea with lemon zest, plus passion fruit with toasted coconut. Light as a summer afternoon.' } },
  { id: 'especiarias', box: 'b24', badge: null, tags: ['especiarias'],
    mix: [['erva-mate', 'canela'], ['chocolate', 'noz-moscada'], ['branquinho', 'canela']],
    name: { pt: 'Erva & Especiarias', en: 'Mate & Spice' },
    tagline: { pt: 'Quente, aromático, inesperado.', en: 'Warm, aromatic, unexpected.' },
    desc: { pt: 'Erva-mate com açúcar e canela, chocolate com noz-moscada e branquinho com canela. Um abraço de inverno em Calgary.', en: 'Yerba mate with cinnamon sugar, chocolate with nutmeg and sweet cream with cinnamon. A Calgary winter hug.' } },
  { id: 'nozes', box: 'b50', badge: 'party', tags: ['nozes', 'classico'],
    mix: [['chocolate', 'caju'], ['chocolate', 'amendoim'], ['branquinho', 'amendoa'], ['chocolate', 'granulado']],
    name: { pt: 'Nozes Nobres', en: 'Noble Nuts' },
    tagline: { pt: 'Crocância para a festa inteira.', en: 'Crunch for the whole party.' },
    desc: { pt: 'Chocolate com castanha de caju, com amendoim e com granulado, mais branquinho com amêndoa. Pensada para mesas de festa.', en: 'Chocolate with cashew, peanut and sprinkles, plus sweet cream with almond. Built for party tables.' } },
  { id: 'tropical', box: 'b9', badge: null, tags: ['tropical', 'frutado'],
    mix: [['maracuja', 'coco-ralado'], ['coco', 'coco-tostado'], ['bergamota', 'acucar-rosa']],
    name: { pt: 'Tropical', en: 'Tropical' },
    tagline: { pt: 'Um pedaço do Brasil no inverno canadense.', en: 'A slice of Brazil in a Canadian winter.' },
    desc: { pt: 'Maracujá com coco ralado, coco com coco tostado e bergamota com açúcar cristal rosa.', en: 'Passion fruit with shredded coconut, coconut with toasted coconut and tangerine with pink crystal sugar.' } },
];

export const TESTIMONIALS = [
  { name: 'Ana P.', city: 'Calgary, AB', stars: 5,
    text: { pt: 'Pedi a caixa de 24 para o aniversário da minha mãe e as pessoas não acreditaram que era brigadeiro feito aqui em Calgary.', en: 'I ordered the 24 box for my mom’s birthday and nobody believed it was brigadeiro made right here in Calgary.' } },
  { name: 'Mark T.', city: 'Calgary, AB', stars: 5,
    text: { pt: 'Nunca tinha provado brigadeiro. O de erva-mate com canela virou meu favorito instantâneo.', en: 'I had never tried brigadeiro. Yerba mate with cinnamon sugar became my instant favourite.' } },
  { name: 'Juliana R.', city: 'Cochrane, AB', stars: 5,
    text: { pt: 'Montar a caixa no site é viciante. Passei meia hora só apertando o Surpreenda-me.', en: 'Building the box on the site is addictive. I spent half an hour just pressing Surprise me.' } },
];

export const fudgeById = (id) => FUDGES.find((f) => f.id === id) || FUDGES[0];
export const crustById = (id) => CRUSTS.find((c) => c.id === id) || CRUSTS[0];
export const boxById = (id) => BOXES.find((b) => b.id === id) || BOXES[0];
export const productById = (id) => PRODUCTS.find((p) => p.id === id);

// Distribui as unidades de uma caixa entre as combinações do mix
export function mixToContents(mix, size) {
  const base = Math.floor(size / mix.length);
  let rest = size - base * mix.length;
  return mix.map(([fudge, crust]) => ({ fudge, crust, qty: base + (rest-- > 0 ? 1 : 0) }));
}

export function randomCombo() {
  const f = FUDGES[Math.floor(Math.random() * FUDGES.length)];
  const c = CRUSTS[Math.floor(Math.random() * CRUSTS.length)];
  return { fudge: f.id, crust: c.id };
}
