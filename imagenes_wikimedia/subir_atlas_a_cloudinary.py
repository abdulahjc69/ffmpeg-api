#!/usr/bin/env python3
"""
Script para subir las 40 imágenes del atlas que faltan a Cloudinary.
Las descarga desde Wikimedia Commons y las sube directamente.

PRERREQUISITOS:
    pip install cloudinary requests

USO:
    CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy python3 subir_atlas_a_cloudinary.py

    # Solo subir las N primeras (prueba):
    CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy python3 subir_atlas_a_cloudinary.py --limit 5

RESULTADO:
    Genera atlas_imagenes_resultado.json con los secure_url de cada imagen subida.
    Ese fichero se usará para insertar los img en ATLAS_FALLBACK del index.html.

NO modifica index.html, NO hace commits, NO publica nada.
"""

import os, sys, json, time, hashlib, urllib.parse, argparse
import urllib.request

try:
    import cloudinary
    import cloudinary.uploader
except ImportError:
    print("Instala cloudinary: pip install cloudinary")
    sys.exit(1)

CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "didxuy5wm")
API_KEY    = os.environ.get("CLOUDINARY_API_KEY", "")
API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "")

if not API_KEY or not API_SECRET:
    print("ERROR: Define CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET como variables de entorno.")
    sys.exit(1)

cloudinary.config(cloud_name=CLOUD_NAME, api_key=API_KEY, api_secret=API_SECRET, secure=True)

def wm_url(filename):
    """Construye la URL directa de Wikimedia Commons."""
    name = filename.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    enc = urllib.parse.quote(name)
    return f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{enc}'

def wm_thumb_url(filename, width=1200):
    """Construye la URL de thumbnail de Wikimedia Commons."""
    name = filename.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    enc = urllib.parse.quote(name)
    ext = name.rsplit('.', 1)[-1].lower()
    if ext in ('jpg', 'jpeg', 'png', 'webp', 'gif'):
        return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{enc}/{width}px-{enc}'
    return f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{enc}'

def download_image(url, path):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'ViveAlAndalusBot/2.0 (https://vivealandalus.com; reservas@vivealandalus.com)',
        'Referer': 'https://commons.wikimedia.org/',
        'Accept': 'image/*,*/*',
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    with open(path, 'wb') as f:
        f.write(data)
    return len(data)

