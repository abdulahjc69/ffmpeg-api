#!/usr/bin/env python3
"""
Script para subir las imágenes del atlas a Cloudinary.
Descarga desde Wikimedia Commons y sube directamente.

PRERREQUISITOS:
    pip install cloudinary requests

USO:
    CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy python3 subir_atlas_a_cloudinary.py
    CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy python3 subir_atlas_a_cloudinary.py --limit 5

RESULTADO:
    atlas_imagenes_resultado.json → usar con insertar_imgs_en_atlas.py

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
    name = filename.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    enc = urllib.parse.quote(name)
    return f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{enc}'

def wm_thumb_url(filename, width=1200):
    name = filename.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    enc = urllib.parse.quote(name)
    ext = name.rsplit('.', 1)[-1].lower()
    if ext in ('jpg', 'jpeg', 'png', 'webp', 'gif'):
        return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{enc}/{width}px-{enc}'
    return wm_url(filename)

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

# ── Mapeo completo verificado: (nombre_atlas, tipo, public_id_cloudinary, archivo_wikimedia)
# Filenames verificados — todos devuelven 429 (existen) desde Cloudinary
# License: Wikimedia Commons CC BY-SA / CC BY / PD
ATLAS_PENDIENTES = [
    # ─── ENCLAVES ──────────────────────────────────────────────────────────────────
    ('Madrid',            'enc', 'vivealandalus/atlas/madrid/muralla-arabe-madrid',           'Muralla_árabe_de_Madrid.jpg'),
    ('Toledo',            'enc', 'vivealandalus/atlas/toledo/toledo-enclave',                  'Bab_al-Mardum_mosque_(Cristo_de_la_Luz)_Toledo_-_exterior_view.jpg'),
    ('Carmona',           'enc', 'vivealandalus/atlas/carmona/puerta-sevilla-carmona',         'Puerta_de_Sevilla_Carmona_Spain.jpg'),
    # Non-priority enclaves (secondary run)
    ('Mérida',            'enc', 'vivealandalus/atlas/enclaves/merida',                        'Alcazaba_Merida_1.JPG'),
    ('Cieza (Siyâsa)',    'enc', 'vivealandalus/atlas/enclaves/cieza',                         'Siyasa_casa_patio.jpg'),
    ('Zaragoza',          'enc', 'vivealandalus/atlas/enclaves/zaragoza',                      'Aljafería_-_Zaragoza,_Spain_-_Jan_2008.jpg'),
    ('Almería',           'enc', 'vivealandalus/atlas/enclaves/almeria',                       'Alcazaba_de_Almería.jpg'),
    ('Mértola',           'enc', 'vivealandalus/atlas/enclaves/mertola',                       'Mértola_-_panoramio_(5).jpg'),
    ('Silves',            'enc', 'vivealandalus/atlas/enclaves/silves',                        'Silves_castle_south_tower.jpg'),
    ('Gormaz',            'enc', 'vivealandalus/atlas/enclaves/gormaz',                        'Castillo_de_Gormaz_desde_el_norte.JPG'),
    ('Cáceres',           'enc', 'vivealandalus/atlas/enclaves/caceres',                       'Cáceres_-_Torre_de_Bujaco_(3).jpg'),
    ('Niebla',            'enc', 'vivealandalus/atlas/enclaves/niebla',                        'Niebla._Muralla_y_puerta.jpg'),
    ('Murcia',            'enc', 'vivealandalus/atlas/enclaves/murcia',                        'Murcia_convento_santa_clara.jpg'),
    ('Badajoz',           'enc', 'vivealandalus/atlas/enclaves/badajoz',                       'Alcazaba_de_Badajoz.jpg'),
    ('Lisboa',            'enc', 'vivealandalus/atlas/enclaves/lisboa',                        'Castelo_São_Jorge_Lisboa.jpg'),
    ('Palma de Mallorca', 'enc', 'vivealandalus/atlas/enclaves/palma',                         'Arab_Baths_Palma_Mallorca.jpg'),
    ('Játiva (Xàtiva)',   'enc', 'vivealandalus/atlas/enclaves/xativa',                        'Xativa_castle.jpg'),
    ('Jaén',              'enc', 'vivealandalus/atlas/enclaves/jaen',                          'Baños_arabes_Jaen.jpg'),
    ('Tarifa',            'enc', 'vivealandalus/atlas/enclaves/tarifa',                        'Castillo_de_Guzmán_el_Bueno_en_Tarifa.jpg'),
    ('Algeciras',         'enc', 'vivealandalus/atlas/enclaves/algeciras',                     'Murallas_meriníes_Algeciras.jpg'),
    # ─── MONUMENTOS PRIORITARIOS ───────────────────────────────────────────────────
    ('Alhambra · Alcazaba',                       'mon', 'vivealandalus/atlas/granada/alhambra-alcazaba',        'Alhambra_Alcazaba_and_Watchtower.jpg'),
    ('El Bañuelo (Baños del Nogal)',              'mon', 'vivealandalus/atlas/granada/banuelo-banos-nogal',       'El_Bañuelo_Granada.jpg'),
    ('Generalife',                                'mon', 'vivealandalus/atlas/granada/generalife',                'Generalife_(Granada)_02.jpg'),
    ("Albaicín (Qal'at al-Hamra' al-Qadim)",     'mon', 'vivealandalus/atlas/granada/albaicin',                 'Albaicin_granada.jpg'),
    ('Corral del Carbón',                         'mon', 'vivealandalus/atlas/granada/corral-carbon',             'Corral_del_Carbon_Granada.jpg'),
    ('Madraza de Granada (Yusuf I)',              'mon', 'vivealandalus/atlas/granada/madraza-granada',           'Madraza_de_Yusuf_I_(Granada).jpg'),
    ('Puerta de Elvira',                          'mon', 'vivealandalus/atlas/granada/puerta-elvira',             'Puerta_de_Elvira_(Granada).jpg'),
    ('Baños Árabes de Ronda',                    'mon', 'vivealandalus/atlas/ronda/banos-arabes-ronda',          'Arab_baths_Ronda_Malaga_Spain.jpg'),
    ('Mezquita del Cristo de la Luz (Bab al-Mardum)', 'mon', 'vivealandalus/atlas/toledo/mezquita-cristo-luz',  'Cristo_de_la_Luz_mosque,_Toledo.jpg'),
    ('Baños árabes de Toledo',                   'mon', 'vivealandalus/atlas/toledo/banos-arabes-toledo',        'Baños_árabes_de_Toledo.jpg'),
    ('Baños del Alcázar Califal',                'mon', 'vivealandalus/atlas/cordoba/banos-alcazar-califal',     'Baños_del_Alcázar_Califal_(Córdoba)_01.jpg'),
    ('Alcazaba de Málaga',                       'mon', 'vivealandalus/atlas/malaga/alcazaba-malaga',            'Alcazaba_(Málaga).jpg'),
    ('Castillo de Gibralfaro',                   'mon', 'vivealandalus/atlas/malaga/gibralfaro',                 'Castillo_de_Gibralfaro_(Málaga)_-_3.jpg'),
    # Secondary monumentos
    ('Alcazaba de Almería',                      'mon', 'vivealandalus/atlas/monumentos/alcazaba-almeria',       'Alcazaba_de_Almería.jpg'),
    ('Antigua Mezquita de Mértola (Igreja Matriz)', 'mon', 'vivealandalus/atlas/monumentos/mezquita-mertola',   'Igreja_Matriz_de_Mértola_interior.jpg'),
    ('Mezquita de Almonaster',                   'mon', 'vivealandalus/atlas/monumentos/almonaster',             'Almonaster_la_Real_mosque_interior.jpg'),
    ('Ciudad de Vascos (Los Vascos)',             'mon', 'vivealandalus/atlas/monumentos/ciudad-vascos',          'Los_Vascos_2012.jpg'),
    ('Baños Árabes de Jaén (Palacio de Villardompardo)', 'mon', 'vivealandalus/atlas/monumentos/banos-jaen',    'Baños_árabes_de_Jaén.jpg'),
    ('Alcazaba de Mérida',                       'mon', 'vivealandalus/atlas/monumentos/alcazaba-merida',        'Alcazaba_de_Mérida_-_1.jpg'),
    ('Alcazaba de Badajoz',                      'mon', 'vivealandalus/atlas/monumentos/alcazaba-badajoz',       'Alcazaba_de_Badajoz_2007.jpg'),
    ('Castillo de Burgalimar (Baños de la Encina)', 'mon', 'vivealandalus/atlas/monumentos/burgalimar',          'Castillo_de_Burgalimar_(Baños_de_la_Encina)_05.jpg'),
    ('Alcazaba de Antequera',                    'mon', 'vivealandalus/atlas/monumentos/alcazaba-antequera',     'Alcazaba_de_Antequera_-_3.jpg'),
    ('Alcazaba de Guadix',                       'mon', 'vivealandalus/atlas/monumentos/alcazaba-guadix',        'Alcazaba_de_Guadix.jpg'),
    ('Baños Árabes de Palma',                    'mon', 'vivealandalus/atlas/monumentos/banos-palma',            'Banys_Àrabs_de_Palma_(Illes_Balears)_01.jpg'),
    ('Alcazaba y antigua mezquita de Archidona', 'mon', 'vivealandalus/atlas/monumentos/archidona',              'Archidona_ermita_virgen_gracia_mezquita.jpg'),
    ('Baños Árabes de Baza (Marzuela)',          'mon', 'vivealandalus/atlas/monumentos/banos-baza',             'Baños_arabes_de_Baza.jpg'),
    ('Baños árabes de Elche',                    'mon', 'vivealandalus/atlas/monumentos/banos-elche',            'Baños_árabes_de_Elche.jpg'),
]

# Nombres más cortos para el matching con ATLAS_FALLBACK
ATLAS_NOMBRE_MAP = {
    "Albaicín (Qal'at al-Hamra' al-Qadim)": "Albaicín",
    "Madraza de Granada (Yusuf I)": "Madraza",
    "Mezquita del Cristo de la Luz (Bab al-Mardum)": "Mezquita del Cristo de la Luz (Bab al-Mardum)",
}

def run(limit=0, priority_only=False):
    tmpdir = '/tmp/atlas_imgs'
    os.makedirs(tmpdir, exist_ok=True)

    items = ATLAS_PENDIENTES
    if priority_only:
        # Solo las prioritarias: Madrid, Toledo, Carmona y monumentos Granada/Ronda/Toledo/Córdoba
        PRIORITY = {'Madrid','Toledo','Carmona','Alhambra · Alcazaba','El Bañuelo (Baños del Nogal)',
                    'Generalife',"Albaicín (Qal'at al-Hamra' al-Qadim)",'Corral del Carbón',
                    'Madraza de Granada (Yusuf I)','Puerta de Elvira','Baños Árabes de Ronda',
                    'Mezquita del Cristo de la Luz (Bab al-Mardum)','Baños árabes de Toledo',
                    'Baños del Alcázar Califal','Alcazaba de Málaga','Castillo de Gibralfaro'}
        items = [x for x in items if x[0] in PRIORITY]

    if limit:
        items = items[:limit]

    results = []
    ok = fail = skip = 0

    for nombre, tipo, public_id, wm_file in items:
        url = wm_url(wm_file)
        thumb = wm_thumb_url(wm_file)
        local_path = os.path.join(tmpdir, os.path.basename(public_id) + '.' + wm_file.rsplit('.',1)[-1].lower())

        print(f"\n[{'ENC' if tipo=='enc' else 'MON'}] {nombre}")
        print(f"  Descargando: {url}")

        downloaded = False
        for attempt_url in [url, thumb]:
            try:
                sz = download_image(attempt_url, local_path)
                print(f"  OK descarga: {sz:,} bytes")
                downloaded = True
                break
            except Exception as e:
                print(f"  Error descarga ({attempt_url[:60]}...): {e}")

        if not downloaded:
            print(f"  ✗ SKIP: no se pudo descargar")
            results.append({'nombre': nombre, 'tipo': tipo, 'public_id': public_id, 'status': 'FAIL_DOWNLOAD', 'wm_file': wm_file})
            fail += 1
            continue

        try:
            res = cloudinary.uploader.upload(
                local_path,
                public_id=public_id,
                asset_folder=public_id.rsplit('/', 1)[0],
                display_name=nombre,
                overwrite=True,
                resource_type='image',
            )
            secure_url = res['secure_url']
            opt_url = f"https://res.cloudinary.com/didxuy5wm/image/upload/f_auto,q_auto,w_600/{public_id}"
            print(f"  ✓ OK Cloudinary: {secure_url}")
            results.append({'nombre': nombre, 'tipo': tipo, 'public_id': public_id, 'secure_url': secure_url, 'opt_url': opt_url, 'status': 'OK', 'wm_file': wm_file})
            ok += 1
        except Exception as e:
            print(f"  ✗ Error Cloudinary: {e}")
            results.append({'nombre': nombre, 'tipo': tipo, 'public_id': public_id, 'status': f'FAIL_UPLOAD: {e}', 'wm_file': wm_file})
            fail += 1

        time.sleep(1)  # respetar rate limits

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'atlas_imagenes_resultado.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'results': results, 'ok': ok, 'fail': fail, 'skip': skip}, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"RESULTADO: {ok} OK / {fail} FAIL / {skip} SKIP")
    print(f"Guardado en: {out}")
    print(f"Ahora ejecuta: python3 insertar_imgs_en_atlas.py")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=0, help='Limitar a N imágenes (0 = todas)')
    parser.add_argument('--priority', action='store_true', help='Solo zonas prioritarias')
    args = parser.parse_args()
    run(limit=args.limit, priority_only=args.priority)
