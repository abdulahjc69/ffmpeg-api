const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");

const app = express();
app.use(express.json());

// =============================
// 🎬 GENERAR VIDEO (YA LO TENÍAS)
// =============================
app.post("/video", async (req, res) => {
  const { text, image, duration = 5 } = req.body;

  if (!text) {
    return res.status(400).send("Missing text");
  }

  const output = "salida.mp4";

  const command = `
    ffmpeg -y -loop 1 -i ${image || "bg.png"} \
    -vf "drawtext=text='${text}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" \
    -t ${duration} -pix_fmt yuv420p ${output}
  `;

  exec(command, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error generating video");
    }

    res.sendFile(output, { root: __dirname });
  });
});

// =============================
// 🔥 MERGE DE VIDEOS (NUEVO)
// =============================
app.post("/merge", async (req, res) => {
  const { videos } = req.body;

  if (!videos || videos.length === 0) {
    return res.status(400).send("No videos provided");
  }

  try {
    const fileList = "files.txt";
    const localFiles = [];

    // 🔽 Descargar vídeos
    for (let i = 0; i < videos.length; i++) {
      const url = videos[i];
      const filePath = `video_${i}.mp4`;

      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      localFiles.push(filePath);
    }

    // 🔽 Crear lista para FFmpeg
    const content = localFiles.map(v => `file '${v}'`).join("\n");
    fs.writeFileSync(fileList, content);

    const output = "final.mp4";

    // 🔽 Unir vídeos
    exec(
      `ffmpeg -f concat -safe 0 -i ${fileList} -c copy ${output}`,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error merging videos");
        }

        res.sendFile(output, { root: __dirname });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing videos");
  }
});

// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
