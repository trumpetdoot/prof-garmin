import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { spawn } from "child_process"

export const generateTranscript = async (clipPath) => {

  // create mp3 pathname
  const audioPath = path.join(
    path.dirname(clipPath),
    path.basename(clipPath, path.extname(clipPath)) + ".mp3"
  )  


  // convert the mp4 to mp3 using ffmpeg
  await new Promise((resolve, reject) => {
    ffmpeg(clipPath)
      .noVideo()
      .audioCodec("mp3")
      .save(audioPath)
      .on("end", resolve)
      .on("error", reject);
  });

  // promise pauses the code until it finished. This ensures the script finishes
  const transcript = await new Promise((resolve, reject) => {
    // runs the python script
    const py = spawn("python3", ["transcribe.py", audioPath]);

    let output = "";
    let errorOutput = "";

    // generates the string
    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => (errorOutput += data.toString()));

    // logging and handling errors
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

  console.log(transcript); //testing only
  return transcript;

};