import { spawn } from "child_process";

export async function generateAISprite(inputImagePath, prompt) {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", [
      "spriteGen.py", // path to your Python file
      inputImagePath,
      prompt
    ]);

    let result = "";
    let error = "";

    py.stdout.on("data", (data) => (result += data.toString()));
    py.stderr.on("data", (data) => (error += data.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(error || "Python image generation failed"));
      } else {
        resolve(result.trim());
      }
    });
  });
}
