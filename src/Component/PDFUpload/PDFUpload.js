import React, { useState, useCallback } from "react";

const PDFUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setPdfFile(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Upload PDF</h2>
        <div
          className={`border-2 border-dashed ${
            isDragging ? "border-blue-500" : "border-gray-300"
          } rounded-lg p-6 text-center cursor-pointer transition-colors duration-300`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {pdfFile ? (
            <div className="flex flex-col items-center">
              <p className="text-green-600 font-semibold">
                {pdfFile.name} uploaded successfully!
              </p>
              <button
                onClick={handleRemoveFile}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
              >
                Remove File
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Drag & drop your PDF file here or
              </p>
              <label
                htmlFor="pdf-upload"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
              >
                Browse Files
              </label>
              <input
                type="file"
                id="pdf-upload"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;