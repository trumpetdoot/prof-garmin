// import { useRef } from "react";
import Home from "./pages/Home";
// import FileUploader from "./components/FileUploader";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import VideoPlayer from "./pages/VideoPlayer";
import { Toaster } from "sonner";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<VideoPlayer />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
  // const videoRef = useRef(null);

  // const handleClip = async () => {
  //   // later we’ll capture last 30s audio
  //   const response = await fetch("http://localhost:3000/clip", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ message: "Clip requested" }),
  //   });
  //   const data = await response.json();
  //   console.log("Server response:", data);
  // };

  // return (
  //   // <div style={{ textAlign: "center", marginTop: "50px" }}>
  //   //   <h1>Lecture Clipper MVP</h1>
  //   //   <video ref={videoRef} className="aspect-square" controls>
  //   //     <source src="/sample-lecture.mp4" type="video/mp4" />
  //   //     Your browser does not support video.
  //   //   </video>
  //   //   <br />
  //   //   <button onClick={handleClip} style={{ marginTop: "20px" }}>
  //   //     Clip Last 30s
  //   //   </button>
  //   // </div>

  //   //prompt mp4 and textbook pdf
    
  // );
}
