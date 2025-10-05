import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { spawn } from "child_process";

export const generateTranscript = async (clipPath) => {
  // create .m4a pathname
  const audioPath = path.join(
    path.dirname(clipPath),
    path.basename(clipPath, path.extname(clipPath)) + ".m4a"
  );

  // convert the mp4 to .m4a using ffmpeg
  await new Promise((resolve, reject) => {
    ffmpeg(clipPath)
      .noVideo()
      .audioCodec("aac")
      .save(audioPath)
      .on("end", resolve)
      .on("error", reject);
  });

  // run Whisper on the actual .m4a file
  const transcript = await new Promise((resolve, reject) => {
    const py = spawn("python3", ["routes/utils/transcribe.py", audioPath]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => (errorOutput += data.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("Whisper failed:", errorOutput);
        return reject(new Error(errorOutput));
      }

      try {
        const result = JSON.parse(output);
        resolve(result.text);
      } catch (err) {
        reject(err);
      }
    });
  });

  console.log(transcript); // testing
  return transcript;
};
