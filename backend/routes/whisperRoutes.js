import express from "express";
import multer from "multer";
import { transcribeAudioController } from "../controllers/whisperController.js"

const router = express.Router();
const upload = multer({ dest: "assets/"})

router.post("/transcribe", upload.single("video"), transcribeAudioController);

export default router;