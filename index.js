const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/video", (req, res) => {
  let text = req.body.text || "Hola mundo";

  // 🔥 ESCAPAR caracteres peligrosos
  text = text.replace(/:/g, "\\:").replace(/'/g, "\\'");

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
