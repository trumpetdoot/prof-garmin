import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

app.post("/clip", (req, res) => {
  console.log("Clip request received:", req.body);
  // For Phase 1 just return confirmation
  res.json({ status: "success", message: "Clip request registered!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
