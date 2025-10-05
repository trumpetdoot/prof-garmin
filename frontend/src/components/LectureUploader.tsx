import { useState } from "react";
import axios from "axios";

type LectureResult = {
  clipPath: string;
  framePath?: string;
  transcript: string;
  script: string;
};

type LectureUploaderProps = {
  initialVideoFile?: File | null;
};

export default function LectureUploader({
  initialVideoFile,
}: LectureUploaderProps) {
  const [videoFile, setVideoFile] = useState<File | null>(
    initialVideoFile || null
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LectureResult | null>(null);

  const handleUpload = async () => {
    if (!videoFile) return alert("Please select a video");

    const formData = new FormData();
    formData.append("video", videoFile);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:3000/ai-continuation/clip",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🎓 Lecture Generator
        </h1>

        {!videoFile && (
          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const files = e.target.files;
                setVideoFile(files && files.length > 0 ? files[0] : null);
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full cursor-pointer text-gray-700 text-center"
            />
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
          >
            Generate Lecture
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-700 mt-3 animate-pulse">
            ⏳ Processing...
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            {/* Video Clip */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                📹 Video Clip
              </h3>
              <video
                src={`http://localhost:3000${result.clipPath}`}
                controls
                className="w-full rounded-lg"
              ></video>
            </div>

            {/* Professor Sprite */}
            {result.framePath && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  🧑‍🏫 Professor Sprite
                </h3>
                <img
                  src={`http://localhost:3000${result.framePath}`}
                  alt="Professor Sprite"
                  className="mx-auto rounded-lg border"
                  width={200}
                />
              </div>
            )}

            {/* Transcript */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                📝 Transcript
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {result.transcript}
              </p>
            </div>

            {/* Lecture Continuation */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                📖 Lecture Continuation
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {result.script}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