# ── Mapeo completo: (slug_atlas, nombre_punto, tipo, carpeta_cloudinary, public_id, archivo_wikimedia)
ATLAS_PENDIENTES = [
    # ENCLAVES
    ('Mérida',           'enc', 'vivealandalus/atlas/enclaves/merida',    'atlas_enc_merida',    'Alcazaba_Merida_1.JPG'),
    ('Madrid',           'enc', 'vivealandalus/atlas/enclaves/madrid',    'atlas_enc_madrid',    'Muralla_árabe_de_Madrid.jpg'),
    ('Cieza (Siyâsa)',   'enc', 'vivealandalus/atlas/enclaves/cieza',     'atlas_enc_cieza',     'Siyasa_casa_patio.jpg'),
    ('Toledo',           'enc', 'vivealandalus/atlas/enclaves/toledo',    'atlas_enc_toledo',    'Bab_al-Mardum_mosque_(Cristo_de_la_Luz)_Toledo_-_exterior_view.jpg'),
    ('Zaragoza',         'enc', 'vivealandalus/atlas/enclaves/zaragoza',  'atlas_enc_zaragoza',  'Aljafería_-_Zaragoza,_Spain_-_Jan_2008.jpg'),
    ('Almería',          'enc', 'vivealandalus/atlas/enclaves/almeria',   'atlas_enc_almeria',   'Alcazaba_de_Almería.jpg'),
    ('Mértola',          'enc', 'vivealandalus/atlas/enclaves/mertola',   'atlas_enc_mertola',   'Mértola_-_panoramio_(5).jpg'),
    ('Silves',           'enc', 'vivealandalus/atlas/enclaves/silves',    'atlas_enc_silves',    'Silves_castle_south_tower.jpg'),
    ('Gormaz',           'enc', 'vivealandalus/atlas/enclaves/gormaz',    'atlas_enc_gormaz',    'Castillo_de_Gormaz_desde_el_norte.JPG'),
    ('Cáceres',          'enc', 'vivealandalus/atlas/enclaves/caceres',   'atlas_enc_caceres',   'Cáceres_-_Torre_de_Bujaco_(3).jpg'),
    ('Niebla',           'enc', 'vivealandalus/atlas/enclaves/niebla',    'atlas_enc_niebla',    'Niebla._Muralla_y_puerta.jpg'),
    ('Murcia',           'enc', 'vivealandalus/atlas/enclaves/murcia',    'atlas_enc_murcia',    'Murcia_convento_santa_clara.jpg'),
    ('Badajoz',          'enc', 'vivealandalus/atlas/enclaves/badajoz',   'atlas_enc_badajoz',   'Alcazaba_de_Badajoz.jpg'),
    ('Lisboa',           'enc', 'vivealandalus/atlas/enclaves/lisboa',    'atlas_enc_lisboa',    'Castelo_São_Jorge_Lisboa.jpg'),
    ('Palma de Mallorca','enc', 'vivealandalus/atlas/enclaves/palma',     'atlas_enc_palma',     'Arab_Baths_Palma_Mallorca.jpg'),
    ('Játiva (Xàtiva)',  'enc', 'vivealandalus/atlas/enclaves/xativa',    'atlas_enc_xativa',    'Xativa_castle.jpg'),
    ('Jaén',             'enc', 'vivealandalus/atlas/enclaves/jaen',      'atlas_enc_jaen',      'Baños_arabes_Jaen.jpg'),
    ('Tarifa',           'enc', 'vivealandalus/atlas/enclaves/tarifa',    'atlas_enc_tarifa',    'Castillo_de_Guzmán_el_Bueno_en_Tarifa.jpg'),
    ('Algeciras',        'enc', 'vivealandalus/atlas/enclaves/algeciras', 'atlas_enc_algeciras', 'Murallas_meriníes_Algeciras.jpg'),
    ('Carmona',          'enc', 'vivealandalus/atlas/enclaves/carmona',   'atlas_enc_carmona',   'Puerta_de_Sevilla_Carmona_Spain.jpg'),
    # MONUMENTOS
    ('Alcazaba de Almería',                      'mon', 'vivealandalus/atlas/monumentos/alcazaba-almeria',   'atlas_mon_alcazaba_almeria',  'Alcazaba_de_Almería.jpg'),
    ('Mezquita del Cristo de la Luz (Bab al-Mardum)','mon','vivealandalus/atlas/monumentos/cristo-luz',      'atlas_mon_cristo_luz',        'Cristo_de_la_Luz_mosque,_Toledo.jpg'),
    ('Antigua Mezquita de Mértola (Igreja Matriz)','mon','vivealandalus/atlas/monumentos/mezquita-mertola',  'atlas_mon_mezquita_mertola',  'Igreja_Matriz_de_Mértola_interior.jpg'),
    ('Baños del Alcázar Califal',                'mon', 'vivealandalus/atlas/monumentos/banos-califal',      'atlas_mon_banos_califal',     'Baños_del_Alcázar_Califal_(Córdoba)_01.jpg'),
    ('Mezquita de Almonaster',                   'mon', 'vivealandalus/atlas/monumentos/almonaster',         'atlas_mon_almonaster',        'Almonaster_la_Real_mosque_interior.jpg'),
    ('Ciudad de Vascos (Los Vascos)',             'mon', 'vivealandalus/atlas/monumentos/ciudad-vascos',      'atlas_mon_ciudad_vascos',     'Los_Vascos_2012.jpg'),
    ('Alhambra · Alcazaba',                      'mon', 'vivealandalus/atlas/monumentos/alhambra-alcazaba',  'atlas_mon_alhambra',          'Alhambra_Alcazaba_and_Watchtower.jpg'),
    ('El Bañuelo (Baños del Nogal)',              'mon', 'vivealandalus/atlas/monumentos/banuelo',            'atlas_mon_banuelo',           'El_Bañuelo_Granada.jpg'),
    ('Baños Árabes de Ronda',                    'mon', 'vivealandalus/atlas/monumentos/banos-ronda',        'atlas_mon_banos_ronda',       'Arab_baths_Ronda_Malaga_Spain.jpg'),
    ('Baños Árabes de Jaén (Palacio de Villardompardo)','mon','vivealandalus/atlas/monumentos/banos-jaen',   'atlas_mon_banos_jaen',        'Baños_árabes_de_Jaén.jpg'),
    ('Alcazaba de Mérida',                       'mon', 'vivealandalus/atlas/monumentos/alcazaba-merida',    'atlas_mon_alcazaba_merida',   'Alcazaba_de_Mérida_-_1.jpg'),
    ('Alcazaba de Badajoz',                      'mon', 'vivealandalus/atlas/monumentos/alcazaba-badajoz',   'atlas_mon_alcazaba_badajoz',  'Alcazaba_de_Badajoz_2007.jpg'),
    ('Castillo de Burgalimar (Baños de la Encina)','mon','vivealandalus/atlas/monumentos/burgalimar',        'atlas_mon_burgalimar',        'Castillo_de_Burgalimar_(Baños_de_la_Encina)_05.jpg'),
    ('Baños árabes de Toledo',                   'mon', 'vivealandalus/atlas/monumentos/banos-toledo',       'atlas_mon_banos_toledo',      'Baños_árabes_de_Toledo.jpg'),
    ('Alcazaba de Antequera',                    'mon', 'vivealandalus/atlas/monumentos/alcazaba-antequera', 'atlas_mon_alcazaba_antequera','Alcazaba_de_Antequera_-_3.jpg'),
    ('Alcazaba de Guadix',                       'mon', 'vivealandalus/atlas/monumentos/alcazaba-guadix',    'atlas_mon_alcazaba_guadix',   'Alcazaba_de_Guadix.jpg'),
    ('Baños Árabes de Palma',                    'mon', 'vivealandalus/atlas/monumentos/banos-palma',        'atlas_mon_banos_palma',       'Banys_Àrabs_de_Palma_(Illes_Balears)_01.jpg'),
    ('Alcazaba y antigua mezquita de Archidona', 'mon', 'vivealandalus/atlas/monumentos/archidona',          'atlas_mon_archidona',         'Archidona_ermita_virgen_gracia_mezquita.jpg'),
    ('Baños Árabes de Baza (Marzuela)',          'mon', 'vivealandalus/atlas/monumentos/banos-baza',         'atlas_mon_banos_baza',        'Baños_arabes_de_Baza.jpg'),
    ('Baños árabes de Elche',                    'mon', 'vivealandalus/atlas/monumentos/banos-elche',        'atlas_mon_banos_elche',       'Baños_árabes_de_Elche.jpg'),
]

