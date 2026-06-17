#!/usr/bin/env python3
"""
Commons URL → Cloudinary remote fetch → catalogo.csv / catalogo.json

Cloudinary descarga la imagen directamente desde Commons.
Este script no descarga nada localmente: solo orquesta y guarda metadatos.

Variables de entorno requeridas (nunca hardcodear):
    CLOUDINARY_CLOUD_NAME   (ya conocido: didxuy5wm)
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET

Uso:
    # Modo prueba — 2 imágenes en total, luego para:
    python3 ruta_cloudinary.py --limit 2

    # Modo real — todas las imágenes de todos los lugares:
    python3 ruta_cloudinary.py --limit 0

    # Con variables explícitas en una línea:
    CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy python3 ruta_cloudinary.py --limit 2

NO toca index.html, CSS, JS, Git, commits ni push.
"""

import os, sys, json, csv, time, re, unicodedata, hashlib, argparse
import urllib.request, urllib.parse, urllib.error

# ── Credenciales (solo desde entorno, nunca hardcodeadas) ────────────────────
CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "didxuy5wm")
API_KEY    = os.environ.get("CLOUDINARY_API_KEY", "")
API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "")

CLOUDINARY_UPLOAD = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
COMMONS_API       = "https://commons.wikimedia.org/w/api.php"
OUTDIR            = os.path.dirname(os.path.abspath(__file__))
JSON_PATH         = os.path.join(OUTDIR, "catalogo.json")
CSV_PATH          = os.path.join(OUTDIR, "catalogo.csv")
DESCARTES_PATH    = os.path.join(OUTDIR, "descartes.json")

# Carpeta base dentro de Cloudinary
CLOUDINARY_FOLDER = "vive-al-andalus/commons"

# ── Licencias ────────────────────────────────────────────────────────────────
RE_OK = re.compile(
    r"(CC-BY|CC-BY-SA|CC0|Public[_ ]Domain|PD-|PDM|CC-PD|cc-zero|"
    r"Cc-by\b|Cc-by-sa|Creative Commons Attribution(?!.*NonCommercial|.*NoDerivative))",
    re.IGNORECASE,
)
RE_MAL = re.compile(
    r"(NonCommercial|NoDerivative|\bND\b|\bNC\b|All Rights Reserved|"
    r"Copyright.*reserved|GFDL-only|no[- ]free)",
    re.IGNORECASE,
)

