#!/usr/bin/env python3
"""
Descarga imágenes de Wikimedia Commons para Vive al Ándalus.
Usa la API de Commons para buscar, filtrar licencias y descargar.
"""

import os, json, csv, time, re, unicodedata, urllib.request, urllib.parse
import urllib.error

API = "https://commons.wikimedia.org/w/api.php"
OUTDIR = "/home/user/ffmpeg-api/imagenes_wikimedia"

# Licencias reutilizables (incluyendo comercial) — regex contra el texto de licencia
LICENCIAS_OK = re.compile(
    r"(CC-BY|CC-BY-SA|CC0|Public[_ ]Domain|PD-|PDM|CC-PD|"
    r"Cc-by\b|Cc-by-sa|cc-zero|Attribution|"
    r"Creative Commons Attribution(?!.*NonCommercial|.*NoDerivative))",
    re.IGNORECASE
)
LICENCIAS_MALAS = re.compile(
    r"(NonCommercial|NoDerivative|ND\b|NC\b|All Rights Reserved|"
    r"Copyright.*reserved|GFDL-only|no[- ]free)",
    re.IGNORECASE
)

LUGARES = [
    ("cordoba",      "Mezquita-Catedral de Córdoba",  ["Mosque–Cathedral of Córdoba", "Great Mosque of Córdoba", "Mezquita de Córdoba interior", "Mezquita Catedral Córdoba"]),
    ("cordoba",      "Medina Azahara",                ["Medina Azahara", "Madinat al-Zahra"]),
    ("cordoba",      "Córdoba ciudad",                ["Córdoba Andalusia", "Córdoba España", "Puente Romano Córdoba", "Barrio Judío Córdoba"]),
    ("sevilla",      "Giralda",                       ["Giralda Seville", "La Giralda Sevilla"]),
    ("sevilla",      "Real Alcázar de Sevilla",       ["Real Alcázar Seville", "Alcázar Sevilla patio"]),
    ("sevilla",      "Sevilla ciudad",                ["Seville panorama", "Sevilla Torre del Oro", "Torre del Oro Sevilla"]),
    ("granada",      "Alhambra",                      ["Alhambra Granada", "Palacios Nazaríes", "Generalife Granada", "Alhambra palace"]),
    ("granada",      "Albaicín",                      ["Albaicín Granada", "Albayzín panorama"]),
    ("toledo",       "Mezquita del Cristo de la Luz", ["Cristo de la Luz Toledo", "Bab al-Mardum Toledo"]),
    ("toledo",       "Toledo ciudad",                 ["Toledo Castilla España", "Toledo panorama", "Toledo río Tajo"]),
    ("ronda",        "Baños árabes de Ronda",         ["Arab baths Ronda", "Baños árabes Ronda"]),
    ("ronda",        "Ronda ciudad",                  ["Ronda Málaga", "Puente Nuevo Ronda", "Ronda tajo"]),
    ("malaga",       "Alcazaba de Málaga",            ["Alcazaba Málaga", "Alcazaba of Málaga"]),
    ("malaga",       "Málaga ciudad",                 ["Málaga panorama", "Málaga historic centre"]),
    ("almeria",      "Alcazaba de Almería",           ["Alcazaba Almería", "Alcazaba of Almería"]),
    ("almeria",      "Almería ciudad",                ["Almería panorama", "Almeria city"]),
    ("merida",       "Alcazaba de Mérida",            ["Alcazaba Mérida", "Alcazaba of Mérida"]),
    ("badajoz",      "Alcazaba de Badajoz",           ["Alcazaba Badajoz", "Torre Espantaperros Badajoz"]),
    ("jaen",         "Baños árabes de Jaén",          ["Arab baths Jaén", "Baños árabes Jaén Villardompardo"]),
    ("jaen",         "Castillo de Santa Catalina",    ["Castillo Santa Catalina Jaén"]),
    ("carmona",      "Alcázar de la Puerta de Sevilla", ["Puerta de Sevilla Carmona", "Carmona Sevilla"]),
    ("zaragoza",     "Palacio de la Aljafería",       ["Aljafería Zaragoza", "Palace of Aljafería"]),
    ("palma",        "Baños árabes de Palma",         ["Arab baths Palma", "Baños árabes Palma Mallorca"]),
    ("palma",        "Palma de Mallorca",             ["Palma Majorca historic", "Palma Mallorca centre"]),
    ("mertola",      "Mértola ciudad",                ["Mértola Portugal", "Igreja Matriz Mértola"]),
    ("silves",       "Castillo de Silves",            ["Castillo Silves", "Silves castle Algarve"]),
    ("gormaz",       "Castillo de Gormaz",            ["Castillo de Gormaz", "Gormaz castle Soria"]),
]

