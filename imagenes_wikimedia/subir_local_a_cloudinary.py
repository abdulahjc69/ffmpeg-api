#!/usr/bin/env python3
"""
RUTA 2B — Subir imágenes ya descargadas localmente a Cloudinary.

Usar si ya ejecutaste descarga.py en local y tienes las imágenes en carpetas.
Lee catalogo.json, sube cada archivo a Cloudinary y añade la url_cloudinary.

Uso:
    export CLOUDINARY_CLOUD_NAME=didxuy5wm
    export CLOUDINARY_API_KEY=TU_API_KEY
    export CLOUDINARY_API_SECRET=TU_API_SECRET
    python3 subir_local_a_cloudinary.py
"""

import os, json, csv, time, hashlib, urllib.request, urllib.parse

CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "didxuy5wm")
API_KEY    = os.environ.get("CLOUDINARY_API_KEY", "")
API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "")
UPLOAD_URL = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"

OUTDIR     = os.path.dirname(os.path.abspath(__file__))
CATALOGO   = os.path.join(OUTDIR, "catalogo.json")

def signature(params, secret):
    excluir = {"file", "api_key", "resource_type", "cloud_name"}
    to_sign = "&".join(f"{k}={v}" for k, v in sorted(params.items()) if k not in excluir)
    to_sign += secret
    return hashlib.sha1(to_sign.encode()).hexdigest()

def subir_archivo(ruta_local, public_id):
    ts = str(int(time.time()))
    params = {
        "public_id": public_id,
        "folder":    "vive-al-andalus",
        "timestamp": ts,
        "api_key":   API_KEY,
    }
    params["signature"] = signature(params, API_SECRET)

    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    with open(ruta_local, "rb") as f:
        file_data = f.read()

    ext = os.path.splitext(ruta_local)[1].lower()
    mime_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                ".png": "image/png", ".webp": "image/webp"}
    mime = mime_map.get(ext, "image/jpeg")

    body = b""
    for key, val in params.items():
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{key}\"\r\n\r\n{val}\r\n".encode()
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
             f"filename=\"{os.path.basename(ruta_local)}\"\r\nContent-Type: {mime}\r\n\r\n").encode()
    body += file_data + f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        UPLOAD_URL, data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "ViveAlAndalus/1.0",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            res = json.loads(r.read())
            return res.get("secure_url", ""), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}: {e.read().decode()[:150]}"
    except Exception as e:
        return None, str(e)

def main():
    if not API_KEY or not API_SECRET:
        print("⚠  Configura CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET")
        return
    if not os.path.exists(CATALOGO):
        print(f"⚠  No existe {CATALOGO} — ejecuta primero descarga.py")
        return

    with open(CATALOGO, encoding="utf-8") as f:
        catalogo = json.load(f)

    total, errores = 0, 0
    for entry in catalogo:
        if entry.get("url_cloudinary"):
            continue  # ya subida
        ruta = os.path.join(OUTDIR, entry["archivo_local"])
        if not os.path.exists(ruta):
            print(f"  ✗ No encontrado: {ruta}")
            errores += 1
            continue

        public_id = f"{entry['ciudad']}/{entry['monumento'][:30]}/{os.path.splitext(os.path.basename(ruta))[0][:50]}"
        public_id = public_id.replace(" ", "_").lower()
        print(f"  ↑ {entry['ciudad']}/{entry['monumento'][:30]} — {os.path.basename(ruta)}")

        url, err = subir_archivo(ruta, public_id)
        time.sleep(0.4)
        if url:
            entry["url_cloudinary"] = url
            entry["public_id"] = public_id
            total += 1
            print(f"    ✓ {url}")
        else:
            errores += 1
            print(f"    ✗ {err}")

    # Guardar catálogo actualizado
    with open(CATALOGO, "w", encoding="utf-8") as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)

    csv_path = os.path.join(OUTDIR, "catalogo_cloudinary.csv")
    subidas = [e for e in catalogo if e.get("url_cloudinary")]
    if subidas:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=subidas[0].keys())
            w.writeheader()
            w.writerows(subidas)

    print(f"\nSUBIDAS: {total} | ERRORES: {errores}")
    print(f"Catálogo actualizado: {CATALOGO}")
    print(f"CSV Cloudinary: {csv_path}")

if __name__ == "__main__":
    main()
