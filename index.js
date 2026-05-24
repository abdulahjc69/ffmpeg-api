const express    = require("express");
const axios      = require("axios");
const fs         = require("fs");
const { spawn }  = require("child_process");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(express.json({ limit: "100mb" }));
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
        "User-Agent": "Mozilla/5.0 ffmpeg-api/3.6-caballeros",
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
      else reject(new Error(stderr.slice(-5000) || `FFmpeg exit ${code}`));
    });
  });
}

function getMediaDuration(filePath) {
  return new Promise((resolve) => {
    const proc = spawn("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_format",
      filePath,
    ]);

    let out = "";

    proc.stdout.on("data", (d) => {
      out += d.toString();
    });

    proc.on("close", () => {
      try {
        const parsed = JSON.parse(out);
        const duration = parseFloat(parsed.format?.duration || 0);
        resolve(Number.isFinite(duration) && duration > 0 ? duration : null);
      } catch (_) {
        resolve(null);
      }
    });

    proc.on("error", () => resolve(null));
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

function wrapText(text, maxChars = 36, maxLines = 3) {
  const words = String(text || "").split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  let usedWords = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (testLine.length > maxChars) {
      if (line) {
        lines.push(line);
        line = word;
      } else {
        lines.push(word.slice(0, maxChars));
        line = "";
      }
    } else {
      line = testLine;
    }

    usedWords++;

    if (lines.length >= maxLines) break;
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  const wasCut = usedWords < words.length;

  if (wasCut && lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?]*$/, "") + "…";
  }

  return lines.join("\n");
}

function safeDelete(files) {
  files.forEach((f) => {
    try {
      if (f && fs.existsSync(f)) fs.unlinkSync(f);
    } catch (_) {}
  });
}

function parseResolution(resolution) {
  const parts = String(resolution || "1920x1080").split("x");
  const W = parseInt(parts[0], 10) || 1920;
  const H = parseInt(parts[1], 10) || 1080;
  return { W, H };
}

