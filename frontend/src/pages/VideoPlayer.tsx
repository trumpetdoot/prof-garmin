import { useNavigate } from "react-router";

async function clipSegment() {
  const response = await fetch("http://localhost:3000/clip", {
    method: "POST",
  });
  const data = await response.json();
  const transcriptElem = document.getElementById("transcript");
  if (transcriptElem) {
    transcriptElem.innerText = data.transcript;
  }
}

const VideoPlayer = () => {
  const navigate = useNavigate();

  const handleBackToUpload = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lecture Clipper MVP</h1>
          <p className="text-gray-600">Clip and transcribe important moments from your lecture</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <video 
            className="w-full max-w-4xl mx-auto rounded-lg shadow-md" 
            controls
            poster="/sample-lecture-poster.jpg"
          >
            <source src="/sample-lecture.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button 
            onClick={clipSegment}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            📹 Clip Last 30s
          </button>
          <button 
            onClick={handleBackToUpload}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Back to Upload
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcript:</h3>
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
