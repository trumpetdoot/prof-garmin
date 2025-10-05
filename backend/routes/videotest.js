import path from "path";
import { extractClip, extractFrame } from "./utils/video.js";

const videoPath = path.join(process.cwd(), "../assets/samplevideo.mp4");
const clipsDir = path.join(process.cwd(), "clips");
const framesDir = path.join(process.cwd(), "frames");

async function test() {
  try {
    // Step 1: Extract 30-second clip
    const clipPath = await extractClip(videoPath, 60, clipsDir); // last 30s ending at 60s
    console.log("Clip created at:", clipPath);

    // Step 2: Extract frame from clip
    const framePath = await extractFrame(clipPath, framesDir);
    console.log("Frame extracted at:", framePath);

  } catch (err) {
    console.error("Error:", err);
  }
}

test();
