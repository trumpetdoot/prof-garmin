import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import VideoPlayer from "./pages/VideoPlayer";
import LectureAI from "./pages/LectureAI";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<VideoPlayer />} />
          <Route path="/lecture-ai" element={<LectureAI />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
