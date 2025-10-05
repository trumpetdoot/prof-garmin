import express from "express";
import multer from "multer";
import { uploadPDFController } from "../controllers/textbookController.js"

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "assets/"),
    filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })

router.post("/upload", upload.single("pdf"), uploadPDFController);

export default router;
