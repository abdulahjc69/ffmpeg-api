const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

// CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => res.send("OK"));
app.get("/ping", (req, res) => res.send("pong"));

// VIDEO
app.post("/video", upload.none(), async (req, res) => {
  try {
    const text = req.body.text;
    const imageUrl = req.body.image;
    const audioUrl = req.body.audio;

    if (!text || !imageUrl || !audioUrl) {
      return res.status(400).send("Missing data");
    }

    // DESCARGAR IMAGEN
    const imagePath = "image.png";
    const imgRes = await axios({ url: imageUrl, responseType: "stream" });
    const imgWriter = fs.createWriteStream(imagePath);
    imgRes.data.pipe(imgWriter);
    await new Promise((r) => imgWriter.on("finish", r));

    // DESCARGAR AUDIO
    const audioPath = "audio.mp3";
    const audioRes = await axios({ url: audioUrl, responseType: "stream" });
    const audioWriter = fs.createWriteStream(audioPath);
    audioRes.data.pipe(audioWriter);
    await new Promise((r) => audioWriter.on("finish", r));

    const output = "out.mp4";

    const safeText = text
      .substring(0, 80)
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'")
      .replace(/\n/g, " ");

    const command = `
      ffmpeg -y 
      -loop 1 -i ${imagePath} 
      -i ${audioPath} 
      -vf "scale=720:-1,drawtext=text='${safeText}':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=(h-text_h)/2" 
      -c:v libx264 
      -c:a aac 
      -shortest 
      -pix_fmt yuv420p 
      ${output}
    `;

    exec(command, async (err, stdout, stderr) => {
      console.log(stderr);

      if (err) {
        return res.status(500).send(stderr);
      }

      const result = await cloudinary.uploader.upload(output, {
        resource_type: "video",
      });

      // limpiar
      [imagePath, audioPath, output].forEach((f) => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      });

      res.json({ url: result.secure_url });
    });

  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});
