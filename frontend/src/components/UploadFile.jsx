import React, { useRef, useState, useEffect } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import axios from "axios";
import { FILE_ENDPOINTS } from "../api/endpoint"; 

const UploadFile = ({ onPreviewChange, folderId = null }) => {
  const fileInputRef = useRef(null);

  // Store files + previews together to avoid index bugs
  const [items, setItems] = useState([]); // [{ file, url }]

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);

  /* ------------------------------
     Notify parent automatically
  ------------------------------ */
  useEffect(() => {
    onPreviewChange?.(items.length > 0);
  }, [items, onPreviewChange]);

  /* ------------------------------
     Cleanup object URLs on unmount
  ------------------------------ */
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [items]);

  /* ------------------------------
     Handlers
  ------------------------------ */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });

    setActivePreviewIndex(null);
  };

  const handleCancel = () => {
    setItems((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });

    setIsUploading(false);
    setUploadProgress(0);
    setActivePreviewIndex(null);
  };

  /* ------------------------------
     REAL Upload (Multer + GridFS)
  ------------------------------ */
  const uploadFiles = async () => {
    if (!items.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();

    items.forEach((item) => {
      formData.append("files", item.file);
    });

    if (folderId) {
      formData.append("folderId", folderId);
    }

    try {
      await axios.post(FILE_ENDPOINTS.UPLOAD, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      handleCancel();
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  };

  const hasImages = items.length > 0;

  /* ------------------------------
     UI
  ------------------------------ */
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Upload Area */}
      {!hasImages && (
        <div onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />

          <div className="flex justify-center">
            <button type="button" className="primary_button">
              Select Images
            </button>
          </div>
        </div>
      )}

      {/* Previews */}
      {hasImages && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiImage className="text-blue-600" />
              {items.length} Images Selected
            </h3>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, index) => (
              <div
                key={item.url}
                className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border-light)] shadow-sm"
                onClick={() =>
                  setActivePreviewIndex(
                    activePreviewIndex === index ? null : index,
                  )
                }
              >
                <img
                  src={item.url}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />

                {/* Remove */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FiX />
                </button>

                {/* Filename */}
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-1 rounded-full truncate max-w-[80%]">
                  {item.file.name}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="secondary_button w-1/2 flex justify-center"
            >
              Cancel
            </button>

            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="primary_button w-1/2 flex justify-center items-center gap-2"
            >
              {isUploading ? (
                <>Uploading… {uploadProgress}%</>
              ) : (
                <>
                  <FiUpload />
                  Upload All {items.length}
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
