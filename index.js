const express    = require("express");
const axios      = require("axios");
const fs         = require("fs");
const { spawn }  = require("child_process");
const cloudinary = require("cloudinary").v2;
 
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
 
async function downloadFile(url, outputPath, timeoutMs = 120000, label = "file") {
  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
      timeout: timeoutMs,
      validateStatus: (status) => status >= 200 && status < 300,
      headers: { "User-Agent": "Mozilla/5.0 ffmpeg-api/3.2" },
    });
 
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
 
  } catch (err) {
    const status = err.response?.status || "NO_STATUS";
    throw new Error(`Download failed for ${label}. HTTP ${status}. URL: ${url}`);
  }
}
 
function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args);
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-2500) || `FFmpeg exit ${code}`));
    });
  });
}
 
// ── FIX 1: Detectar duración real del audio con ffprobe ───────
// Permite que cada clip dure exactamente lo que dura la narración.
// Elimina segundos de silencio al final del clip.
function getAudioDuration(audioPath) {
  return new Promise((resolve) => {
    const proc = spawn("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_format",
      audioPath,
    ]);
    let out = "";
    proc.stdout.on("data", (d) => { out += d.toString(); });
    proc.on("close", () => {
      try {
        const d = parseFloat(JSON.parse(out).format?.duration || 0);
        resolve(d > 1 ? d : null);
      } catch { resolve(null); }
    });
    proc.on("error", () => resolve(null));
  });
}
 
// ── Duración de un clip MP4 (para calcular offsets de xfade) ─
function getClipDuration(filePath) {
  return new Promise((resolve) => {
    const proc = spawn("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_format",
      filePath,
    ]);
    let out = "";
    proc.stdout.on("data", (d) => { out += d.toString(); });
    proc.on("close", () => {
      try {
        const d = parseFloat(JSON.parse(out).format?.duration || 0);
        resolve(d > 0 ? d : 18);
      } catch { resolve(18); }
    });
    proc.on("error", () => resolve(18));
  });
}
 
function uploadToCloudinary(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      { resource_type: "video", folder, chunk_size: 6000000 },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}
 
