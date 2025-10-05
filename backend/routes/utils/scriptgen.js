import { spawn } from "child_process";

export async function generateLectureScript(transcript, textbookRefs = []) {
  return new Promise((resolve, reject) => {
    const py = spawn(
      "python3",
      ["scriptGen.py", JSON.stringify(transcript), JSON.stringify(textbookRefs)]
    );

    let result = "";
    let error = "";

    py.stdout.on("data", (data) => (result += data.toString()));
    py.stderr.on("data", (data) => (error += data.toString()));

    py.on("close", (code) => {
      if (code !== 0) reject(new Error(error || "Python script failed"));
      else resolve(result.trim());
    });
  });
}
