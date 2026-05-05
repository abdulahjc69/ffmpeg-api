const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(express.json());
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

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr));
    });
  });
}

function cleanText(text) {
  return String(text || "")
    .replace(/\n/g, " ")
    .trim();
}

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/video", async (req, res) => {
  try {
    const imageUrl = req.body.image;
    const audioUrl = req.body.audio;
    const text = cleanText(req.body.text);
    const duration = Number(req.body.duration || 5);

    if (!imageUrl || !audioUrl) {
      return res.status(400).json({ error: "Missing image or audio" });
    }

    const workDir = "/tmp";
    const timestamp = Date.now();

    const imagePath = path.join(workDir, `image_${timestamp}.png`);
    const audioPath = path.join(workDir, `audio_${timestamp}.mp3`);
    const textPath = path.join(workDir, `text_${timestamp}.txt`);
    const outputPath = path.join(workDir, `video_${timestamp}.mp4`);

    await downloadFile(imageUrl, imagePath);
    await downloadFile(audioUrl, audioPath);

    fs.writeFileSync(textPath, text, "utf8");

    await runFfmpeg([
      "-y",
      "-loop", "1",
      "-i", imagePath,
      "-i", audioPath,
      "-t", String(duration),
      "-vf",
      `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=textfile=${textPath}:fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h-(text_h*4):box=1:boxcolor=black@0.45:boxborderw=20`,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-pix_fmt", "yuv420p",
      "-shortest",
      outputPath,
    ]);

    const upload = await cloudinary.uploader.upload(outputPath, {
      resource_type: "video",
      folder: "youtube/videos",
    });

    fs.unlinkSync(imagePath);
    fs.unlinkSync(audioPath);
    fs.unlinkSync(textPath);
    fs.unlinkSync(outputPath);

    res.json({
      success: true,
      video_url: upload.secure_url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
