import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import AiContinuation from "./routes/ai-continuation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());



// app.use("/ai-continuation", aiContinuation);



const storage = multer.diskStorage({
  destination: './assets',
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
})
const upload = multer({ storage });

app.post("/clip", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video uploaded" });

  const videoPath = req.file.path;
  const endTime = Number(req.body.endTime) || 0;
  const audioPath = videoPath.replace(/\.[^/.]+$/, ".mp3"); // mp3 output

  // Clip last 30s using ffmpeg
  const ffmpeg = spawn("ffmpeg", [
    "-i", videoPath,
    "-ss", `${Math.max(0, endTime - 30)}`,
    "-t", "30",
    "-q:a", "0",
    "-map", "a",
    audioPath
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log("FFmpeg log:", data.toString());
  });

  ffmpeg.on("close", (code) => {
    if (code !== 0) return res.status(500).json({ error: "FFmpeg failed" });

    // Call Python Whisper on clipped mp3
    const pythonProcess = spawn(
      "python3",
      [path.join(__dirname, "whisper_runner.py"), path.join(__dirname, audioPath)]
    );


    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      console.log("Whisper stdout:", data.toString());
      output += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => console.error("Python error:", data.toString()));

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          res.json(result);
        } catch (err) {
          console.error("Failed to parse Python output:", output);
          res.status(500).json({ error: "Failed to parse Python output" });
        }
      } else {
        res.status(500).json({ error: "Whisper processing failed" });
      }
    });
  });
});

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF uploaded" });
  }

  console.log("PDF uploaded:", req.file.filename);

  res.json({ 
    message: 'PDF uploaded successfully', 
    file: req.file.filename
  });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
