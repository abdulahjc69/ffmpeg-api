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
      headers: {
        "User-Agent": "Mozilla/5.0 ffmpeg-api/3.1",
      },
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

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("error", reject);

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-2500) || `FFmpeg exit ${code}`));
    });
  });
}

function uploadToCloudinary(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: "video",
        folder,
        chunk_size: 6000000,
      },
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

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  return lines.join("\n");
}

function safeDelete(files) {
  files.forEach((f) => {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch (_) {}
  });
}

// ─────────────────────────────────────────────────────────────
// KEN BURNS FILTER — 1920x1080 landscape
// Efectos: zoom_in | zoom_out | pan_left | pan_right | pan_up | diagonal_in
// ─────────────────────────────────────────────────────────────

function getKenBurnsFilter(duration, textPath, effect, zoomSpeed, resolution) {
  const fps     = 24;
  const frames  = Math.max(1, Math.ceil(duration * fps));
  const fadeOut = Math.max(0, duration - 0.35);
  const speed   = parseFloat(zoomSpeed) || 0.0008;

  const parts = String(resolution || "1920x1080").split("x");
  const W     = parseInt(parts[0], 10) || 1920;
  const H     = parseInt(parts[1], 10) || 1080;

  const fontSize  = Math.max(30, Math.min(48, Math.floor(W / 42)));
  const boxBorder = Math.max(14, Math.floor(fontSize * 0.45));
  const bottomPad = Math.max(70, Math.floor(H * 0.075));

  const zpMap = {
    zoom_in:
      `z='min(1+on*${speed},1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,

    zoom_out:
      `z='max(1.15-on*${speed},1.00)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,

    pan_left:
      `z=1.10:x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)'`,

    pan_right:
      `z=1.10:x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)'`,

    pan_up:
      `z=1.10:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/${frames})'`,

    diagonal_in:
      `z='min(1+on*${speed},1.15)':x='(iw-iw/zoom)*(1-on/${frames})*0.5':y='(ih-ih/zoom)*(1-on/${frames})*0.5'`,
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

      `fade=t=in:st=0:d=0.20,` +
      `fade=t=out:st=${fadeOut}:d=0.35` +
    `[v];` +

    `[1:a]` +
      `apad,` +
      `atrim=0:${duration},` +
      `asetpts=PTS-STARTPTS,` +
      `volume=1.8,` +
      `afade=t=in:st=0:d=0.15,` +
      `afade=t=out:st=${fadeOut}:d=0.35` +
    `[a]`
  );
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "ffmpeg-api",
    version: "3.1",
  });
});

// ── POST /video ───────────────────────────────────────────────
// Recibe:
//   image, audio, text, duration, effect, zoom_speed, output_resolution
// Devuelve:
//   video_url
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

    const duration   = Math.max(1, Number(req.body.duration || 9));
    const effect     = String(req.body.effect || "zoom_in");
    const zoomSpeed  = req.body.zoom_speed || 0.0008;
    const resolution = String(req.body.output_resolution || "1920x1080");

    if (!imageUrl || !audioUrl) {
      return res.status(400).json({
        error: "Missing image or audio",
        received: {
          image: imageUrl || null,
          audio: audioUrl || null,
        },
      });
    }

    console.log("[/video] image:", imageUrl);
    console.log("[/video] audio:", audioUrl);
    console.log("[/video] duration:", duration);
    console.log("[/video] effect:", effect);
    console.log("[/video] resolution:", resolution);

    await Promise.all([
      downloadFile(imageUrl, imagePath, 120000, "image"),
      downloadFile(audioUrl, audioPath, 120000, "audio"),
    ]);

    fs.writeFileSync(textPath, textWrapped || " ", "utf8");

    const filter = getKenBurnsFilter(
      duration,
      textPath,
      effect,
      zoomSpeed,
      resolution
    );

    await runFfmpeg([
      "-y",
      "-hide_banner",

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
    });

  } catch (err) {
    console.error("[/video ERROR]", err.message);

    return res.status(500).json({
      error: "Video generation failed",
      details: err.message,
    });

  } finally {
    safeDelete([imagePath, audioPath, textPath, outputPath]);
  }
});

// ── POST /merge ───────────────────────────────────────────────
// Recibe:
//   videos → array de URLs de clips
// Devuelve:
//   final_video_url, clips_merged, duration
// ─────────────────────────────────────────────────────────────

app.post("/merge", async (req, res) => {
  const ts         = Date.now();
  const videos     = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloaded = [];
  const listPath   = `/tmp/list_${ts}.txt`;
  const outputPath = `/tmp/final_${ts}.mp4`;

  try {
    if (!videos.length) {
      return res.status(400).json({
        error: "Missing videos array",
      });
    }

    console.log(`[/merge] Descargando ${videos.length} clips...`);

    const BATCH = 10;

    for (let i = 0; i < videos.length; i += BATCH) {
      const batch = videos.slice(i, i + BATCH);
      const paths = batch.map((_, j) => `/tmp/clip_${ts}_${i + j}.mp4`);

      await Promise.all(
        batch.map((url, j) =>
          downloadFile(url, paths[j], 180000, `clip_${i + j}`)
        )
      );

      downloaded.push(...paths);

      console.log(`[/merge] ${Math.min(i + BATCH, videos.length)}/${videos.length}`);
    }

    fs.writeFileSync(
      listPath,
      downloaded.map((f) => `file '${f}'`).join("\n"),
      "utf8"
    );

    console.log("[/merge] Concatenando con stream copy...");

    await runFfmpeg([
      "-y",
      "-hide_banner",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c", "copy",
      "-movflags", "+faststart",
      outputPath,
    ]);

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

    return res.status(500).json({
      error: "Merge failed",
      details: err.message,
    });

  } finally {
    safeDelete([...downloaded, listPath, outputPath]);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ffmpeg-api v3.1 — puerto ${PORT}`);
});
