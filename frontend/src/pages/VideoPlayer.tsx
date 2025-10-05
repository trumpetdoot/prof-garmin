import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { pdfFile, videoFile } = location.state || {};

  useEffect(() => {
    if (!pdfFile && !videoFile) {
      navigate("/", { replace: true });
    }
  }, [pdfFile, videoFile, navigate]);

  const handleClip = async () => {
    if (!videoFile || !videoRef.current) return;

    const endTime = videoRef.current.currentTime;

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("endTime", String(endTime));

    try {
      const response = await fetch("http://localhost:3000/clip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const transcriptElem = document.getElementById("transcript");
      if (transcriptElem)
        transcriptElem.innerText = data.summary || "No transcript available";
    } catch (err) {
      console.error(err);
      const transcriptElem = document.getElementById("transcript");
      if (transcriptElem)
        transcriptElem.innerText = "Error generating transcript.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Lecture Clipper MVP
        </h1>

        <video
          ref={videoRef}
          className="w-full max-w-4xl mx-auto rounded-lg shadow-md mb-6"
          controls
          key={videoFile?.name}
        >
          {videoFile && (
            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
          )}
        </video>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={handleClip}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            📹 Clip Last 30s
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            ← Back to Upload
          </button>
        </div>

        <button
          onClick={() => navigate("/lecture-ai", { state: { videoFile } })}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
        >
          🎓 Generate Lecture AI
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transcript:
          </h3>
          <div
            id="transcript"
            className="min-h-[100px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-600"
          >
            Click "Clip Last 30s" to generate transcript...
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
