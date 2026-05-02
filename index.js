const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/video", (req, res) => {
  const text = req.body.text || "Hola mundo";

  const output = "output.mp4";

  const command = `
  ffmpeg -f lavfi -i color=c=black:s=1280x720:d=5 \
  -vf "drawtext=text='${text}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" \
  ${output}
  `;

  exec(command, (error) => {
    if (error) {
      return res.status(500).send("Error generando video");
    }

    res.download(output);
  });
});

app.get("/", (req, res) => {
  res.send("FFmpeg API funcionando");
});

app.listen(3000, () => console.log("Server running"));
