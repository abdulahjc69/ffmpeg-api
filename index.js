const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// HEALTHCHECK
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// TEST
app.get("/ping", (req, res) => {
  res.send("pong");
});

// VIDEO
app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text;
    const duration = req.body.duration || 3;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    let imagePath = "bg.png";

    // Si viene imagen subida
    if (req.file) {
      imagePath = req.file.path;
    }
    // Si viene URL (Cloudinary)
    else if (req.body.image) {
      const response = await axios({
        url: req.body.image,
        method: "GET",
        responseType: "stream",
      });

      const tempPath = "temp.png";
      const writer = fs.createWriteStream(tempPath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      imagePath = tempPath;
    }

    const output = "out.mp4";

    const safeText = text
      .substring(0, 80)
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'")
      .replace(/\n/g, " ");

    const command = `ffmpeg -y -loop 1 -i ${imagePath} -vf "scale=480:-1,drawtext=text='${safeText}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2" -t ${duration} -preset ultrafast -pix_fmt yuv420p ${output}`;

    exec(command, async (err, stdout, stderr) => {
      console.log("==== FFMPEG CMD ====");
      console.log(command);

      console.log("==== STDERR ====");
      console.log(stderr);

      console.log("==== STDOUT ====");
      console.log(stdout);

      if (err) {
        return res.status(500).send(stderr || "FFmpeg crash");
      }

      try {
        const result = await cloudinary.uploader.upload(output, {
          resource_type: "video",
        });

        // limpiar archivos
        if (fs.existsSync(output)) fs.unlinkSync(output);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        if (fs.existsSync("temp.png")) fs.unlinkSync("temp.png");

        return res.json({
          url: result.secure_url,
        });

      } catch (uploadError) {
        console.error(uploadError);
        return res.status(500).send("Upload failed");
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
