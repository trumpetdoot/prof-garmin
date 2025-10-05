import { runPythonScript } from "../utils/runPython.js";
import fs from "fs";

export const transcribeAudioController = async (req, res) => {
    try {
        const audioPath = req.file.path;
        const result = await runPythonScript("python/whisper_runner.py", {}, [
            audioPath,
        ]);

        fs.unlinkSync(audioPath);
        res.json(JSON.parse(result));
    } catch (error) {
        console.error("Transcription error: ", error);
        res.status(500).json({ error: "Failed to transcribe audio"});
    }
}