# ── Lugares prioritarios ─────────────────────────────────────────────────────
LUGARES = [
    ("cordoba",  "Mezquita-Catedral de Córdoba",
     ["Mosque Cathedral of Córdoba interior", "Great Mosque Córdoba arches",
      "Mezquita Catedral Córdoba columns", "Córdoba mosque cathedral"]),
    ("cordoba",  "Medina Azahara",
     ["Medina Azahara ruins", "Madinat al-Zahra archaeological site"]),
    ("cordoba",  "Córdoba ciudad",
     ["Córdoba Roman Bridge Andalusia", "Puente Romano Córdoba", "Jewish Quarter Córdoba"]),
    ("sevilla",  "Giralda",
     ["Giralda Seville tower", "La Giralda Sevilla alminar"]),
    ("sevilla",  "Real Alcázar de Sevilla",
     ["Real Alcázar Seville patio", "Alcázar Sevilla garden"]),
    ("sevilla",  "Torre del Oro",
     ["Torre del Oro Sevilla", "Tower of Gold Seville river"]),
    ("granada",  "Alhambra",
     ["Alhambra Granada palace", "Palacios Nazaríes interior",
      "Generalife Granada", "Alhambra aerial view"]),
    ("granada",  "Albaicín",
     ["Albaicín Granada view", "Albayzín panorama Alhambra"]),
    ("toledo",   "Mezquita del Cristo de la Luz",
     ["Cristo de la Luz Toledo mosque", "Bab al-Mardum Toledo"]),
    ("toledo",   "Toledo ciudad",
     ["Toledo panorama Tagus", "Toledo Castilla-La Mancha aerial"]),
    ("malaga",   "Alcazaba de Málaga",
     ["Alcazaba Málaga interior", "Alcazaba of Málaga walls"]),
    ("malaga",   "Málaga ciudad",
     ["Málaga historic centre panorama", "Málaga port old city"]),
    ("ronda",    "Baños árabes de Ronda",
     ["Arab baths Ronda interior", "Baños árabes Ronda vault"]),
    ("ronda",    "Ronda ciudad",
     ["Puente Nuevo Ronda gorge", "Ronda Tajo cliff"]),
    ("almeria",  "Alcazaba de Almería",
     ["Alcazaba Almería walls", "Alcazaba of Almería towers"]),
    ("merida",   "Alcazaba de Mérida",
     ["Alcazaba Mérida Roman bridge", "Mérida Islamic fortress"]),
    ("badajoz",  "Alcazaba de Badajoz",
     ["Alcazaba Badajoz", "Torre Espantaperros Badajoz"]),
    ("jaen",     "Baños árabes de Jaén",
     ["Arab baths Jaén Villardompardo", "Baños árabes Jaén vault"]),
    ("jaen",     "Castillo de Santa Catalina",
     ["Castillo Santa Catalina Jaén", "Jaén castle hilltop"]),
    ("carmona",  "Puerta de Sevilla Carmona",
     ["Puerta de Sevilla Carmona", "Carmona Alcázar gate"]),
    ("zaragoza", "Palacio de la Aljafería",
     ["Aljafería Zaragoza exterior", "Palace of Aljafería interior",
      "Sala de Oro Aljafería"]),
    ("palma",    "Baños árabes de Palma",
     ["Arab baths Palma Majorca", "Baños árabes Palma interior"]),
    ("palma",    "Palma de Mallorca",
     ["Palma Majorca cathedral", "Palma historic centre"]),
    ("mertola",  "Mértola ciudad",
     ["Mértola Portugal mosque church", "Igreja Matriz Mértola mihrab"]),
    ("silves",   "Castillo de Silves",
     ["Silves castle Algarve", "Castillo Silves red sandstone"]),
]

# Max imágenes aceptadas por lugar en modo real
MAX_POR_LUGAR = 7

# ── Utilidades ───────────────────────────────────────────────────────────────

def slug(s):
    s = unicodedata.normalize("NFKD", s)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^\w\s-]", "", s)
    return re.sub(r"\s+", "_", s.strip())[:55].lower()

def api_commons(params):
    params["format"] = "json"
    url = COMMONS_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "ViveAlAndalus-ImageBot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"    [commons-api] {e}")
        return {}

def buscar_titulos(termino, limite=15):
    data = api_commons({
        "action": "query", "list": "search",
        "srnamespace": "6", "srsearch": termino,
        "srlimit": limite, "srprop": "title",
    })
    return [r["title"] for r in data.get("query", {}).get("search", [])]

def get_info(titulo):
    data = api_commons({
        "action": "query", "titles": titulo,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime",
    })
    for _, page in data.get("query", {}).get("pages", {}).items():
        ii = page.get("imageinfo", [])
        if not ii:
            return None
        info = ii[0]
        meta = info.get("extmetadata", {})
        lic = " ".join(filter(None, [
            meta.get("LicenseShortName", {}).get("value", ""),
            meta.get("License",          {}).get("value", ""),
            meta.get("Copyrighted",      {}).get("value", ""),
        ]))
        autor_html = meta.get("Artist", {}).get("value", "") or ""
        autor = re.sub(r"<[^>]+>", "", autor_html).strip()[:120]
        return {
            "titulo":      titulo,
            "autor":       autor or "desconocido",
            "licencia":    lic.strip(),
            "url_commons": info.get("descriptionurl", ""),
            "url_directa": info.get("url", ""),
            "ancho":       info.get("width", 0),
            "alto":        info.get("height", 0),
            "mime":        info.get("mime", ""),
        }
    return None