function cleanText(value) {
  return String(value || "")
    .replace(/\r?\n|\r/g, " ")
    .replace(/:/g, " -")
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
 
function wrapText(text, maxChars = 38, maxLines = 4) {
  const words = String(text || "").split(" ");
  const lines = [];
  let line = "";
 
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (testLine.length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
    if (lines.length >= maxLines) break;
  }
 
  if (line && lines.length < maxLines) lines.push(line);
  return lines.join("\n");
}
 
function safeDelete(files) {
  files.forEach((f) => {
    try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (_) {}
  });
}
 
// ─────────────────────────────────────────────────────────────
// FIX 2: KEN BURNS mejorado — zoom más cinematográfico
// Cambios:
//   - speed 0.0008 → 0.0005 (más suave, menos artificial)
//   - zoom máximo 1.15 → 1.10 (menos agresivo)
//   - fade in 0.20 → 0.35 (entrada más suave)
//   - fade out 0.35 → 0.65 (salida más larga para encajar con la transición)
// ─────────────────────────────────────────────────────────────
 
function getKenBurnsFilter(duration, textPath, effect, zoomSpeed, resolution) {
  const fps     = 24;
  const frames  = Math.max(1, Math.ceil(duration * fps));
 
  // ── FIX: fade más largo para encajar con xfade de 0.5s en /merge ──
  const fadeInDur  = 0.35;
  const fadeOutDur = 0.65;
  const fadeOut    = Math.max(0, duration - fadeOutDur);
 
  // ── FIX: zoom más suave ──
  const speed   = parseFloat(zoomSpeed) || 0.0005;
 
  const parts = String(resolution || "1920x1080").split("x");
  const W     = parseInt(parts[0], 10) || 1920;
  const H     = parseInt(parts[1], 10) || 1080;
 
  const fontSize  = Math.max(30, Math.min(48, Math.floor(W / 42)));
  const boxBorder = Math.max(14, Math.floor(fontSize * 0.45));
  const bottomPad = Math.max(70, Math.floor(H * 0.075));
 
  // ── FIX: zoom máximo reducido de 1.15 a 1.10 ──
  const zpMap = {
    zoom_in:
      `z='min(1+on*${speed},1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
 
    zoom_out:
      `z='max(1.10-on*${speed},1.00)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
 
    pan_left:
      `z=1.08:x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)'`,
 
    pan_right:
      `z=1.08:x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)'`,
 
    pan_up:
      `z=1.08:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/${frames})'`,
 
    diagonal_in:
      `z='min(1+on*${speed},1.10)':x='(iw-iw/zoom)*(1-on/${frames})*0.5':y='(ih-ih/zoom)*(1-on/${frames})*0.5'`,
  };
 
  const zp =
    (zpMap[effect] || zpMap.zoom_in) +
    `:d=${frames}:s=${W}x${H}:fps=${fps}`;
 
  return (
    `[0:v]` +
      `scale=${W}:${H}:force_original_aspect_ratio=increase,` +
      `crop=${W}:${H},` +
      `zoompan=${zp},` +
      `trim=duration=${duration},setpts=PTS-STARTPTS,` +
 
      `drawtext=textfile='${textPath}'` +
        `:fontcolor=white` +
        `:fontsize=${fontSize}` +
        `:line_spacing=10` +
        `:x=(w-text_w)/2` +
        `:y=h-text_h-${bottomPad}` +
        `:box=1` +
        `:boxcolor=black@0.62` +
        `:boxborderw=${boxBorder}` +
        `:shadowcolor=black@0.85` +
        `:shadowx=2` +
        `:shadowy=2,` +
 
      `fade=t=in:st=0:d=${fadeInDur},` +
      `fade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
    `[v];` +
 
    `[1:a]` +
      `apad,` +
      `atrim=0:${duration},` +
      `asetpts=PTS-STARTPTS,` +
      `volume=1.8,` +
      `afade=t=in:st=0:d=${fadeInDur},` +
      `afade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
    `[a]`
  );
}
 
// ─────────────────────────────────────────────────────────────
// FIX 3: Construcción del filtro xfade para /merge
// Encadena N clips con transición "fade" de 0.5s entre cada uno.
// Cada clip ya tiene fade in/out propio → combinado da crossfade suave.
// ─────────────────────────────────────────────────────────────
 
function buildXfadeFilterChain(durations, transitionDuration = 0.5) {
  const N = durations.length;
  if (N < 2) return null;
 
  const T = transitionDuration;
  let videoParts = [];
  let audioParts = [];
  let offset     = 0;
 
  for (let i = 0; i < N - 1; i++) {
    const vIn  = i === 0 ? "[0:v]" : `[xv${i}]`;
    const aIn  = i === 0 ? "[0:a]" : `[xa${i}]`;
    const vIn2 = `[${i + 1}:v]`;
    const aIn2 = `[${i + 1}:a]`;
    const vOut = i === N - 2 ? "[vout]" : `[xv${i + 1}]`;
    const aOut = i === N - 2 ? "[aout]" : `[xa${i + 1}]`;
 
    offset += durations[i] - T;
 
    videoParts.push(
      `${vIn}${vIn2}xfade=transition=fade:duration=${T}:offset=${offset.toFixed(2)}${vOut}`
    );
    audioParts.push(
      `${aIn}${aIn2}acrossfade=d=${T}${aOut}`
    );
  }
 
  return [...videoParts, ...audioParts].join(";");
}
 
// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────
 
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ffmpeg-api", version: "3.2" });
});
 
// ── POST /video ───────────────────────────────────────────────
// FIX: duración automática según audio real (ffprobe)
// Si el audio dura 12s, el clip dura 12s — no hay silencio al final.
// Si el audio dura más que el max solicitado, se recorta.
// ─────────────────────────────────────────────────────────────
 
