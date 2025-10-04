import { useState } from "react";
import "./UploadSuccess.css"; // Import CSS file

const UploadSuccess = () => {
  const [notes, setNotes] = useState<string[]>([
    "Definition 1: Example term",
    "Note 1: Important point",
  ]);

  const handleButtonClick = () => {
    
  };

  return (
    <div className="video-container">
      {/* Video */}
      <video className="video-player" controls autoPlay>
        <source src="/example-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for definitions / notes */}
      <div className="overlay">
        {notes.map((note, index) => (
          <div
            key={index}
            className="note"
            style={{ top: `${10 + index * 60}px` }}
          >
            {note}
          </div>
        ))}
      </div>

      {/* Button below video */}
      <div className="button-container">
        <button className="action-button" onClick={handleButtonClick}>
          Take Action
        </button>
      </div>
    </div>
  );
};

export default UploadSuccess;
