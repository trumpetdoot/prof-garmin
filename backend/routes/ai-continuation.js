import express from "express";

import multer from "multer";
import fs from "fs";
import path from "path";

import { extractClip, extractFrame } from "utils/video.js";
import { generateTranscript } from "utils/transcript.js";
import { generateAISprite } from "utils/aiSprite.js";
import { generateLectureScript } from "utils/scriptGen.js";

const router = express.Router();

const clipsDir = path.join(process.cwd(), "clips");
const assetsDir = path.join(process.cwd(), "assets");
fs.mkdirSync(clipsDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: assetsDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/clip", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video uploaded" });

  try {
    const videoPath = req.file.path;
    const endTime = Number(req.body.endTime) || 0;

    // Step 1: extract 30s clip
    const clipPath = await extractClip(videoPath, endTime, clipsDir);

    // Step 2: extract a frame for sprite
    const framePath = await extractFrame(clipPath, clipsDir);

    // Step 3: generate transcript
    const transcript = await generateTranscript(clipPath);

    // Step 4: generate AI sprite
    const sprite = await generateAISprite(framePath);

    // Step 5: generate lecture continuation
    const script = await generateLectureScript(transcript, req.body.textbookRefs || []);

    res.json({
      message: "AI continuation ready",
      clipPath: `/clips/${path.basename(clipPath)}`,
      transcript,
      sprite,
      script
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;