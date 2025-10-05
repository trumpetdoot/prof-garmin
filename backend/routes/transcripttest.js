import { generateTranscript } from "./utils/transcript.js";

const clipPath = "./clips/samplevideo-clip.mp4";

const runTest = async () => {
  try {
    const transcript = await generateTranscript(clipPath);
    console.log("Transcript:", transcript);
  } catch (err) {
    console.error("Error:", err);
  }
};

runTest();