import { spawn } from "child_process";

export const uploadPDFController = async (req, res) => {
  try {
    if(!req.file) res.status(400).json({ error: "No PDF Uploaded"});

    const filePath = req.file.path;
    console.log("PDF received: ", filePath);

    const process = spawn("python3", ["./python/text_process_runner.py", filePath]);

    process.stdout.on("data", (data) => console.log(`Python: ${data}`));
    process.stderr.on("data", (data) => console.error(`Python Error: ${data}`));
    process.on("close", (code) => console.log(`Python process exited with ${code}`));

    res.json({ message: "PDF uploaded successfully", filePath, fileName: req.file.originalname });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
}