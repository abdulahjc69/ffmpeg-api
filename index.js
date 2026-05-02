const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/video", (req, res) => {
  const rawText = req.body.text || "Hola mundo";

  const text = rawText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 .,!?]/g, "");

  const output = "output.mp4";

  const command = `
  ffmpeg -y -loop 1 -framerate 1 -i bg.png -t 5 \
  -vf "scale=1280:720,drawtext=text='${text}':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -pix_fmt yuv420p ${output}
  `;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("ERROR:", stderr);
      return res.status(500).send("Error generando video");
    }

    res.download(output);
  });
});

app.get("/", (req, res) => {
  res.send("FFmpeg API funcionando");
});

app.listen(3000, () => console.log("Server running"));
