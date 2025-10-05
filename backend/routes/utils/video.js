import path from "path";
import { spawn } from "child_process";

// Get video duration in seconds
export const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    // use ffprobe to grab duration
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      videoPath
    ]);

    // log to console
    let output = "";
    ffprobe.stdout.on("data", (data) => output += data.toString());
    ffprobe.on("close", (code) => {
      if (code !== 0) return reject(new Error("ffprobe failed"));
      resolve(parseFloat(output));
    });
  });
};


export const extractClip = async (videoPath, endTime = 0, clipsDir) => {
  // Get the video duration
  const duration = await getVideoDuration(videoPath);

  // Calculate clip start time: min(30, duration)
  const clipLength = Math.min(30, duration);
  const startTime = Math.max(0, duration - clipLength);

  const baseName = path.basename(videoPath, path.extname(videoPath));
  const videoClipPath = path.join(clipsDir, baseName + "-clip.mp4");
  
  return new Promise((resolve, reject) => {
    // ffmpeg is a tool for processing audio and video
    // use it here to generate the 30 second clip
    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-ss", `${startTime}`,
      "-t", `${clipLength}`,
      "-c", "copy",
      videoClipPath
    ]);

    // logging the output to terminal
    ffmpeg.stderr.on("data", (data) => console.log("FFmpeg log:", data.toString()));

    // close ffmpeg
    ffmpeg.on("close", (code) => {
      if (code !== 0) return reject(new Error("FFmpeg failed"));
      resolve(videoClipPath);
    });
  });
};

// extract a frame from the video path
export const extractFrame = async (videoPath, outputDir) => {
  const duration = await getVideoDuration(videoPath);
  const middleTime = duration / 2;

  const baseName = path.basename(videoPath, path.extname(videoPath));
  const framePath = path.join(outputDir, baseName + "-frame.png");
  
  return new Promise((resolve, reject) => {
    // use ffmpeg to generate a screenshot from the clip
    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-ss", `${middleTime}`,
      "-vframes", "1",
      framePath
    ]);

    // log ffmpeg
    ffmpeg.stderr.on("data", (data) => console.log("FFmpeg frame log:", data.toString()));

    // close ffmpeg
    ffmpeg.on("close", (code) => {
      if (code !== 0) return reject(new Error("FFmpeg failed to extract frame"));
      resolve(framePath);
    });
  });
};