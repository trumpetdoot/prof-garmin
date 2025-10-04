import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const SAMPLE_AUDIO = path.join(__dirname, "sample-clip.mp3");

app.post("/clip", (req, res) => {
  const pythonProcess = spawn(
    "python3",
    [path.join(__dirname, "whisper_runner.py"), SAMPLE_AUDIO]
  );

  let output = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        const cleanOutput = output.trim();
        const result = JSON.parse(cleanOutput); // must be valid JSON
        res.json({
          summary: result.summary,
          source_pages: result.source_pages,
        });
      } catch (err) {
        console.error("Failed to parse Python output:", output);
        res.status(500).json({ error: "Failed to parse Python output" });
      }
    } else {
      res.status(500).json({ error: "Processing failed" });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
