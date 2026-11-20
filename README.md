# Porto Sweets — site v1

Brigadeiros brasileiros enrolados à mão em Calgary, com receita de família de Porto Alegre.
E-commerce + site institucional com **Montador 3D**: o cliente escolhe o recheio (fudge) e a crosta, vê o brigadeiro em 3D na hora e monta a própria caixa.

- **Link público (GitHub Pages):** https://kimciddev.github.io/Porto-sweets/
- **Estado:** protótipo (v1 para validação). Pedidos, conta e pagamento são **simulados**.
- **Site por** [Femik](https://femik.ca).

## O que tem na v1

| Página | Rota | O que faz |
|---|---|---|
| Home | `#/` | Hero com brigadeiro 3D flutuando e trocando de sabor, galáxia de ingredientes, "O que é brigadeiro", Montador, caixas da casa, nossa história (Porto Alegre → Calgary), tamanhos, embalagem, depoimentos |
| Montador | `#/montador` | 3 colunas: recheio · 3D · crosta. Dropdown + bolinhas, **Surpreenda-me**, favoritar, montar caixa de 9/24/50/100 |
| Loja | `#/loja` | Caixas curadas com filtro por categoria |
| Produto | `#/produto/<id>` | 3D das combinações da caixa, tamanho, quantidade, personalizar no Montador |
| Carrinho | `#/carrinho` | Itens, quantidade, subtotal |
| Checkout | `#/checkout` | Contato → retirada (grátis) ou entrega agendada (+$15, só Calgary) → pagamento estilo Stripe (simulado, cartão `4242 4242 4242 4242`) |
| Pedido | `#/pedido/<id>` | Confirmação |
| Conta | `#/conta` | Login simulado, histórico de pedidos, favoritos, dados |

- **Idioma:** PT ou EN conforme o idioma do sistema do visitante (português → PT; resto → EN), com botão PT/EN.
- **Preços (provisórios):** 9 un. $32 · 24 un. $78 · 50 un. $150 · 100 un. $280 (CAD) + GST 5%.
- **Retirada:** 129 Westminster Drive SW, Calgary, AB T3C 2T2.

## Como abrir

O site é estático (HTML, CSS e JS sem build). Por usar módulos JavaScript, ele precisa ser servido por HTTP, e não aberto direto como arquivo:

```bash
cd porto-sweets
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Estrutura

```
index.html            página única (rotas por hash)
css/styles.css        identidade visual
js/app.js             rotas, cabeçalho, rodapé, animações gerais
js/data.js            "banco de dados": recheios, crostas, caixas, produtos, depoimentos
js/i18n.js            textos PT/EN e detecção de idioma
js/store.js           carrinho, conta e montador (localStorage)
js/paint.js           camada de "tinta": cores aparecem com o mouse/cliques
js/ui.js              componentes (miniaturas, caixa de presente, ícones…)
js/three/brigadeiro.js motor 3D: fudge, 15 crostas, galáxia, miniaturas
js/views/*.js         páginas
assets/               logo (selo, marca, assinatura) + gerar-logo.py
fonts/                Fraunces e DM Sans (OFL), subset latino
vendor/               three.js r160, GSAP 3 + ScrollTrigger (local, sem CDN)
referencias/          fotos de referência enviadas pelo Kim (não usadas no site)
modelos/              (v2) arquivos .blend e .glb do Blender
```

### Adicionar um sabor novo
Em `js/data.js`, acrescente um objeto em `FUDGES` (cor, brilho, nome e descrição em PT/EN) ou em `CRUSTS` (com um `kind` existente: `sprinkles`, `chunks`, `pistachio`, `coconut`, `shavings`, `pearls`, `sugar`…). O 3D, o Montador, a loja e o Surpreenda-me passam a usar o sabor novo automaticamente.

### Blender (v2)
Na v1 o brigadeiro é procedural, gerado com código no Three.js. Na v2, cada ingrediente pode ser modelado e texturizado no Blender, com mapas PBR e baking, exportado em GLB para `modelos/` e trocado em `getGeo()` em `js/three/brigadeiro.js`, sem mexer no resto do site.

## Em aberto
- Preços finais, lista final de sabores e fotos reais de produto.
- Pagamento real (Stripe) e backend de pedidos/contas.
- Links das redes sociais (ícones já no rodapé).
- Domínio próprio, só depois da validação no GitHub Pages.
