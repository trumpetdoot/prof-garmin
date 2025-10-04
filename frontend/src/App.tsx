import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import VideoPlayer from "./pages/VideoPlayer";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
}
