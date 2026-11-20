// Idioma: definido pelo idioma do sistema (celular/computador) — mesmo modelo do site da Femik.
// Português se o sistema estiver em português; inglês para todo o resto. Botão PT/EN no topo.

const STR = {
  pt: {
    'nav.builder': 'Monte o seu', 'nav.shop': 'Loja', 'nav.story': 'Nossa história', 'nav.account': 'Conta', 'nav.cart': 'Carrinho', 'nav.menu': 'Menu',
    'loader': 'Misturando os sabores…',
    'hero.eyebrow': 'Brigadeiros brasileiros · Calgary',
    'hero.t1': 'Um milhão de sabores.', 'hero.t2': 'O seu é único.',
    'hero.sub': 'Brigadeiros enrolados à mão em Calgary, com receita de família de Porto Alegre. Escolha o recheio, escolha a crosta e veja o seu nascer em 3D.',
    'hero.cta': 'Monte o seu brigadeiro', 'hero.cta2': 'Ver caixas',
    'hero.stats': '10 recheios · 15 crostas (ou nenhuma) · 160 combinações',
    'hero.fudge': 'recheio', 'hero.crust': 'crosta', 'hint.drag': 'arraste para girar · toque para apertar',
    'what.eyebrow': 'Para quem ainda não conhece', 'what.title': 'O que é brigadeiro?',
    'what.lead': 'O doce que não falta em nenhuma festa brasileira. Pequeno, intenso, feito à mão e comido em uma mordida (ou duas).',
    'what.s1': 'Leite condensado, cacau e manteiga', 'what.s1t': 'Três ingredientes, mexidos na panela sem pressa.',
    'what.s2': 'Ponto de fudge', 'what.s2t': 'Cozinha até desgrudar do fundo e virar um creme denso e brilhante.',
    'what.diffEy': 'O nosso diferencial', 'what.diffT': 'Aqui, o sabor é você que monta.', 'what.diffX': 'O brigadeiro tradicional tem uns quatro ou cinco sabores. Na Porto Sweets você escolhe o recheio e a crosta, um por um: 10 recheios, 15 crostas (ou nenhuma), e cada caixa pode misturar quantas combinações você quiser.', 'what.diffTrad': 'sabores no tradicional', 'what.diffOurs': 'combinações na Porto Sweets',
    'what.s3': 'Enrolado à mão', 'what.s3t': 'Bolinha por bolinha, com a mão untada de manteiga, e passado na crosta.',
    'story.eyebrow': 'Nossa história', 'story.title': 'De Porto Alegre para Calgary, com saudade.',
    'story.p1': 'A Porto Sweets nasceu de dois gaúchos de Porto Alegre, que trouxeram na bagagem as receitas de família, a mesa de festa cheia de forminhas coloridas e o ritual de enrolar brigadeiro na véspera, com a mão untada de manteiga e alguém roubando um da bandeja.',
    'story.p2': 'Aqui em Calgary, longe de casa, o brigadeiro virou o nosso jeito de matar a saudade e de ver o sorriso, tanto de crianças quanto de adultos.',
    'story.p3': 'A receita é a nossa tradição, e a criatividade é toda tua.', 'story.sign': 'Kim & Gabriel',
    'teaser.eyebrow': 'A estrela da casa', 'teaser.title': 'O Montador',
    'teaser.text': 'Escolha o recheio. Escolha a crosta. Veja o seu brigadeiro ganhar forma em 3D, gire, aperte e coloque na caixa. Não sabe o que escolher? Aperte o Surpreenda-me.',
    'teaser.cta': 'Abrir o Montador',
    'feat.eyebrow': 'Ou escolha uma combinação nossa', 'feat.title': 'Caixas da casa', 'feat.all': 'Ver a loja inteira',
    'boxes.eyebrow': 'Caixas prontas', 'boxes.title': 'Escolha o tamanho da festa', 'boxes.units': 'unidades', 'boxes.each': 'por unidade', 'boxes.cta': 'Montar esta caixa',
    'box.b9': 'Para presentear', 'box.b24': 'Para a mesa', 'box.b50': 'Para a festa', 'box.b100': 'Para o casamento',
    'pack.eyebrow': 'Embalagem', 'pack.title': 'Caixa de presente, selo de cera.',
    'pack.text': 'Caixas rígidas em framboesa e azul-marinho, divisórias coloridas e o nosso selo fechando a tampa. Cada brigadeiro na sua forminha, como manda a tradição brasileira.',
    'pack.note': 'Conceito de embalagem — v1',
    'testi.eyebrow': 'Quem já provou', 'testi.title': 'Saudade resolvida.', 'testi.sample': 'depoimento de exemplo',
    'deliv.pickup': 'Retirada grátis em Calgary', 'deliv.pickupText': 'o local é enviado na confirmação do pedido.', 'deliv.delivery': 'Entrega agendada em Calgary', 'deliv.deliveryText': '{fee} · grátis acima de {free}. Você escolhe o dia e o horário.', 'deliv.ahead': 'Feitos sob encomenda, com 48h de antecedência.',
    'final.title': 'Monte a tua caixa.', 'final.cta': 'Abrir o Montador',
    'foot.tag': 'Brigadeiros enrolados à mão em Calgary, com sotaque de Porto Alegre.',
    'foot.nav': 'Navegar', 'foot.visit': 'Entrega', 'foot.visitText': 'Calgary, AB · entrega agendada · frete grátis acima de {free}',
    'foot.by': 'Site por', 'foot.demo': 'Versão de demonstração: pedidos e pagamentos são simulados.',
    'b.title': 'O Montador', 'b.sub': 'Escolha, gire, aperte. Cada combinação aparece em 3D na hora.',
    'b.fudge': 'Recheio', 'b.fudgeHint': 'o centro, o fudge', 'b.crust': 'Crosta', 'b.crustHint': 'a cobertura',
    'b.surprise': 'Surpreenda-me', 'b.fav': 'Favoritar', 'b.faved': 'Favorito', 'b.cup': 'Forminha',
    'b.box': 'Monte sua caixa', 'b.size': 'Tamanho', 'b.qty': 'Quantas desta combinação?', 'b.add': 'Adicionar à caixa',
    'b.remaining': 'faltam {n}', 'b.full': 'Caixa completa!', 'b.fill': 'Completar com surpresas', 'b.clear': 'Esvaziar',
    'b.addCart': 'Adicionar caixa ao carrinho', 'b.empty': 'Sua caixa está vazia. Escolha uma combinação e adicione.',
    'b.combos': '{n} combinações possíveis', 'b.boxChanged': 'Caixa trocada para {n} unidades',
    'shop.title': 'Loja', 'shop.sub': 'Caixas curadas pela casa, ou monte a sua do zero.',
    'tag.all': 'Todas', 'tag.classico': 'Clássicos', 'tag.frutado': 'Frutados', 'tag.nozes': 'Nozes', 'tag.especiarias': 'Especiarias', 'tag.tropical': 'Tropicais',
    'shop.from': 'A partir de', 'shop.view': 'Ver caixa', 'shop.customT': 'Do zero, do seu jeito', 'shop.customX': 'Monte a caixa sabor por sabor no Montador.',
    'badge.best': 'Mais pedida', 'badge.new': 'Novidade', 'badge.gift': 'Para presentear', 'badge.party': 'Para festas',
    'p.inBox': 'Nesta caixa', 'p.size': 'Tamanho', 'p.qty': 'Quantidade', 'p.add': 'Adicionar ao carrinho', 'p.customize': 'Personalizar no Montador',
    'p.related': 'Você também vai gostar', 'p.notes': 'Feitos à mão sob encomenda · 48h de antecedência · melhor em até 5 dias', 'p.back': 'Voltar à loja', 'p.notFound': 'Caixa não encontrada.',
    'cart.title': 'Seu carrinho', 'cart.empty': 'Seu carrinho está vazio.', 'cart.emptyCta': 'Ir para o Montador', 'cart.subtotal': 'Subtotal',
    'cart.shipNote': 'Estimativa com entrega. Retirada em Calgary é grátis — você escolhe no próximo passo.', 'cart.toFree': 'Faltam {n} para o frete grátis', 'cart.freeOk': 'Frete grátis garantido!', 'cart.estTotal': 'Total estimado', 'cart.checkout': 'Finalizar pedido', 'cart.remove': 'Remover',
    'cart.boxOf': 'Caixa de {n}', 'cart.custom': 'Caixa montada por você', 'cart.continue': 'Continuar comprando', 'cart.added': 'Adicionado ao carrinho',
    'co.title': 'Finalizar pedido', 'co.s1': 'Contato', 'co.s2': 'Entrega', 'co.s3': 'Pagamento',
    'co.name': 'Nome completo', 'co.email': 'E-mail', 'co.phone': 'Telefone', 'co.next': 'Continuar', 'co.back': 'Voltar',
    'co.pickup': 'Retirada', 'co.pickupX': 'Grátis · em Calgary, local enviado na confirmação', 'co.delivery': 'Entrega agendada', 'co.deliveryX': 'Calgary · grátis acima de {free}',
    'co.address': 'Endereço', 'co.postal': 'Código postal', 'co.postalErr': 'Entregamos só em Calgary (código postal começando com T1Y, T2 ou T3).',
    'co.date': 'Data', 'co.time': 'Horário', 'co.dateErr': 'Escolha uma data a partir de depois de amanhã.', 'co.notes': 'Observações (opcional)', 'co.notesPh': 'Ex.: é presente, não abrir a caixa :)',
    'co.demo': 'Modo demonstração: nada será cobrado. Use o cartão 4242 4242 4242 4242, qualquer validade futura e qualquer CVC.',
    'co.card': 'Número do cartão', 'co.exp': 'Validade', 'co.cvc': 'CVC', 'co.cardName': 'Nome no cartão', 'co.pay': 'Pagar {total}',
    'co.processing': 'Processando pagamento…', 'co.summary': 'Resumo do pedido', 'co.gst': 'GST (5%)', 'co.ship': 'Entrega', 'co.total': 'Total', 'co.free': 'Grátis',
    'co.secure': 'Pagamento seguro via Stripe (simulado)', 'co.req': 'Campo obrigatório', 'co.emailErr': 'E-mail inválido', 'co.cardErr': 'Número de cartão inválido', 'co.expErr': 'Validade inválida', 'co.cvcErr': 'CVC inválido',
    'co.emptyCart': 'Seu carrinho está vazio.',
    'ok.title': 'Pedido confirmado!', 'ok.text': 'Obrigado, {name}! Seu pedido {id} foi recebido. A confirmação vai para {email} (simulado).',
    'ok.pickup': 'Retirada em {date}, {time}. O local da retirada vai por e-mail.', 'ok.delivery': 'Entrega em {date}, {time}, em {address}.',
    'ok.orders': 'Ver meus pedidos', 'ok.shop': 'Voltar à loja', 'ok.notFound': 'Pedido não encontrado.',
    'acc.title': 'Minha conta', 'acc.loginT': 'Entre ou crie sua conta', 'acc.loginX': 'Nesta versão de demonstração, sua conta fica salva só neste navegador.',
    'acc.enter': 'Entrar', 'acc.hello': 'Olá, {name}!', 'acc.orders': 'Pedidos', 'acc.favs': 'Favoritos', 'acc.data': 'Meus dados',
    'acc.noOrders': 'Você ainda não fez pedidos.', 'acc.noFavs': 'Nenhum favorito ainda. No Montador, toque no coração para salvar uma combinação.',
    'acc.status': 'Em preparo', 'acc.open': 'Abrir no Montador', 'acc.logout': 'Sair', 'acc.save': 'Salvar', 'acc.saved': 'Dados salvos',
    'fav.added': 'Salvo nos favoritos', 'fav.removed': 'Removido dos favoritos', 'units': 'un.',
  },
  en: {
    'nav.builder': 'Build yours', 'nav.shop': 'Shop', 'nav.story': 'Our story', 'nav.account': 'Account', 'nav.cart': 'Cart', 'nav.menu': 'Menu',
    'loader': 'Mixing the flavours…',
    'hero.eyebrow': 'Brazilian brigadeiros · Calgary',
    'hero.t1': 'A million flavours.', 'hero.t2': 'Yours is one of a kind.',
    'hero.sub': 'Brigadeiros hand-rolled in Calgary from a family recipe from Porto Alegre, Brazil. Pick the filling, pick the crust and watch yours come to life in 3D.',
    'hero.cta': 'Build your brigadeiro', 'hero.cta2': 'See boxes',
    'hero.stats': '10 fillings · 15 crusts (or none) · 160 combinations',
    'hero.fudge': 'filling', 'hero.crust': 'crust', 'hint.drag': 'drag to spin · tap to squish',
    'what.eyebrow': 'New to it?', 'what.title': 'What is a brigadeiro?',
    'what.lead': 'The treat no Brazilian party goes without. Small, intense, hand-rolled and eaten in one bite (or two).',
    'what.s1': 'Condensed milk, cocoa and butter', 'what.s1t': 'Three ingredients, stirred slowly in the pan.',
    'what.s2': 'Cooked to fudge', 'what.s2t': 'Until it pulls away from the pan and turns thick and glossy.',
    'what.diffEy': 'What makes us different', 'what.diffT': 'Here, you build the flavour.', 'what.diffX': 'Traditional brigadeiro comes in four or five flavours. At Porto Sweets you pick the filling and the crust, one by one: 10 fillings, 15 crusts (or none), and every box can mix as many combinations as you like.', 'what.diffTrad': 'flavours, traditionally', 'what.diffOurs': 'combinations at Porto Sweets',
    'what.s3': 'Rolled by hand', 'what.s3t': 'One by one, with buttered hands, then rolled in the crust.',
    'story.eyebrow': 'Our story', 'story.title': 'From Porto Alegre to Calgary, with saudade.',
    'story.p1': 'Porto Sweets was born from two friends from Porto Alegre, in southern Brazil, who brought along their family recipes, party tables full of colourful paper cups, and the ritual of rolling brigadeiros the night before, buttered hands and someone always stealing one from the tray.',
    'story.p2': 'Here in Calgary, far from home, brigadeiro became our way to ease the saudade (that Brazilian word for missing home) and to see people smile, kids and grown-ups alike.',
    'story.p3': 'The recipe is our tradition. The creativity is all yours.', 'story.sign': 'Kim & Gabriel',
    'teaser.eyebrow': 'The star of the house', 'teaser.title': 'The Builder',
    'teaser.text': 'Pick the filling. Pick the crust. Watch your brigadeiro take shape in 3D, spin it, squish it and drop it in the box. Can’t decide? Hit Surprise me.',
    'teaser.cta': 'Open the Builder',
    'feat.eyebrow': 'Or pick one of ours', 'feat.title': 'House boxes', 'feat.all': 'See the whole shop',
    'boxes.eyebrow': 'Ready-made boxes', 'boxes.title': 'Pick your party size', 'boxes.units': 'pieces', 'boxes.each': 'each', 'boxes.cta': 'Build this box',
    'box.b9': 'A gift', 'box.b24': 'For the table', 'box.b50': 'For the party', 'box.b100': 'For the wedding',
    'pack.eyebrow': 'Packaging', 'pack.title': 'Gift box, wax seal.',
    'pack.text': 'Rigid boxes in raspberry and navy, colourful dividers and our seal closing the lid. Every brigadeiro in its own paper cup, as Brazilian tradition goes.',
    'pack.note': 'Packaging concept — v1',
    'testi.eyebrow': 'People who tried it', 'testi.title': 'Saudade, solved.', 'testi.sample': 'sample review',
    'deliv.pickup': 'Free pickup in Calgary', 'deliv.pickupText': 'the location is sent with your order confirmation.', 'deliv.delivery': 'Scheduled delivery in Calgary', 'deliv.deliveryText': '{fee} · free over {free}. You choose the day and time.', 'deliv.ahead': 'Made to order, 48 hours in advance.',
    'final.title': 'Build your box.', 'final.cta': 'Open the Builder',
    'foot.tag': 'Brigadeiros hand-rolled in Calgary, with a Porto Alegre accent.',
    'foot.nav': 'Explore', 'foot.visit': 'Delivery', 'foot.visitText': 'Calgary, AB · scheduled delivery · free shipping over {free}',
    'foot.by': 'Site by', 'foot.demo': 'Demo version: orders and payments are simulated.',
    'b.title': 'The Builder', 'b.sub': 'Pick, spin, squish. Every combination appears in 3D instantly.',
    'b.fudge': 'Filling', 'b.fudgeHint': 'the fudge centre', 'b.crust': 'Crust', 'b.crustHint': 'the coating',
    'b.surprise': 'Surprise me', 'b.fav': 'Save', 'b.faved': 'Saved', 'b.cup': 'Paper cup',
    'b.box': 'Build your box', 'b.size': 'Size', 'b.qty': 'How many of this combo?', 'b.add': 'Add to box',
    'b.remaining': '{n} to go', 'b.full': 'Box complete!', 'b.fill': 'Fill with surprises', 'b.clear': 'Clear',
    'b.addCart': 'Add box to cart', 'b.empty': 'Your box is empty. Pick a combination and add it.',
    'b.combos': '{n} possible combinations', 'b.boxChanged': 'Box changed to {n} pieces',
    'shop.title': 'Shop', 'shop.sub': 'Boxes curated by the house, or build yours from scratch.',
    'tag.all': 'All', 'tag.classico': 'Classics', 'tag.frutado': 'Fruity', 'tag.nozes': 'Nuts', 'tag.especiarias': 'Spiced', 'tag.tropical': 'Tropical',
    'shop.from': 'From', 'shop.view': 'View box', 'shop.customT': 'From scratch, your way', 'shop.customX': 'Build the box flavour by flavour in the Builder.',
    'badge.best': 'Bestseller', 'badge.new': 'New', 'badge.gift': 'Gift pick', 'badge.party': 'Party size',
    'p.inBox': 'In this box', 'p.size': 'Size', 'p.qty': 'Quantity', 'p.add': 'Add to cart', 'p.customize': 'Customize in the Builder',
    'p.related': 'You may also like', 'p.notes': 'Hand-made to order · 48h notice · best within 5 days', 'p.back': 'Back to shop', 'p.notFound': 'Box not found.',
    'cart.title': 'Your cart', 'cart.empty': 'Your cart is empty.', 'cart.emptyCta': 'Go to the Builder', 'cart.subtotal': 'Subtotal',
    'cart.shipNote': 'Estimate with delivery. Pickup in Calgary is free — choose in the next step.', 'cart.toFree': '{n} away from free shipping', 'cart.freeOk': 'Free shipping unlocked!', 'cart.estTotal': 'Estimated total', 'cart.checkout': 'Checkout', 'cart.remove': 'Remove',
    'cart.boxOf': 'Box of {n}', 'cart.custom': 'Your custom box', 'cart.continue': 'Keep shopping', 'cart.added': 'Added to cart',
    'co.title': 'Checkout', 'co.s1': 'Contact', 'co.s2': 'Delivery', 'co.s3': 'Payment',
    'co.name': 'Full name', 'co.email': 'Email', 'co.phone': 'Phone', 'co.next': 'Continue', 'co.back': 'Back',
    'co.pickup': 'Pickup', 'co.pickupX': 'Free · in Calgary, location sent with confirmation', 'co.delivery': 'Scheduled delivery', 'co.deliveryX': 'Calgary · free over {free}',
    'co.address': 'Street address', 'co.postal': 'Postal code', 'co.postalErr': 'We only deliver in Calgary (postal codes starting with T1Y, T2 or T3).',
    'co.date': 'Date', 'co.time': 'Time', 'co.dateErr': 'Pick a date from the day after tomorrow.', 'co.notes': 'Notes (optional)', 'co.notesPh': 'E.g. it’s a gift, don’t open the box :)',
    'co.demo': 'Demo mode: nothing will be charged. Use card 4242 4242 4242 4242, any future expiry and any CVC.',
    'co.card': 'Card number', 'co.exp': 'Expiry', 'co.cvc': 'CVC', 'co.cardName': 'Name on card', 'co.pay': 'Pay {total}',
    'co.processing': 'Processing payment…', 'co.summary': 'Order summary', 'co.gst': 'GST (5%)', 'co.ship': 'Delivery', 'co.total': 'Total', 'co.free': 'Free',
    'co.secure': 'Secure payment via Stripe (simulated)', 'co.req': 'Required', 'co.emailErr': 'Invalid email', 'co.cardErr': 'Invalid card number', 'co.expErr': 'Invalid expiry', 'co.cvcErr': 'Invalid CVC',
    'co.emptyCart': 'Your cart is empty.',
    'ok.title': 'Order confirmed!', 'ok.text': 'Thank you, {name}! Your order {id} is in. Confirmation goes to {email} (simulated).',
    'ok.pickup': 'Pickup on {date}, {time}. We’ll email you the pickup location.', 'ok.delivery': 'Delivery on {date}, {time}, to {address}.',
    'ok.orders': 'See my orders', 'ok.shop': 'Back to shop', 'ok.notFound': 'Order not found.',
    'acc.title': 'My account', 'acc.loginT': 'Sign in or create your account', 'acc.loginX': 'In this demo version your account is saved in this browser only.',
    'acc.enter': 'Sign in', 'acc.hello': 'Hi, {name}!', 'acc.orders': 'Orders', 'acc.favs': 'Favourites', 'acc.data': 'My details',
    'acc.noOrders': 'You haven’t ordered yet.', 'acc.noFavs': 'No favourites yet. In the Builder, tap the heart to save a combination.',
    'acc.status': 'Being made', 'acc.open': 'Open in the Builder', 'acc.logout': 'Sign out', 'acc.save': 'Save', 'acc.saved': 'Details saved',
    'fav.added': 'Saved to favourites', 'fav.removed': 'Removed from favourites', 'units': 'pcs',
  },
};

function detect() {
  try { const s = localStorage.getItem('ps_lang'); if (s === 'pt' || s === 'en') return s; } catch (e) { /* sem storage */ }
  const l = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase();
  return l.startsWith('pt') ? 'pt' : 'en';
}

export let lang = detect();
const listeners = new Set();
document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

export function setLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem('ps_lang', l); } catch (e) { /* ok */ }
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  listeners.forEach((f) => f(l));
}
export const onLang = (f) => { listeners.add(f); return () => listeners.delete(f); };

export function t(key, vars) {
  let s = STR[lang][key] ?? STR.en[key] ?? key;
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  return s;
}
export const L = (o) => (o ? o[lang] || o.en : '');
export const money = (v) => new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 }).format(v);
export const fmtDate = (iso) => new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-CA', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));