function clamp(num, min, max) {
  const n = Number(num);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function safeString(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeTextSegments(textSegments, fullText, duration) {
  let segments = [];

  if (Array.isArray(textSegments)) {
    segments = textSegments
      .map((s) => ({
        text: cleanText(s.text || s.frase || s.caption || ""),
        start: Number(s.start ?? s.inicio ?? 0),
        end: Number(s.end ?? s.fin ?? 0),
      }))
      .filter((s) => s.text && s.end > s.start);
  }

  if (!segments.length && typeof textSegments === "string") {
    try {
      const parsed = JSON.parse(textSegments);
      if (Array.isArray(parsed)) {
        segments = parsed
          .map((s) => ({
            text: cleanText(s.text || s.frase || s.caption || ""),
            start: Number(s.start ?? s.inicio ?? 0),
            end: Number(s.end ?? s.fin ?? 0),
          }))
          .filter((s) => s.text && s.end > s.start);
      }
    } catch (_) {}
  }

  if (segments.length) {
    return segments.map((s) => ({
      text: s.text,
      start: clamp(s.start, 0, duration),
      end: clamp(s.end, 0.1, duration),
    }));
  }

  const text = cleanText(fullText);

  if (!text) {
    return [{ text: " ", start: 0.4, end: Math.max(1, duration - 0.4) }];
  }

  const words = text.split(" ").filter(Boolean);

  if (words.length <= 8) {
    return [{ text, start: Math.min(0.8, duration * 0.12), end: Math.max(1.4, duration - 0.8) }];
  }

  const chunks = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > 48) {
      if (current) chunks.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) chunks.push(current);

  const maxSegments = Math.max(1, Math.min(6, Math.ceil(duration / 3)));
  const finalChunks = chunks.slice(0, maxSegments);

  const safeStart = 0.45;
  const safeEnd = Math.max(safeStart + 0.5, duration - 0.35);
  const available = safeEnd - safeStart;
  const each = available / finalChunks.length;

  return finalChunks.map((chunk, i) => ({
    text: chunk,
    start: safeStart + i * each,
    end: Math.min(safeEnd, safeStart + (i + 1) * each - 0.10),
  }));
}

function createTextSegmentFiles(ts, segments) {
  return segments.map((seg, index) => {
    const path = `/tmp/txt_${ts}_${index}.txt`;
    const text = wrapText(seg.text, 34, 2);
    fs.writeFileSync(path, text || " ", "utf8");
    return { ...seg, path };
  });
}

// ─────────────────────────────────────────────────────────────
// MOVIMIENTOS DE CÁMARA
// ─────────────────────────────────────────────────────────────

function getZoomPanExpression(effect, frames, speed) {
  const safeEffect = String(effect || "zoom_in");

  const zpMap = {
    zoom_in:     `z='min(1+on*${speed},1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    zoom_out:    `z='max(1.12-on*${speed},1.00)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    push_in:     `z='min(1+on*${speed * 1.25},1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    pull_out:    `z='max(1.14-on*${speed * 1.10},1.00)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
    pan_left:    `z=1.10:x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)'`,
    pan_right:   `z=1.10:x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)'`,
    pan_up:      `z=1.10:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/${frames})'`,
    pan_down:    `z=1.10:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(on/${frames})'`,
    diagonal_in: `z='min(1+on*${speed},1.12)':x='(iw-iw/zoom)*(1-on/${frames})*0.7':y='(ih-ih/zoom)*(1-on/${frames})*0.7'`,
    diagonal_out:`z='max(1.12-on*${speed},1.00)':x='(iw-iw/zoom)*(on/${frames})*0.7':y='(ih-ih/zoom)*(on/${frames})*0.7'`,
  };

  return zpMap[safeEffect] || zpMap.zoom_in;
}

function getKenBurnsFilter(duration, textPath, effect, zoomSpeed, resolution) {
  const fps    = 24;
  const frames = Math.max(1, Math.ceil(duration * fps));
  const fadeInDur  = 0.35;
  const fadeOutDur = Math.min(0.65, Math.max(0.25, duration * 0.12));
  const fadeOut    = Math.max(0, duration - fadeOutDur);
  const speed = parseFloat(zoomSpeed) || 0.0005;
  const { W, H } = parseResolution(resolution);
  const fontSize  = Math.max(30, Math.min(48, Math.floor(W / 44)));
  const boxBorder = Math.max(14, Math.floor(fontSize * 0.45));
  const bottomPad = Math.max(70, Math.floor(H * 0.075));

  const zp = getZoomPanExpression(effect, frames, speed) + `:d=${frames}:s=${W}x${H}:fps=${fps}`;

  return (
    `[0:v]` +
      `scale=${W}:${H}:force_original_aspect_ratio=increase,` +
      `crop=${W}:${H},` +
      `zoompan=${zp},` +
      `trim=duration=${duration},setpts=PTS-STARTPTS,` +
      `drawtext=textfile='${textPath}'` +
        `:fontcolor=white:fontsize=${fontSize}:line_spacing=10` +
        `:x=(w-text_w)/2:y=h-text_h-${bottomPad}` +
        `:box=1:boxcolor=black@0.55:boxborderw=${boxBorder}` +
        `:shadowcolor=black@0.85:shadowx=2:shadowy=2,` +
      `fade=t=in:st=0:d=${fadeInDur},` +
      `fade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
    `[v];` +
    `[1:a]` +
      `apad,atrim=0:${duration},asetpts=PTS-STARTPTS,volume=1.6,` +
      `afade=t=in:st=0:d=${fadeInDur},afade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
    `[a]`
  );
}

function buildDrawTextChain(inputLabel, outputLabel, segmentFiles, W, H, duration) {
  const fontSize  = Math.max(34, Math.min(58, Math.floor(W / 38)));
  const boxBorder = Math.max(10, Math.floor(fontSize * 0.34));
  const bottomPad = Math.max(86, Math.floor(H * 0.09));
  let current = inputLabel;
  let chain = "";

  segmentFiles.forEach((seg, index) => {
    const next = index === segmentFiles.length - 1 ? outputLabel : `vtxt${index}`;
    const start = Number(seg.start || 0).toFixed(2);
    const end   = Number(seg.end || duration).toFixed(2);

    chain +=
      `[${current}]` +
      `drawtext=textfile='${seg.path}'` +
        `:font='DejaVu Serif':fontcolor=white:fontsize=${fontSize}:line_spacing=9` +
        `:x=(w-text_w)/2:y=h-text_h-${bottomPad}` +
        `:box=1:boxcolor=black@0.28:boxborderw=${boxBorder}` +
        `:shadowcolor=black@0.95:shadowx=3:shadowy=3` +
        `:enable='between(t,${start},${end})'` +
      `[${next}];`;

    current = next;
  });

  return chain;
}

function getOverlayColor(visualOverlay) {
  const map = {
    light_dust: "0xC9A46A", light_rain: "0x7F8FA6", soft_fog: "0xDDE1DF",
    warm_vignette: "0xB98245", parchment_grain: "0xC2A06B", candle_flicker: "0xD08A32",
    stone_shadow: "0x3B3B3B", birds_shadow: "0x202020", cloud_movement: "0xAEB8C2",
    old_film_grain: "0xB89B6B",
  };
  return map[String(visualOverlay || "none")] || null;
}

function buildVisualOverlayChain(inputLabel, outputLabel, W, H, duration, visualOverlay, overlayIntensity) {
  const key = String(visualOverlay || "none");
  const intensity = clamp(Number(overlayIntensity || 0), 0, 0.25);

  if (key === "none" || intensity <= 0) return `[${inputLabel}]copy[${outputLabel}];`;

  const color = getOverlayColor(key);
  if (!color) return `[${inputLabel}]copy[${outputLabel}];`;

  const alpha = intensity.toFixed(3);
  let chain = "";

  chain += `color=c=${color}:s=${W}x${H}:d=${duration},format=rgba,colorchannelmixer=aa=${alpha}[vov];`;
  chain += `[${inputLabel}][vov]overlay=0:0:format=auto[vovbase];`;

  if (key === "light_rain") {
    chain += `[vovbase]noise=alls=5:allf=t+u,eq=brightness=-0.015:saturation=0.88[${outputLabel}];`;
  } else if (key === "light_dust") {
    chain += `[vovbase]noise=alls=7:allf=t+u,eq=brightness=0.012:saturation=0.92[${outputLabel}];`;
  } else if (key === "soft_fog") {
    chain += `[vovbase]boxblur=luma_radius=1:luma_power=1:chroma_radius=1:chroma_power=1[${outputLabel}];`;
  } else if (key === "parchment_grain" || key === "old_film_grain") {
    chain += `[vovbase]noise=alls=8:allf=t+u,eq=contrast=1.04:saturation=0.82[${outputLabel}];`;
  } else if (key === "candle_flicker") {
    chain += `[vovbase]eq=brightness=0.025:saturation=1.04[${outputLabel}];`;
  } else if (key === "stone_shadow" || key === "birds_shadow") {
    chain += `[vovbase]eq=brightness=-0.025:contrast=1.05:saturation=0.9[${outputLabel}];`;
  } else if (key === "cloud_movement") {
    chain += `[vovbase]eq=brightness=0.01:saturation=0.9[${outputLabel}];`;
  } else if (key === "warm_vignette") {
    chain += `[vovbase]vignette=PI/4[${outputLabel}];`;
  } else {
    chain += `[vovbase]copy[${outputLabel}];`;
  }

  return chain;
}

function buildAudioMixChain(duration, audioPlan) {
  const fadeInDur  = 0.35;
  const fadeOutDur = Math.min(0.75, Math.max(0.30, duration * 0.12));
  const fadeOut    = Math.max(0, duration - fadeOutDur);
  const labels = [];
  let chain = "";

  chain += `[1:a]apad,atrim=0:${duration},asetpts=PTS-STARTPTS,volume=1.35,afade=t=in:st=0:d=${fadeInDur},afade=t=out:st=${fadeOut}:d=${fadeOutDur}[voice];`;
  labels.push("[voice]");

  if (audioPlan.ambientIndex !== null) {
    const vol = clamp(audioPlan.ambientVolume, 0.00, 0.20).toFixed(3);
    chain += `[${audioPlan.ambientIndex}:a]aloop=loop=-1:size=2147483647,atrim=0:${duration},asetpts=PTS-STARTPTS,volume=${vol},afade=t=in:st=0:d=0.6,afade=t=out:st=${Math.max(0, duration - 0.8)}:d=0.8[amb];`;
    labels.push("[amb]");
  }

  if (audioPlan.sfxIndex !== null) {
    const vol = clamp(audioPlan.sfxVolume, 0.00, 0.14).toFixed(3);
    chain += `[${audioPlan.sfxIndex}:a]adelay=700|700,apad,atrim=0:${duration},asetpts=PTS-STARTPTS,volume=${vol},afade=t=in:st=0.7:d=0.25,afade=t=out:st=${Math.max(0, duration - 0.7)}:d=0.5[sfx];`;
    labels.push("[sfx]");
  }

  if (audioPlan.musicIndex !== null) {
    const vol = clamp(audioPlan.musicVolume, 0.00, 0.10).toFixed(3);
    chain += `[${audioPlan.musicIndex}:a]aloop=loop=-1:size=2147483647,atrim=0:${duration},asetpts=PTS-STARTPTS,volume=${vol},afade=t=in:st=0:d=0.8,afade=t=out:st=${Math.max(0, duration - 0.9)}:d=0.9[mus];`;
    labels.push("[mus]");
  }

  if (labels.length === 1) {
    chain += `[voice]aformat=sample_rates=44100:channel_layouts=stereo[a]`;
  } else {
    chain += labels.join("") + `amix=inputs=${labels.length}:duration=longest:dropout_transition=0,volume=1.0,alimiter=limit=0.92,aformat=sample_rates=44100:channel_layouts=stereo[a]`;
  }

  return chain;
}

function getCinematicVideoFilter(duration, segmentFiles, effect, zoomSpeed, resolution, visualOverlay, overlayIntensity, transitionIn, transitionOut, transitionDuration, audioPlan) {
  const fps    = 24;
  const frames = Math.max(1, Math.ceil(duration * fps));
  const requestedTransitionDuration = clamp(Number(transitionDuration || 1.0), 0.4, 1.5);
  const fadeInDur  = requestedTransitionDuration;
  const fadeOutDur = Math.min(requestedTransitionDuration, Math.max(0.35, duration * 0.18));
  const fadeOut = Math.max(0, duration - fadeOutDur);
  const speed = parseFloat(zoomSpeed) || 0.00055;
  const { W, H } = parseResolution(resolution);
  const zp = getZoomPanExpression(effect, frames, speed) + `:d=${frames}:s=${W}x${H}:fps=${fps}`;

  let filter = "";

  filter += `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},zoompan=${zp},trim=duration=${duration},setpts=PTS-STARTPTS,eq=contrast=1.06:brightness=-0.025:saturation=0.92,noise=alls=3:allf=t+u,vignette=PI/5[vbase];`;
  filter += buildVisualOverlayChain("vbase", "vatmo", W, H, duration, visualOverlay, overlayIntensity);
  filter += buildDrawTextChain("vatmo", "vtext", segmentFiles, W, H, duration);
  filter += `[vtext]fade=t=in:st=0:d=${fadeInDur},fade=t=out:st=${fadeOut}:d=${fadeOutDur}[v];`;
  filter += buildAudioMixChain(duration, audioPlan);

  return filter;
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "ffmpeg-api",
    version: "3.6-caballeros-sin-blanca",
    endpoints: ["/video", "/video-cinematic", "/video-dialogue", "/merge", "/merge-cinematic"],
  });
});

