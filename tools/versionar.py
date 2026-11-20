"""Atualiza a versão de todos os arquivos JS/CSS no index.html (quebra o cache do GitHub Pages).
Uso: python3 tools/versionar.py   (rodar antes de cada commit/publicação)"""
import re, glob, time, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
v = time.strftime('%Y%m%d%H%M%S')
imports = {'three': f'./vendor/three.module.min.js?v={v}'}
for f in sorted(glob.glob('js/**/*.js', recursive=True)) + ['vendor/RoomEnvironment.js']:
    imports['./' + f] = f'./{f}?v={v}'
html = open('index.html', encoding='utf-8').read()
im = '<script type="importmap">' + json.dumps({'imports': imports}, indent=1) + '</script>'
html = re.sub(r'<script type="importmap">.*?</script>', lambda m: im, html, flags=re.S)
html = re.sub(r'css/styles\.css(\?v=\d+)?', f'css/styles.css?v={v}', html)
html = re.sub(r'src="js/app\.js(\?v=\d+)?"', f'src="js/app.js?v={v}"', html)
open('index.html', 'w', encoding='utf-8').write(html)
print('versão', v, '-', len(imports), 'módulos')
