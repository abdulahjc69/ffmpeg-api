const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

// =============================
// 🎬 GENERAR VIDEO (ULTRA LIGERO)
// =============================
app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text;
    const duration = 3; // 🔥 reducimos carga

    if (!text) {
      return res.status(400).send("Missing text");
    }

    let imagePath = "bg.png";

    if (req.file) {
      imagePath = req.file.path;
    } else if (req.body.image) {
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
      .substring(0, 50) // 🔥 aún más corto
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'")
      .replace(/\n/g, " ");

    const command = `
      ffmpeg -y -loop 1 -i ${imagePath} \
      -vf "scale=480:-1,drawtext=text='${safeText}':fontcolor=white:fontsize=18:x=(w-text_w)/2:y=(h-text_h)/2" \
      -t ${duration} -preset ultrafast -pix_fmt yuv420p ${output}
    `;

    exec(command, { timeout: 20000 }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("FFmpeg crash");
      }

      res.sendFile(output, { root: __dirname });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
