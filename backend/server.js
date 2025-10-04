import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Simulate saving a 30s clip
const SAMPLE_AUDIO = path.join(__dirname, "sample-clip.mp3");

app.post("/clip", (req, res) => {
  const pythonProcess = spawn(
    "python3",
    [path.join(__dirname, "whisper_runner.py"), SAMPLE_AUDIO]
  );

  let transcript = "";
  pythonProcess.stdout.on("data", (data) => {
    transcript += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Whisper error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({ transcript: transcript.trim() });
    } else {
      res.status(500).json({ error: "Transcription failed" });
    }
  });
});

app.post("/query", (req, res) => {
  const { transcript } = req.body;
  if(!transcript) return res.status(400).json({ error: "Transcript is required "});

  const py = spawn("python3", ["./query_textbook.py"]);

  let output = "";
  py.stdout.on("data", (data) => {
    output += data.toString();
  })

  py.stderr.on("data", (data) => {
    console.error("Python Error: ", data.toString())
  })
  py.on("close", (code) => {
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to parse python output"});
    }
  })

  py.stdin.write(JSON.stringify({ transcript }))
  py.stdin.end();
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