def limpiar_nombre(s):
    """ASCII-safe filename."""
    s = unicodedata.normalize("NFKD", s)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s]+", "_", s.strip())
    return s[:80]

def api_get(params):
    params["format"] = "json"
    url = API + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  [API error] {e}")
        return {}

def buscar_imagenes(termino, limite=12):
    """Busca imágenes en Commons usando el término dado."""
    data = api_get({
        "action": "query",
        "list": "search",
        "srnamespace": "6",  # File namespace
        "srsearch": termino,
        "srlimit": limite,
        "srprop": "title",
    })
    resultados = data.get("query", {}).get("search", [])
    return [r["title"] for r in resultados]

def get_info_imagen(titulo):
    """Obtiene URL de descarga, autor y licencia de un File:."""
    data = api_get({
        "action": "query",
        "titles": titulo,
        "prop": "imageinfo|revisions",
        "iiprop": "url|extmetadata|size|mime",
        "iiurlwidth": "2000",
    })
    pages = data.get("query", {}).get("pages", {})
    for pid, page in pages.items():
        ii = page.get("imageinfo", [])
        if not ii:
            return None
        info = ii[0]
        meta = info.get("extmetadata", {})
        licencia_raw = (
            meta.get("LicenseShortName", {}).get("value", "") + " " +
            meta.get("License", {}).get("value", "") + " " +
            meta.get("LicenseLong", {}).get("value", "") + " " +
            meta.get("Copyrighted", {}).get("value", "")
        )
        autor_raw = meta.get("Artist", {}).get("value", "") or meta.get("Credit", {}).get("value", "")
        # Limpiar HTML del autor
        autor = re.sub(r"<[^>]+>", "", autor_raw).strip()[:120]
        titulo_desc = meta.get("ObjectName", {}).get("value", "") or titulo
        return {
            "titulo": titulo,
            "titulo_desc": titulo_desc,
            "autor": autor or "desconocido",
            "licencia_raw": licencia_raw.strip(),
            "url_original": info.get("descriptionurl", ""),
            "url_descarga": info.get("url", ""),
            "ancho": info.get("width", 0),
            "alto": info.get("height", 0),
            "mime": info.get("mime", ""),
        }
    return None

def licencia_ok(info):
    raw = info["licencia_raw"]
    if not raw.strip():
        return False
    if LICENCIAS_MALAS.search(raw):
        return False
    if LICENCIAS_OK.search(raw):
        return True
    return False

def ext_from_mime(mime, titulo):
    ext_map = {"image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
               "image/webp": ".webp", "image/svg+xml": ".svg", "image/tiff": ".tif"}
    if mime in ext_map:
        return ext_map[mime]
    # Intentar extraer extensión del título
    m = re.search(r"\.(jpg|jpeg|png|gif|webp|svg|tif|tiff)$", titulo, re.I)
    return "." + m.group(1).lower() if m else ".jpg"

def descargar_archivo(url, ruta):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ViveAlAndalus-ImageBot/1.0 (educational)"})
        with urllib.request.urlopen(req, timeout=30) as r, open(ruta, "wb") as f:
            f.write(r.read())
        return True
    except Exception as e:
        print(f"    [DL error] {e}")
        return False

