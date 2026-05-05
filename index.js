const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
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
      if (code === 0) return resolve();
      return reject(new Error(stderr || `FFmpeg exited with code ${code}`));
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

    await runFfmpeg([
      "-y",
      "-loop", "1",
      "-framerate", "25",
      "-i", imagePath,
      "-i", audioPath,

      "-filter_complex",
      `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=textfile='${textPath}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h-(text_h*4):box=1:boxcolor=black@0.55:boxborderw=20[v];[1:a]apad,atrim=0:${duration}[a]`,

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
    [imagePath, audioPath, textPath, outputPath].forEach((file) => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
