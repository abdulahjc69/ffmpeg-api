const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { spawn } = require("child_process");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

async function downloadFile(url, outputPath, timeoutMs = 120000) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: timeoutMs,
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);
    let stderr = "";
    ffmpeg.stderr.on("data", (d) => { stderr += d.toString(); });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-1000) || `FFmpeg exited ${code}`));
    });
  });
}

function uploadLargeVideo(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      { resource_type: "video", folder, chunk_size: 6000000 },
      (err, result) => { if (err) reject(err); else resolve(result); }
    );
  });
}

function cleanText(value) {
  return String(value || "")
    .replace(/\r?\n|\r/g, " ")
    .replace(/:/g, " -")
    .replace(/'/g, "")
    .replace(/"/g, "")
    .trim();
}

function safeDelete(files) {
  files.forEach((f) => { try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (_) {} });
}

// ─────────────────────────────────────────────────────────────────
// Ken Burns filter — 1920×1080 landscape
// effects: zoom_in | zoom_out | pan_left | pan_right | pan_up | diagonal_in
// ─────────────────────────────────────────────────────────────────

function getKenBurnsFilter(duration, textPath, effect, zoomSpeed) {
  const fps = 24;
  const frames = Math.max(1, Math.ceil(duration * fps));
  const fadeOut = Math.max(0, duration - 0.35);
  const speed = parseFloat(zoomSpeed) || 0.0008;
  const W = 1920, H = 1080;

  const zpMap = {
    zoom_in:     `z='min(1+on*${speed},1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    zoom_out:    `z='max(1.15-on*${speed},1.00)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    pan_left:    `z=1.10:x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)'`,
    pan_right:   `z=1.10:x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)'`,
    pan_up:      `z=1.10:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/${frames})'`,
    diagonal_in: `z='min(1+on*${speed},1.15)':x='(iw-iw/zoom)*(1-on/${frames})*0.5':y='(ih-ih/zoom)*(1-on/${frames})*0.5'`,
  };

  const zp = (zpMap[effect] || zpMap.zoom_in) + `:d=${frames}:s=${W}x${H}:fps=${fps}`;

  return (
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,` +
    `crop=${W}:${H},` +
    `zoompan=${zp},` +
    `trim=duration=${duration},setpts=PTS-STARTPTS,` +
    `drawtext=textfile='${textPath}':fontcolor=white:fontsize=42` +
    `:x=(w-text_w)/2:y=h*0.82:box=1:boxcolor=black@0.60:boxborderw=18,` +
    `fade=t=in:st=0:d=0.20,fade=t=out:st=${fadeOut}:d=0.35[v];` +
    `[1:a]apad,atrim=0:${duration},asetpts=PTS-STARTPTS,` +
    `afade=t=in:st=0:d=0.15,afade=t=out:st=${fadeOut}:d=0.35[a]`
  );
}

// ─────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ffmpeg-api", version: "3.0" });
});

// POST /video — genera un clip con Ken Burns + voz
app.post("/video", async (req, res) => {
  const ts = Date.now();
  const imagePath  = `/tmp/img_${ts}.jpg`;
  const audioPath  = `/tmp/aud_${ts}.mp3`;
  const textPath   = `/tmp/txt_${ts}.txt`;
  const outputPath = `/tmp/vid_${ts}.mp4`;

  try {
    const { image: imageUrl, audio: audioUrl } = req.body;
    const text      = cleanText(req.body.text);
    const duration  = Math.max(1, Number(req.body.duration || 9));
    const effect    = req.body.effect || "zoom_in";
    const zoomSpeed = req.body.zoom_speed || 0.0008;

    if (!imageUrl || !audioUrl)
      return res.status(400).json({ error: "Missing image or audio" });

    await Promise.all([
      downloadFile(imageUrl, imagePath),
      downloadFile(audioUrl, audioPath),
    ]);

    fs.writeFileSync(textPath, text || " ", "utf8");

    const filter = getKenBurnsFilter(duration, textPath, effect, zoomSpeed);

    await runFfmpeg([
      "-y",
      "-loop", "1", "-framerate", "24",
      "-i", imagePath,
      "-i", audioPath,
      "-filter_complex", filter,
      "-map", "[v]", "-map", "[a]",
      "-t", String(duration),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
      "-threads", "0",                  // usa todos los CPUs disponibles
      "-c:a", "aac", "-b:a", "128k",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outputPath,
    ]);

    const upload = await uploadLargeVideo(outputPath, "youtube/videos");

    return res.json({
      success: true,
      video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      bytes: upload.bytes,
      duration: upload.duration,
      effect_used: effect,
    });
  } catch (err) {
    console.error("[/video]", err.message);
    return res.status(500).json({ error: "Video generation failed", details: err.message });
  } finally {
    safeDelete([imagePath, audioPath, textPath, outputPath]);
  }
});

// POST /merge — une todos los clips SIN re-codificar (-c copy)
// Mucho más rápido: no hay re-encoding, solo concatenación directa
app.post("/merge", async (req, res) => {
  const ts = Date.now();
  const videos = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloaded = [];
  const listPath   = `/tmp/list_${ts}.txt`;
  const outputPath = `/tmp/final_${ts}.mp4`;

  try {
    if (!videos.length)
      return res.status(400).json({ error: "Missing videos array" });

    console.log(`[/merge] Iniciando descarga de ${videos.length} clips...`);

    // Descarga paralela en lotes de 10 para no saturar memoria
    const BATCH = 10;
    for (let i = 0; i < videos.length; i += BATCH) {
      const batch = videos.slice(i, i + BATCH);
      const paths = batch.map((_, j) => `/tmp/clip_${ts}_${i + j}.mp4`);
      await Promise.all(batch.map((url, j) => downloadFile(url, paths[j], 180000)));
      downloaded.push(...paths);
      console.log(`[/merge] Descargados ${Math.min(i + BATCH, videos.length)}/${videos.length}`);
    }

    fs.writeFileSync(listPath, downloaded.map((f) => `file '${f}'`).join("\n"), "utf8");

    console.log(`[/merge] Concatenando ${downloaded.length} clips con stream copy...`);

    // -c copy = NO re-encoding. 10x más rápido. Funciona porque todos los clips
    // tienen el mismo codec, resolución y framerate (generados por nosotros).
    await runFfmpeg([
      "-y",
      "-f", "concat", "-safe", "0",
      "-i", listPath,
      "-c", "copy",                     // stream copy, sin re-codificar
      "-movflags", "+faststart",
      outputPath,
    ]);

    console.log(`[/merge] Upload a Cloudinary...`);
    const upload = await uploadLargeVideo(outputPath, "youtube/finales");

    return res.json({
      success: true,
      final_video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      clips_merged: videos.length,
      bytes: upload.bytes,
      duration: upload.duration,
    });
  } catch (err) {
    console.error("[/merge]", err.message);
    return res.status(500).json({ error: "Merge failed", details: err.message });
  } finally {
    safeDelete([...downloaded, listPath, outputPath]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`ffmpeg-api v3.0 running on port ${PORT}`); });
