const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => res.send("OK"));
app.get("/ping", (req, res) => res.send("pong"));

app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    const output = "out.mp4";

    const safeText = text
      .substring(0, 40)
      .replace(/'/g, "")
      .replace(/:/g, "")
      .replace(/\n/g, " ");

    let command;

    // 🔥 INTENTAR USAR IMAGEN
    if (req.body.image) {
      try {
        const response = await axios({
          url: req.body.image,
          method: "GET",
          responseType: "stream",
        });

        const imagePath = "temp.png";
        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        command = `ffmpeg -y -loop 1 -i ${imagePath} -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${safeText}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" -t 3 -pix_fmt yuv420p ${output}`;

      } catch (e) {
        console.log("Fallo imagen, uso fondo negro");
      }
    }

    // 🔥 FALLBACK SEGURO (NUNCA FALLA)
    if (!command) {
      command = `ffmpeg -y -f lavfi -i color=c=black:s=480x720:d=3 -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${safeText}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" -pix_fmt yuv420p ${output}`;
    }

    exec(command, async (err, stdout, stderr) => {
      if (err) {
        console.error("FFMPEG ERROR:", stderr);
        return res.status(500).send("FFmpeg crash");
      }

      try {
        const result = await cloudinary.uploader.upload(output, {
          resource_type: "video",
        });

        if (fs.existsSync(output)) fs.unlinkSync(output);
        if (fs.existsSync("temp.png")) fs.unlinkSync("temp.png");

        return res.json({
          url: result.secure_url,
        });

      } catch (uploadError) {
        console.error(uploadError);
        return res.status(500).send("Upload failed");
      }
    });

  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0");
