// src/pages/LectureAI.tsx
import { useLocation, useNavigate } from "react-router";
import LectureUploader from "../components/LectureUploader";
import { useEffect } from "react";

export default function LectureAI() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the video file passed via navigate state
  const videoFile = location.state?.videoFile || null;

  // If no video is passed, redirect back to Home
  useEffect(() => {
    if (!videoFile) {
      navigate("/", { replace: true });
    }
  }, [videoFile, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Lecture AI Generator
        </h1>

        {/* Pass the video file to the uploader */}
        <LectureUploader initialVideoFile={videoFile} />
      </div>
    </div>
  );
}