def lic_ok(info):
    raw = info["licencia"]
    if not raw or RE_MAL.search(raw):
        return False
    return bool(RE_OK.search(raw))

def firma_cloudinary(params):
    excluir = {"file", "api_key", "resource_type", "cloud_name"}
    cadena = "&".join(f"{k}={v}" for k, v in sorted(params.items()) if k not in excluir)
    cadena += API_SECRET
    return hashlib.sha1(cadena.encode()).hexdigest()

def public_id_para(ciudad, monumento, titulo):
    nombre = slug(titulo.replace("File:", "").rsplit(".", 1)[0])
    return f"{CLOUDINARY_FOLDER}/{slug(ciudad)}/{slug(monumento)}/{nombre}"

def subir_a_cloudinary(url_directa, public_id):
    """Remote URL fetch: Cloudinary descarga desde Commons sin pasar por aquí."""
    ts = str(int(time.time()))
    params = {
        "file":      url_directa,
        "public_id": public_id,
        "timestamp": ts,
        "api_key":   API_KEY,
        "overwrite": "false",   # no sobreescribe si ya existe
    }
    params["signature"] = firma_cloudinary(params)
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(
        CLOUDINARY_UPLOAD, data=data,
        headers={"User-Agent": "ViveAlAndalus-ImageBot/1.0"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            res = json.loads(r.read())
            return res.get("secure_url", ""), None
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        # 420 = already exists (overwrite=false) → no es error real
        if e.code == 420 or "already exists" in body.lower():
            return "ALREADY_EXISTS", None
        return None, f"HTTP {e.code}: {body}"
    except Exception as e:
        return None, str(e)

# ── Catálogo: cargar existente para evitar duplicados ────────────────────────

def cargar_catalogo():
    if os.path.exists(JSON_PATH):
        try:
            with open(JSON_PATH, encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception:
            pass
    return []

def guardar_catalogo(catalogo, descartes):
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)
    if catalogo:
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=catalogo[0].keys())
            w.writeheader()
            w.writerows(catalogo)
    with open(DESCARTES_PATH, "w", encoding="utf-8") as f:
        json.dump(descartes, f, ensure_ascii=False, indent=2)

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Commons → Cloudinary image fetch")
    parser.add_argument(
        "--limit", type=int, default=0,
        help="Límite total de imágenes a subir. 0 = sin límite (modo real). 2 = modo prueba.",
    )
    args = parser.parse_args()
    limite_global = args.limit  # 0 = ilimitado

    # Validar credenciales
    if not API_KEY or not API_SECRET:
        print("\n⚠  Faltan credenciales de Cloudinary.")
        print("   Exporta antes de ejecutar:\n")
        print("   export CLOUDINARY_CLOUD_NAME=didxuy5wm")
        print("   export CLOUDINARY_API_KEY=TU_API_KEY")
        print("   export CLOUDINARY_API_SECRET=TU_API_SECRET\n")
        sys.exit(1)

    modo = f"PRUEBA (límite={limite_global})" if limite_global else "REAL (sin límite)"
    print(f"\n{'='*60}")
    print(f"  Vive al Ándalus — Commons → Cloudinary")
    print(f"  Modo: {modo}")
    print(f"  Cloud: {CLOUD_NAME}")
    print(f"  Carpeta Cloudinary: {CLOUDINARY_FOLDER}/<ciudad>/<monumento>/")
    print(f"{'='*60}")

    # Cargar catálogo existente y construir set de títulos ya procesados
    catalogo  = cargar_catalogo()
    descartes = []
    ya_en_catalogo = {e["titulo_commons"] for e in catalogo}
    total_subidas  = 0
    total_skip_dup = 0

    for ciudad, monumento, terminos in LUGARES:
        if limite_global and total_subidas >= limite_global:
            break

        print(f"\n[{ciudad.upper()}] {monumento}")
        subidas_lugar = 0

        for termino in terminos:
            if subidas_lugar >= MAX_POR_LUGAR:
                break
            if limite_global and total_subidas >= limite_global:
                break

            print(f"  › \"{termino}\"")
            titulos = buscar_titulos(termino)

            for titulo in titulos:
                if subidas_lugar >= MAX_POR_LUGAR:
                    break
                if limite_global and total_subidas >= limite_global:
                    break

                # Duplicado por título Commons
                if titulo in ya_en_catalogo:
                    total_skip_dup += 1
                    continue

                info = get_info(titulo)
                time.sleep(0.25)

                if not info:
                    descartes.append({"titulo": titulo, "ciudad": ciudad, "motivo": "sin_info"})
                    continue
                if info["mime"] not in ("image/jpeg", "image/png", "image/webp"):
                    descartes.append({"titulo": titulo, "ciudad": ciudad, "motivo": f"mime:{info['mime']}"})
                    continue
                if info["ancho"] < 900:
                    descartes.append({"titulo": titulo, "ciudad": ciudad, "motivo": f"baja_res:{info['ancho']}px"})
                    continue
                if not lic_ok(info):
                    descartes.append({"titulo": titulo, "ciudad": ciudad, "motivo": f"licencia:{info['licencia'][:60]}"})
                    continue

                pid = public_id_para(ciudad, monumento, titulo)
                print(f"    ↑ [{info['ancho']}×{info['alto']}] {titulo[:65]}")

                secure_url, err = subir_a_cloudinary(info["url_directa"], pid)
                time.sleep(0.4)

                if secure_url == "ALREADY_EXISTS":
                    print(f"      · ya existe en Cloudinary, saltando")
                    ya_en_catalogo.add(titulo)
                    total_skip_dup += 1
                    continue

                if secure_url:
                    ya_en_catalogo.add(titulo)
                    subidas_lugar += 1
                    total_subidas += 1
                    entrada = {
                        "ciudad":              ciudad,
                        "monumento":           monumento,
                        "titulo_commons":      titulo,
                        "autor":               info["autor"],
                        "licencia":            info["licencia"][:80],
                        "url_commons":         info["url_commons"],
                        "url_directa_commons": info["url_directa"],
                        "url_cloudinary":      secure_url,
                        "public_id":           pid,
                        "ancho":               info["ancho"],
                        "alto":                info["alto"],
                        "observaciones":       "",
                    }
                    catalogo.append(entrada)
                    # Guardado incremental — si se interrumpe no se pierde nada
                    guardar_catalogo(catalogo, descartes)
                    print(f"      ✓ {secure_url}")
                else:
                    descartes.append({"titulo": titulo, "ciudad": ciudad, "motivo": f"cloudinary:{err}"})
                    print(f"      ✗ {err}")

        print(f"  → {subidas_lugar} subidas para «{monumento}»")

    # Guardado final
    guardar_catalogo(catalogo, descartes)

    print(f"\n{'='*60}")
    print(f"  RESUMEN FINAL")
    print(f"{'='*60}")
    print(f"  Imágenes subidas esta sesión : {total_subidas}")
    print(f"  Saltadas (ya existían)        : {total_skip_dup}")
    print(f"  Descartadas (filtros/errores) : {len(descartes)}")
    print(f"  Total en catálogo             : {len(catalogo)}")
    print(f"{'─'*60}")
    print(f"  catalogo.json  →  {JSON_PATH}")
    print(f"  catalogo.csv   →  {CSV_PATH}")
    print(f"  descartes.json →  {DESCARTES_PATH}")
    print(f"{'─'*60}")
    print(f"  index.html     →  NO TOCADO")
    print(f"  Git / commits  →  NO TOCADO")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
