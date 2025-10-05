import { useState } from "react";
import axios from "axios";

type LectureResult = {
  clipPath: string;
  framePath?: string; // optional if you don't generate sprite
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
    <div>
      {!videoFile && (
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const files = e.target.files;
            setVideoFile(files && files.length > 0 ? files[0] : null);
          }}
          className="form-control my-3"
        />
      )}

      <button onClick={handleUpload} className="btn btn-primary">
        Generate Lecture
      </button>

      {loading && <p className="mt-3">⏳ Processing...</p>}

      {result && (
        <div className="mt-4">
          <h3>Video Clip</h3>
          <video
            src={`http://localhost:3000${result.clipPath}`}
            controls
            width="480"
          ></video>

          {result.framePath && (
            <>
              <h3 className="mt-3">Professor Sprite</h3>
              <img
                src={`http://localhost:3000${result.framePath}`}
                alt="Professor Sprite"
                width="200"
              />
            </>
          )}

          <h3 className="mt-3">Transcript</h3>
          <p>{result.transcript}</p>

          <h3 className="mt-3">Lecture Continuation</h3>
          <p>{result.script}</p>
        </div>
      )}
    </div>
  );
}
