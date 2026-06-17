#!/usr/bin/env python3
"""
Lee atlas_imagenes_resultado.json (salida de subir_atlas_a_cloudinary.py)
e inserta los campos `img` en ATLAS_FALLBACK dentro de index.html.

USO:
    python3 insertar_imgs_en_atlas.py

Modifica SOLO index.html (campo `img` dentro de ATLAS_FALLBACK).
NO hace commit, NO publica, NO toca producción.

USO:
    python3 insertar_imgs_en_atlas.py

NO hace commits, NO publica nada.
"""
import json, re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(BASE, 'index.html')
RES  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'atlas_imagenes_resultado.json')

if not os.path.exists(RES):
    print(f"ERROR: {RES} no existe. Ejecuta primero subir_atlas_a_cloudinary.py")
    exit(1)

with open(RES) as f:
    resultado = json.load(f)

with open(HTML) as f:
    html = f.read()

m = re.search(r'window\.ATLAS_FALLBACK = (\{.*?\});', html, re.DOTALL)
atlas = json.loads(m.group(1))

CLD = 'https://res.cloudinary.com/didxuy5wm/image/upload/f_auto,q_auto,w_600/'
inserted = 0

for enc in atlas['enclaves']:
    nombre = enc['nombre']
    if nombre in resultado and 'secure_url' in resultado[nombre]:
        enc['img'] = resultado[nombre]['secure_url'].replace(
            'https://res.cloudinary.com/didxuy5wm/image/upload/',
            CLD.replace('w_600/', 'w_600/')
        )
        # Reuse the transformations URL properly
        raw_url = resultado[nombre]['secure_url']
        # Insert f_auto,q_auto,w_600 transformation
        enc['img'] = raw_url.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_600/')
        inserted += 1
        print(f'  ✓ ENCLAVE: {nombre}')

for mon in atlas['monumentos']:
    nombre = mon['nombre']
    if nombre in resultado and 'secure_url' in resultado[nombre]:
        raw_url = resultado[nombre]['secure_url']
        mon['img'] = raw_url.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_600/')
        inserted += 1
        print(f'  ✓ MONUMENTO: {nombre}')

new_atlas = 'window.ATLAS_FALLBACK = ' + json.dumps(atlas, ensure_ascii=False, separators=(',',':')) + ';'
html2 = html.replace(m.group(0), new_atlas)

with open(HTML, 'w') as f:
    f.write(html2)

total_enc = sum(1 for e in atlas['enclaves'] if e.get('img'))
total_mon = sum(1 for mo in atlas['monumentos'] if mo.get('img'))
print(f'\n✓ Insertadas {inserted} imágenes nuevas en index.html')
print(f'  Enclaves con img: {total_enc}/26')
print(f'  Monumentos con img: {total_mon}/24')
print('\nRevisa los cambios con: git diff index.html')
