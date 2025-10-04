import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const FileUploader = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (pdfFile && videoFile) {
      console.log('Uploading files...');

      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('video', videoFile);

      try {
        const result = await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: formData,
        });

        const data = await result.json();
        console.log(data);

        navigate("/success");
      } catch (error) {
        console.error(error);
      }

    } else {
      alert("Please upload both a PDF and a video file.");
    }
  };

  return (
    <>
      <div className="input-group">
        <label>
          Upload PDF:
          <input type="file" accept=".pdf" onChange={handlePdfChange} />
        </label>
      </div>
      
      <div className="input-group">
        <label>
          Upload Video (MP4):
          <input type="file" accept="video/mp4" onChange={handleVideoChange} />
        </label>
      </div>

      {(pdfFile || videoFile) && (
        <section>
          File details:
          <ul>
            {pdfFile && (
              <li>PDF: {pdfFile.name} ({pdfFile.size} bytes)</li>
            )}
            {videoFile && (
              <li>Video: {videoFile.name} ({videoFile.size} bytes)</li>
            )}
          </ul>
        </section>
      )}

      <button onClick={handleUpload} className="upload-files" disabled={!pdfFile || !videoFile}>
        Upload Files
      </button>
    </>
  );
};

export default FileUploader;
