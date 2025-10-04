"use client"

import React, { useState } from 'react';
import { toast } from "sonner";
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
      // Pass files through navigation state
      navigate("/player", { 
        state: { 
          pdfFile: pdfFile, 
          videoFile: videoFile 
        } 
      });
    } else {
      toast.error("Please select both files", {
        description: "You need to upload both a PDF textbook and a video file to continue.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload PDF Textbook:
          </label>
          <div className="relative">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handlePdfChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Lecture Video (MP4):
          </label>
          <div className="relative">
            <input 
              type="file" 
              accept="video/mp4" 
              onChange={handleVideoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {(pdfFile || videoFile) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Files:</h3>
          <ul className="space-y-2">
            {pdfFile && (
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="font-medium">PDF:</span>
                <span>{pdfFile.name}</span> 
                <span className="text-gray-400">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            )}
            {videoFile && (
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">Video:</span>
                <span>{videoFile.name}</span>
                <span className="text-gray-400">({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            )}
          </ul>
        </div>
      )}

      <button 
        onClick={handleUpload}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        {pdfFile && videoFile ? "Upload Files" : "Please Select Both Files"}
      </button>
    </div>
  );
};

export default FileUploader;