app.post("/video", async (req, res) => {
  const ts = Date.now();
 
  const imagePath  = `/tmp/img_${ts}.jpg`;
  const audioPath  = `/tmp/aud_${ts}.mp3`;
  const textPath   = `/tmp/txt_${ts}.txt`;
  const outputPath = `/tmp/vid_${ts}.mp4`;
 
  try {
    const { image: imageUrl, audio: audioUrl } = req.body;
 
    const textOriginal = cleanText(req.body.text);
    const textWrapped  = wrapText(textOriginal, 38, 4);
 
    const durationRequested = Math.max(1, Number(req.body.duration || 18));
    const effect     = String(req.body.effect || "zoom_in");
    const zoomSpeed  = req.body.zoom_speed || 0.0005;
    const resolution = String(req.body.output_resolution || "1920x1080");
 
    if (!imageUrl || !audioUrl) {
      return res.status(400).json({
        error: "Missing image or audio",
        received: { image: imageUrl || null, audio: audioUrl || null },
      });
    }
 
    console.log("[/video] image:", imageUrl);
    console.log("[/video] audio:", audioUrl);
    console.log("[/video] duration requested:", durationRequested);
    console.log("[/video] effect:", effect);
 
    await Promise.all([
      downloadFile(imageUrl, imagePath, 120000, "image"),
      downloadFile(audioUrl, audioPath, 120000, "audio"),
    ]);
 
    // ── FIX: detectar duración real del audio ──────────────────
    const audioDuration = await getAudioDuration(audioPath);
    const duration = audioDuration
      ? Math.min(audioDuration + 0.5, durationRequested)  // audio + 0.5s margen
      : durationRequested;
 
    console.log("[/video] audio duration detected:", audioDuration, "→ clip duration:", duration);
 
    fs.writeFileSync(textPath, textWrapped || " ", "utf8");
 
    const filter = getKenBurnsFilter(duration, textPath, effect, zoomSpeed, resolution);
 
    await runFfmpeg([
      "-y", "-hide_banner",
 
      "-loop", "1",
      "-framerate", "24",
      "-i", imagePath,
 
      "-i", audioPath,
 
      "-filter_complex", filter,
 
      "-map", "[v]",
      "-map", "[a]",
 
      "-t", String(duration),
 
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "28",
      "-threads", "0",
 
      "-c:a", "aac",
      "-b:a", "128k",
      "-ar", "44100",
 
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
 
      outputPath,
    ]);
 
    const upload = await uploadToCloudinary(outputPath, "youtube/videos");
 
    return res.json({
      success: true,
      video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      bytes: upload.bytes,
      duration: upload.duration,
      effect_used: effect,
      resolution_used: resolution,
      text_used: textWrapped,
      audio_duration_detected: audioDuration,
    });
 
  } catch (err) {
    console.error("[/video ERROR]", err.message);
    return res.status(500).json({ error: "Video generation failed", details: err.message });
  } finally {
    safeDelete([imagePath, audioPath, textPath, outputPath]);
  }
});
 
// ── POST /merge ───────────────────────────────────────────────
// FIX: transición xfade de 0.5s entre clips (en lugar de corte en bruto)
// Cada clip ya tiene fade in/out → combinado da crossfade suave.
// ─────────────────────────────────────────────────────────────
 
app.post("/merge", async (req, res) => {
  const ts         = Date.now();
  const videos     = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloaded = [];
  const outputPath = `/tmp/final_${ts}.mp4`;
 
  try {
    if (!videos.length) {
      return res.status(400).json({ error: "Missing videos array" });
    }
 
    console.log(`[/merge] Descargando ${videos.length} clips...`);
 
    const BATCH = 10;
    for (let i = 0; i < videos.length; i += BATCH) {
      const batch = videos.slice(i, i + BATCH);
      const paths = batch.map((_, j) => `/tmp/clip_${ts}_${i + j}.mp4`);
      await Promise.all(batch.map((url, j) =>
        downloadFile(url, paths[j], 180000, `clip_${i + j}`)
      ));
      downloaded.push(...paths);
      console.log(`[/merge] ${Math.min(i + BATCH, videos.length)}/${videos.length}`);
    }
 
    // ── FIX: detectar duración de cada clip para calcular offsets ──
    console.log("[/merge] Obteniendo duraciones de clips...");
    const durations = await Promise.all(downloaded.map(getClipDuration));
    console.log("[/merge] Duraciones:", durations);
 
    const filterChain = buildXfadeFilterChain(durations, 0.5);
 
    let ffmpegArgs;
 
    if (!filterChain || downloaded.length === 1) {
      // ── 1 solo clip: concat simple ─────────────────────────────
      const listPath = `/tmp/list_${ts}.txt`;
      fs.writeFileSync(
        listPath,
        downloaded.map((f) => `file '${f}'`).join("\n"),
        "utf8"
      );
      ffmpegArgs = [
        "-y", "-hide_banner",
        "-f", "concat", "-safe", "0", "-i", listPath,
        "-c", "copy", "-movflags", "+faststart",
        outputPath,
      ];
      downloaded.push(listPath);
    } else {
      // ── N clips: xfade con transición suave ────────────────────
      console.log("[/merge] Aplicando transiciones xfade...");
      const inputs = downloaded.flatMap((f) => ["-i", f]);
      ffmpegArgs = [
        "-y", "-hide_banner",
        ...inputs,
        "-filter_complex", filterChain,
        "-map", "[vout]",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "26",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        outputPath,
      ];
    }
 
    await runFfmpeg(ffmpegArgs);
 
    console.log("[/merge] Subiendo a Cloudinary...");
    const upload = await uploadToCloudinary(outputPath, "youtube/finales");
 
    return res.json({
      success: true,
      final_video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      clips_merged: videos.length,
      bytes: upload.bytes,
      duration: upload.duration,
    });
 
  } catch (err) {
    console.error("[/merge ERROR]", err.message);
    return res.status(500).json({ error: "Merge failed", details: err.message });
  } finally {
    safeDelete([...downloaded, outputPath]);
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ffmpeg-api v3.2 — puerto ${PORT}`);
});
 