def run(limit=0):
    outdir = os.path.dirname(os.path.abspath(__file__))
    tmpdir = '/tmp/atlas_imgs'
    os.makedirs(tmpdir, exist_ok=True)
    resultado = {}
    items = ATLAS_PENDIENTES[:limit] if limit > 0 else ATLAS_PENDIENTES
    
    for idx, (nombre, tipo, folder, pid, wm_file) in enumerate(items):
        local = os.path.join(tmpdir, pid + '.jpg')
        print(f'[{idx+1}/{len(items)}] {nombre}')
        
        # Download
        url = wm_url(wm_file)
        try:
            sz = download_image(url, local)
            print(f'  ✓ Descargado {sz//1024}KB: {url}')
        except Exception as e:
            thumb_url = wm_thumb_url(wm_file, 1200)
            try:
                sz = download_image(thumb_url, local)
                print(f'  ✓ Thumb {sz//1024}KB: {thumb_url}')
            except Exception as e2:
                print(f'  ✗ ERROR descarga: {e} / {e2}')
                resultado[nombre] = {'error': str(e), 'tipo': tipo}
                continue
        
        # Upload to Cloudinary
        try:
            res = cloudinary.uploader.upload(
                local,
                public_id=pid,
                asset_folder=folder,
                overwrite=True,
                resource_type='image',
                format='jpg',
                transformation=[{'width': 1200, 'crop': 'limit', 'quality': 'auto:good'}],
                tags=['atlas', tipo, nombre.lower()[:20]],
            )
            url_cld = res['secure_url']
            print(f'  ✓ Subido: {url_cld}')
            resultado[nombre] = {'secure_url': url_cld, 'public_id': res['public_id'], 'tipo': tipo}
        except Exception as e:
            print(f'  ✗ ERROR upload: {e}')
            resultado[nombre] = {'error': str(e), 'tipo': tipo}
        
        time.sleep(1.5)
    
    out_path = os.path.join(outdir, 'atlas_imagenes_resultado.json')
    with open(out_path, 'w') as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)
    print(f'\n✓ Resultado guardado en {out_path}')
    ok = sum(1 for v in resultado.values() if 'secure_url' in v)
    print(f'✓ Imágenes subidas: {ok}/{len(items)}')
    print(f'\nSiguiente paso: ejecuta insertar_imgs_en_atlas.py para actualizar index.html')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0, help='0=todas, N=primeras N')
    args = ap.parse_args()
    run(args.limit)