// ─────────────────────────────────────────────────────────────
// POST /video
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
    const textWrapped  = wrapText(textOriginal, 36, 3);
    const durationRequested = Math.max(1, Number(req.body.duration || 18));
    const effect      = String(req.body.effect || "zoom_in");
    const zoomSpeed   = req.body.zoom_speed || 0.0005;
    const resolution  = String(req.body.output_resolution || "1920x1080");

    if (!imageUrl || !audioUrl) {
      return res.status(400).json({ error: "Missing image or audio" });
    }

    await Promise.all([
      downloadFile(imageUrl, imagePath, 120000, "image"),
      downloadFile(audioUrl, audioPath, 120000, "audio"),
    ]);

    const audioDuration = await getMediaDuration(audioPath);
    const duration = audioDuration ? Math.max(durationRequested, audioDuration + 0.8) : durationRequested;

    fs.writeFileSync(textPath, textWrapped || " ", "utf8");

    const filter = getKenBurnsFilter(duration, textPath, effect, zoomSpeed, resolution);

    await runFfmpeg([
      "-y", "-hide_banner",
      "-loop", "1", "-framerate", "24", "-i", imagePath,
      "-i", audioPath,
      "-filter_complex", filter,
      "-map", "[v]", "-map", "[a]",
      "-t", String(duration),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-threads", "0",
      "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      outputPath,
    ]);

    const upload = await uploadToCloudinary(outputPath, "youtube/videos");

    return res.json({
      success: true,
      url: upload.secure_url || upload.url,
      video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      duration: upload.duration,
    });

  } catch (err) {
    console.error("[/video ERROR]", err.message);
    return res.status(500).json({ error: "Video generation failed", details: err.message });
  } finally {
    safeDelete([imagePath, audioPath, textPath, outputPath]);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /video-cinematic
// ─────────────────────────────────────────────────────────────

app.post("/video-cinematic", async (req, res) => {
  const ts = Date.now();
  const imagePath   = `/tmp/img_cinematic_${ts}.jpg`;
  const audioPath   = `/tmp/aud_cinematic_${ts}.mp3`;
  const ambientPath = `/tmp/amb_cinematic_${ts}.mp3`;
  const sfxPath     = `/tmp/sfx_cinematic_${ts}.mp3`;
  const musicPath   = `/tmp/mus_cinematic_${ts}.mp3`;
  const outputPath  = `/tmp/vid_cinematic_${ts}.mp4`;
  let textFiles = [];
  const downloadedOptionalFiles = [];

  try {
    const { image: imageUrl, audio: audioUrl } = req.body;
    const textOriginal = cleanText(req.body.text);
    const screenText   = cleanText(req.body.texto_en_pantalla || req.body.screen_text || "");
    const durationRequested = Math.max(1, Number(req.body.duration || 18));
    const effect     = String(req.body.effect || "zoom_in");
    const zoomSpeed  = req.body.zoom_speed || 0.00055;
    const resolution = String(req.body.output_resolution || "1920x1080");
    const ambientUrl = safeString(req.body.ambient_audio || req.body.ambiente_audio || "");
    const sfxUrl     = safeString(req.body.sfx_audio || req.body.efecto_audio || "");
    const musicUrl   = safeString(req.body.music_audio || req.body.musica_audio || "");
    const ambientVolume  = clamp(Number(req.body.ambient_volume || 0.10), 0, 0.20);
    const sfxVolume      = clamp(Number(req.body.sfx_volume || 0), 0, 0.14);
    const musicVolume    = clamp(Number(req.body.music_volume || 0), 0, 0.10);
    const visualOverlay  = safeString(req.body.visual_overlay || "none", "none");
    const overlayIntensity  = clamp(Number(req.body.overlay_intensity || 0), 0, 0.25);
    const transitionIn   = safeString(req.body.transition_in || "fade_from_black_soft");
    const transitionOut  = safeString(req.body.transition_out || "crossfade_slow");
    const transitionDuration = clamp(Number(req.body.transition_duration || 1.0), 0.4, 1.5);

    if (!imageUrl || !audioUrl) {
      return res.status(400).json({ error: "Missing image or audio" });
    }

    const downloads = [
      downloadFile(imageUrl, imagePath, 120000, "image"),
      downloadFile(audioUrl, audioPath, 120000, "voice_audio"),
    ];

    let nextInputIndex = 2;
    const audioPlan = {
      ambientIndex: null, sfxIndex: null, musicIndex: null,
      ambientVolume, sfxVolume, musicVolume,
    };

    if (ambientUrl) {
      audioPlan.ambientIndex = nextInputIndex++;
      downloads.push(downloadFile(ambientUrl, ambientPath, 120000, "ambient_audio"));
      downloadedOptionalFiles.push(ambientPath);
    }

    if (sfxUrl && sfxVolume > 0) {
      audioPlan.sfxIndex = nextInputIndex++;
      downloads.push(downloadFile(sfxUrl, sfxPath, 120000, "sfx_audio"));
      downloadedOptionalFiles.push(sfxPath);
    }

    if (musicUrl && musicVolume > 0) {
      audioPlan.musicIndex = nextInputIndex++;
      downloads.push(downloadFile(musicUrl, musicPath, 120000, "music_audio"));
      downloadedOptionalFiles.push(musicPath);
    }

    await Promise.all(downloads);

    const audioDuration = await getMediaDuration(audioPath);
    const duration = audioDuration ? Math.max(durationRequested, audioDuration + 0.8) : durationRequested;

    const textForScreen = screenText || textOriginal;
    const segments = normalizeTextSegments(req.body.text_segments, textForScreen, duration);
    textFiles = createTextSegmentFiles(ts, segments);

    const args = ["-y", "-hide_banner", "-loop", "1", "-framerate", "24", "-i", imagePath, "-i", audioPath];

    if (audioPlan.ambientIndex !== null) args.push("-i", ambientPath);
    if (audioPlan.sfxIndex !== null) args.push("-i", sfxPath);
    if (audioPlan.musicIndex !== null) args.push("-i", musicPath);

    const filter = getCinematicVideoFilter(duration, textFiles, effect, zoomSpeed, resolution, visualOverlay, overlayIntensity, transitionIn, transitionOut, transitionDuration, audioPlan);

    args.push(
      "-filter_complex", filter,
      "-map", "[v]", "-map", "[a]",
      "-t", String(duration),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-threads", "0",
      "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      outputPath
    );

    await runFfmpeg(args);

    const upload = await uploadToCloudinary(outputPath, "youtube/videos");

    return res.json({
      success: true,
      url: upload.secure_url || upload.url,
      video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      duration: upload.duration,
      mode: "video_cinematic_v3_6",
    });

  } catch (err) {
    console.error("[/video-cinematic ERROR]", err.message);
    return res.status(500).json({ error: "Cinematic video generation failed", details: err.message });
  } finally {
    safeDelete([imagePath, audioPath, ambientPath, sfxPath, musicPath, outputPath, ...downloadedOptionalFiles, ...textFiles.map((t) => t.path)]);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /video-dialogue ← NUEVO ENDPOINT PARA CABALLEROS SIN BLANCA
//
// Crea un vídeo de diálogo con dos voces (Don Quijote y Sancho)
// sobre una imagen estática con efecto Ken Burns cinematográfico.
//
// Parámetros:
//   image          URL de la imagen (DALL-E o Cloudinary)
//   audio_quijote  URL del audio de Don Quijote (ElevenLabs)
//   audio_sancho   URL del audio de Sancho Panza (ElevenLabs)
//   resolution     opcional, default "1920x1080"
//   effect         opcional, default "zoom_in"
//   cloudinary_folder  opcional, default "caballeros_sin_blanca/finales"
// ─────────────────────────────────────────────────────────────

app.post("/video-dialogue", async (req, res) => {
  const ts = Date.now();

  const imagePath   = `/tmp/img_dlg_${ts}.jpg`;
  const audio1Path  = `/tmp/aud1_dlg_${ts}.mp3`;
  const audio2Path  = `/tmp/aud2_dlg_${ts}.mp3`;
  const mixedPath   = `/tmp/mixed_dlg_${ts}.mp3`;
  const outputPath  = `/tmp/vid_dlg_${ts}.mp4`;

  try {
    const imageUrl    = safeString(req.body.image || "");
    const audioQ      = safeString(req.body.audio_quijote || "");
    const audioS      = safeString(req.body.audio_sancho || "");
    const resolution  = String(req.body.resolution || req.body.output_resolution || "1920x1080");
    const effect      = String(req.body.effect || "zoom_in");
    const folder      = String(req.body.cloudinary_folder || "caballeros_sin_blanca/finales");

    if (!imageUrl || !audioQ) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios: image y audio_quijote",
        received: { image: imageUrl || null, audio_quijote: audioQ || null }
      });
    }

    console.log("[/video-dialogue] image:", imageUrl);
    console.log("[/video-dialogue] audio_quijote:", audioQ);
    console.log("[/video-dialogue] audio_sancho:", audioS || "none");
    console.log("[/video-dialogue] resolution:", resolution);
    console.log("[/video-dialogue] effect:", effect);

    // Descargar imagen y audio de Quijote
    const downloads = [
      downloadFile(imageUrl, imagePath, 120000, "image"),
      downloadFile(audioQ, audio1Path, 120000, "audio_quijote"),
    ];

    if (audioS) {
      downloads.push(downloadFile(audioS, audio2Path, 120000, "audio_sancho"));
    }

    await Promise.all(downloads);

    // Obtener duraciones individuales
    const durQ = await getMediaDuration(audio1Path);
    console.log("[/video-dialogue] duracion quijote:", durQ);

    let totalAudioDuration = durQ || 30;

    if (audioS) {
      const durS = await getMediaDuration(audio2Path);
      console.log("[/video-dialogue] duracion sancho:", durS);

      // Concatenar ambas voces en secuencia: Quijote habla, luego Sancho
      // Pequeña pausa de 0.3s entre voces para naturalidad
      await runFfmpeg([
        "-y", "-hide_banner",
        "-i", audio1Path,
        "-i", audio2Path,
        "-filter_complex",
          `[0:a]apad=pad_dur=0.3[a1];` +
          `[a1][1:a]concat=n=2:v=0:a=1[aout]`,
        "-map", "[aout]",
        "-c:a", "aac",
        "-b:a", "160k",
        "-ar", "44100",
        mixedPath
      ]);

      totalAudioDuration = (durQ || 0) + (durS || 0) + 0.3;
    } else {
      // Solo voz de Quijote
      await runFfmpeg([
        "-y", "-hide_banner",
        "-i", audio1Path,
        "-c:a", "aac",
        "-b:a", "160k",
        "-ar", "44100",
        mixedPath
      ]);
    }

    const finalMixedDuration = await getMediaDuration(mixedPath);
    const duration = Math.max(totalAudioDuration + 0.8, finalMixedDuration ? finalMixedDuration + 0.8 : 30);

    console.log("[/video-dialogue] duracion total audio:", totalAudioDuration);
    console.log("[/video-dialogue] duracion video final:", duration);

    const { W, H } = parseResolution(resolution);
    const fps    = 24;
    const frames = Math.max(1, Math.ceil(duration * fps));
    const speed  = 0.00045;

    const fadeInDur  = 0.8;
    const fadeOutDur = Math.min(1.0, Math.max(0.5, duration * 0.08));
    const fadeOut    = Math.max(0, duration - fadeOutDur);

    const zp =
      getZoomPanExpression(effect, frames, speed) +
      `:d=${frames}:s=${W}x${H}:fps=${fps}`;

    // Filtro cinematográfico: Ken Burns + grano + viñeta + fades
    const filter =
      `[0:v]` +
        `scale=${W}:${H}:force_original_aspect_ratio=increase,` +
        `crop=${W}:${H},` +
        `zoompan=${zp},` +
        `trim=duration=${duration},setpts=PTS-STARTPTS,` +
        `eq=contrast=1.06:brightness=-0.025:saturation=0.92,` +
        `noise=alls=3:allf=t+u,` +
        `vignette=PI/5,` +
        `fade=t=in:st=0:d=${fadeInDur},` +
        `fade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
      `[v];` +
      `[1:a]` +
        `apad,` +
        `atrim=0:${duration},` +
        `asetpts=PTS-STARTPTS,` +
        `volume=1.4,` +
        `afade=t=in:st=0:d=${fadeInDur},` +
        `afade=t=out:st=${fadeOut}:d=${fadeOutDur}` +
      `[a]`;

    await runFfmpeg([
      "-y", "-hide_banner",
      "-loop", "1", "-framerate", "24", "-i", imagePath,
      "-i", mixedPath,
      "-filter_complex", filter,
      "-map", "[v]",
      "-map", "[a]",
      "-t", String(duration),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-threads", "0",
      "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      outputPath
    ]);

    console.log("[/video-dialogue] Subiendo a Cloudinary folder:", folder);

    const upload = await uploadToCloudinary(outputPath, folder);

    console.log("[/video-dialogue] Subida completada:", upload.secure_url);

    return res.json({
      success: true,
      url: upload.secure_url || upload.url,
      video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      bytes: upload.bytes,
      duration: upload.duration,
      duration_quijote: durQ,
      audio_sancho_included: !!audioS,
      mode: "video_dialogue_v1_caballeros",
    });

  } catch (err) {
    console.error("[/video-dialogue ERROR]", err.message);
    return res.status(500).json({
      error: "Video dialogue generation failed",
      details: err.message
    });
  } finally {
    safeDelete([imagePath, audio1Path, audio2Path, mixedPath, outputPath]);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /merge
// ─────────────────────────────────────────────────────────────

app.post("/merge", async (req, res) => {
  const ts         = Date.now();
  const videos     = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloaded = [];
  const listPath   = `/tmp/list_${ts}.txt`;
  const outputPath = `/tmp/final_${ts}.mp4`;

  try {
    if (!videos.length) {
      return res.status(400).json({ error: "Missing videos array" });
    }

    const BATCH = 10;

    for (let i = 0; i < videos.length; i += BATCH) {
      const batch = videos.slice(i, i + BATCH);
      const paths = batch.map((_, j) => `/tmp/clip_${ts}_${i + j}.mp4`);
      await Promise.all(batch.map((url, j) => downloadFile(url, paths[j], 180000, `clip_${i + j}`)));
      downloaded.push(...paths);
    }

    fs.writeFileSync(listPath, downloaded.map((f) => `file '${f}'`).join("\n"), "utf8");

    await runFfmpeg([
      "-y", "-hide_banner",
      "-f", "concat", "-safe", "0", "-i", listPath,
      "-c", "copy", "-movflags", "+faststart",
      outputPath,
    ]);

    const upload = await uploadToCloudinary(outputPath, "youtube/finales");

    return res.json({
      success: true,
      url: upload.secure_url || upload.url,
      final_video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      clips_merged: videos.length,
      duration: upload.duration,
    });

  } catch (err) {
    console.error("[/merge ERROR]", err.message);
    return res.status(500).json({ error: "Merge failed", details: err.message });
  } finally {
    safeDelete([...downloaded, listPath, outputPath]);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /merge-cinematic
// ─────────────────────────────────────────────────────────────

app.post("/merge-cinematic", async (req, res) => {
  const ts = Date.now();
  const videos     = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloaded = [];
  const outputPath = `/tmp/final_cinematic_${ts}.mp4`;

  try {
    if (!videos.length) {
      return res.status(400).json({ error: "Missing videos array" });
    }

    for (let i = 0; i < videos.length; i++) {
      const path = `/tmp/cinematic_clip_${ts}_${i}.mp4`;
      await downloadFile(videos[i], path, 180000, `cinematic_clip_${i}`);
      downloaded.push(path);
    }

    if (downloaded.length === 1) {
      await runFfmpeg([
        "-y", "-hide_banner", "-i", downloaded[0],
        "-c", "copy", "-movflags", "+faststart",
        outputPath,
      ]);
    } else {
      const durations = [];
      for (const file of downloaded) {
        const d = await getMediaDuration(file);
        durations.push(d || 18);
      }

      const requestedTransition = Number(req.body.transition_duration || 0.6);
      const shortest = Math.min(...durations);
      const transitionDuration = Math.min(Math.max(0.3, requestedTransition), 0.85, Math.max(0.25, shortest / 3));

      const allowedTransitions = new Set(["fade", "smoothleft", "smoothright", "fadeblack"]);
      const transitionType = allowedTransitions.has(String(req.body.transition || "fade"))
        ? String(req.body.transition || "fade")
        : "fade";

      const W = 1920, H = 1080, fps = 24;
      const args = ["-y", "-hide_banner"];

      for (const file of downloaded) args.push("-i", file);

      const filters = [];

      for (let i = 0; i < downloaded.length; i++) {
        filters.push(`[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${fps},format=yuv420p,setpts=PTS-STARTPTS,setsar=1[v${i}]`);
        filters.push(`[${i}:a]aresample=44100,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,asetpts=PTS-STARTPTS[a${i}]`);
      }

      let lastV = "v0", lastA = "a0";
      let cumulative = durations[0] || 18;

      for (let i = 1; i < downloaded.length; i++) {
        const offset = Math.max(0.1, cumulative - transitionDuration).toFixed(3);
        filters.push(`[${lastV}][v${i}]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=${offset}[vx${i}]`);
        filters.push(`[${lastA}][a${i}]acrossfade=d=${transitionDuration}:c1=tri:c2=tri[ax${i}]`);
        lastV = `vx${i}`;
        lastA = `ax${i}`;
        cumulative += (durations[i] || 18) - transitionDuration;
      }

      args.push(
        "-filter_complex", filters.join(";"),
        "-map", `[${lastV}]`, "-map", `[${lastA}]`,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "25",
        "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        outputPath
      );

      await runFfmpeg(args);
    }

    const upload = await uploadToCloudinary(outputPath, "youtube/finales");

    return res.json({
      success: true,
      url: upload.secure_url || upload.url,
      final_video_url: upload.secure_url || upload.url,
      public_id: upload.public_id,
      clips_merged: videos.length,
      duration: upload.duration,
      mode: "cinematic_xfade_v3_6",
    });

  } catch (err) {
    console.error("[/merge-cinematic ERROR]", err.message);
    return res.status(500).json({ error: "Cinematic merge failed", details: err.message });
  } finally {
    safeDelete([...downloaded, outputPath]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ffmpeg-api v3.6-caballeros-sin-blanca — puerto ${PORT}`);
});