def main():
    catalogo = []
    descartes = []
    vistos = set()
    total = 0

    os.makedirs(OUTDIR, exist_ok=True)

    for ciudad, monumento, terminos in LUGARES:
        carpeta = os.path.join(OUTDIR, limpiar_nombre(ciudad), limpiar_nombre(monumento))
        os.makedirs(carpeta, exist_ok=True)
        print(f"\n{'='*60}")
        print(f"[{ciudad.upper()}] {monumento}")

        encontradas_aqui = 0
        titulos_vistos_aqui = set()

        for termino in terminos:
            if encontradas_aqui >= 8:
                break
            print(f"  Buscando: \"{termino}\"")
            titulos = buscar_imagenes(termino, limite=15)
            print(f"    {len(titulos)} resultados")

            for titulo in titulos:
                if encontradas_aqui >= 8:
                    break
                if titulo in vistos or titulo in titulos_vistos_aqui:
                    continue
                titulos_vistos_aqui.add(titulo)

                # Solo JPEG/PNG/WEBP — evitar SVG, TIFF, DjVu, OGG, etc.
                ext_titulo = re.search(r"\.(jpg|jpeg|png|webp)$", titulo, re.I)
                if not ext_titulo:
                    # Podría ser PNG sin extensión visible — obtenemos info de todos modos
                    pass

                info = get_info_imagen(titulo)
                time.sleep(0.3)

                if not info:
                    descartes.append({"titulo": titulo, "motivo": "sin_info", "termino": termino})
                    continue

                mime = info.get("mime", "")
                if mime not in ("image/jpeg", "image/png", "image/webp"):
                    descartes.append({"titulo": titulo, "motivo": f"mime_{mime}", "termino": termino})
                    continue

                if info["ancho"] < 800:
                    descartes.append({"titulo": titulo, "motivo": f"muy_pequeña_{info['ancho']}px", "termino": termino})
                    continue

                if not licencia_ok(info):
                    descartes.append({"titulo": titulo, "motivo": f"licencia_dudosa: {info['licencia_raw'][:60]}", "termino": termino})
                    continue

                # Nombre de archivo limpio
                base = limpiar_nombre(re.sub(r"^File:", "", titulo))
                ext = ext_from_mime(mime, titulo)
                nombre_archivo = f"{base}{ext}"
                ruta_local = os.path.join(carpeta, nombre_archivo)

                if os.path.exists(ruta_local):
                    vistos.add(titulo)
                    encontradas_aqui += 1
                    continue

                print(f"    ↓ {titulo[:70]} [{info['ancho']}×{info['alto']}] {info['licencia_raw'][:40]}")
                ok = descargar_archivo(info["url_descarga"], ruta_local)
                time.sleep(0.4)

                if ok:
                    vistos.add(titulo)
                    encontradas_aqui += 1
                    total += 1
                    catalogo.append({
                        "ciudad": ciudad,
                        "monumento": monumento,
                        "titulo_commons": titulo,
                        "titulo_desc": info["titulo_desc"],
                        "autor": info["autor"],
                        "licencia": info["licencia_raw"].strip()[:80],
                        "url_original": info["url_original"],
                        "url_descarga": info["url_descarga"],
                        "archivo_local": ruta_local.replace(OUTDIR + "/", ""),
                        "ancho": info["ancho"],
                        "alto": info["alto"],
                        "observaciones": "",
                    })
                else:
                    descartes.append({"titulo": titulo, "motivo": "error_descarga", "termino": termino})

        print(f"  → {encontradas_aqui} imágenes descargadas para {monumento}")

    # Guardar catálogo JSON
    json_path = os.path.join(OUTDIR, "catalogo.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)

    # Guardar catálogo CSV
    csv_path = os.path.join(OUTDIR, "catalogo.csv")
    if catalogo:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=catalogo[0].keys())
            w.writeheader()
            w.writerows(catalogo)

    # Guardar descartes
    descartes_path = os.path.join(OUTDIR, "descartes.json")
    with open(descartes_path, "w", encoding="utf-8") as f:
        json.dump(descartes, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"FINALIZADO")
    print(f"  Total imágenes descargadas: {total}")
    print(f"  Descartes: {len(descartes)}")
    print(f"  Catálogo JSON: {json_path}")
    print(f"  Catálogo CSV:  {csv_path}")
    return total, len(descartes)

if __name__ == "__main__":
    main()
