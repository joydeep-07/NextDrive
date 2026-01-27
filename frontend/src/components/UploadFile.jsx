import React, { useRef, useState, useEffect } from "react";
import { FiUpload, FiX, FiImage, FiTrash2 } from "react-icons/fi";

const UploadFile = () => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...previewUrls]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (activePreviewIndex === index) setActivePreviewIndex(null);
  };

  const handleCancel = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
    setUploadProgress(0);
    setIsUploading(false);
    setActivePreviewIndex(null);
  };

  const simulateUpload = (filesToUpload = selectedFiles) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log("Uploaded files:", filesToUpload);
            // ← Real upload logic here (e.g. FormData)
            handleCancel();
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleUploadAll = () => {
    if (selectedFiles.length === 0) return;
    simulateUpload();
  };

  const handleUploadSingle = (index) => {
    if (index < 0 || index >= selectedFiles.length) return;
    simulateUpload([selectedFiles[index]]);
  };

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const hasImages = previews.length > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Upload Area */}
      {!hasImages && (
        <div className="" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <div className="flex flex-col items-center space-y-4">
            <button type="button" className="primary_button">
              Select Images
            </button>
          </div>
        </div>
      )}

      {/* Previews + single upload card */}
      {hasImages && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2.5">
              <FiImage className="text-blue-600" />
              Selected Images ({previews.length})
            </h3>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((src, index) => {
              const isActive = activePreviewIndex === index;
              return (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                  onClick={() => setActivePreviewIndex(isActive ? null : index)}
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <FiX className="w-4 h-4" />
                  </button>

                  {/* Filename tag */}
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2.5 py-1 rounded-full max-w-[80%] truncate">
                    {selectedFiles[index]?.name || "image"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="secondary_button w-1/2 justify-center items-center flex"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadAll}
              disabled={isUploading}
              className="primary_button w-1/4 justify-center items-center flex"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading… {uploadProgress}%
                </>
              ) : (
                <>
                  <FiUpload />
                  Upload All {previews.length}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
