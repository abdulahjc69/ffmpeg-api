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

async function downloadFile(url, outputPath) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 60000,
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

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `FFmpeg exited with code ${code}`));
    });
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
  files.forEach((file) => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

function getKenBurnsFilter(duration, textPath) {
  const fps = 25;
  const frames = Math.max(1, Math.ceil(duration * fps));
  const fadeOutStart = Math.max(0, duration - 0.35);
  const audioFadeOutStart = Math.max(0, duration - 0.35);

  return `
[0:v]
scale=1200:2134:force_original_aspect_ratio=increase,
crop=1200:2134,
zoompan=z='min(zoom+0.0015,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${fps},
trim=duration=${duration},
setpts=PTS-STARTPTS,
drawtext=textfile='${textPath}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h-(text_h*4):box=1:boxcolor=black@0.55:boxborderw=20,
fade=t=in:st=0:d=0.20,
fade=t=out:st=${fadeOutStart}:d=0.35
[v];
[1:a]
apad,
atrim=0:${duration},
asetpts=PTS-STARTPTS,
afade=t=in:st=0:d=0.15,
afade=t=out:st=${audioFadeOutStart}:d=0.35
[a]
`.replace(/\s+/g, "");
}

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ffmpeg-api" });
});

app.post("/video", async (req, res) => {
  const timestamp = Date.now();

  const imagePath = `/tmp/image_${timestamp}.png`;
  const audioPath = `/tmp/audio_${timestamp}.mp3`;
  const textPath = `/tmp/text_${timestamp}.txt`;
  const outputPath = `/tmp/video_${timestamp}.mp4`;

  try {
    const imageUrl = req.body.image;
    const audioUrl = req.body.audio;
    const text = cleanText(req.body.text);
    const duration = Math.max(1, Number(req.body.duration || 5));

    if (!imageUrl || !audioUrl) {
      return res.status(400).json({ error: "Missing image or audio" });
    }

    await downloadFile(imageUrl, imagePath);
    await downloadFile(audioUrl, audioPath);

    fs.writeFileSync(textPath, text || " ", "utf8");

    const filterComplex = getKenBurnsFilter(duration, textPath);

    await runFfmpeg([
      "-y",
      "-loop", "1",
      "-framerate", "25",
      "-i", imagePath,
      "-i", audioPath,

      "-filter_complex", filterComplex,

      "-map", "[v]",
      "-map", "[a]",

      "-t", String(duration),
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-threads", "2",
      "-c:a", "aac",
      "-b:a", "128k",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outputPath,
    ]);

    const upload = await cloudinary.uploader.upload(outputPath, {
      resource_type: "video",
      folder: "youtube/videos",
    });

    return res.json({
      success: true,
      video_url: upload.secure_url,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Video generation failed",
      details: error.message,
    });
  } finally {
    safeDelete([imagePath, audioPath, textPath, outputPath]);
  }
});

app.post("/merge", async (req, res) => {
  const timestamp = Date.now();

  const videos = Array.isArray(req.body.videos) ? req.body.videos : [];
  const downloadedFiles = [];
  const listPath = `/tmp/list_${timestamp}.txt`;
  const outputPath = `/tmp/final_${timestamp}.mp4`;

  try {
    if (!videos.length) {
      return res.status(400).json({ error: "Missing videos array" });
    }

    for (let i = 0; i < videos.length; i++) {
      const videoPath = `/tmp/clip_${timestamp}_${i}.mp4`;
      await downloadFile(videos[i], videoPath);
      downloadedFiles.push(videoPath);
    }

    const listContent = downloadedFiles
      .map((file) => `file '${file}'`)
      .join("\n");

    fs.writeFileSync(listPath, listContent, "utf8");

    await runFfmpeg([
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-threads", "2",
      "-c:a", "aac",
      "-b:a", "128k",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outputPath,
    ]);

    const upload = await cloudinary.uploader.upload(outputPath, {
      resource_type: "video",
      folder: "youtube/finales",
    });

    return res.json({
      success: true,
      final_video_url: upload.secure_url,
      clips_merged: videos.length,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Merge failed",
      details: error.message,
    });
  } finally {
    safeDelete([...downloadedFiles, listPath, outputPath]);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
