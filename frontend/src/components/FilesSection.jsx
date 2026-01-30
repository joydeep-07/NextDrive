import { useEffect, useState } from "react";
import axios from "axios";
import { FILE_ENDPOINTS } from "../api/endpoint";

const FilesSection = ({ folderId }) => {
  const token = localStorage.getItem("token");

  const [files, setFiles] = useState([]);

  /* =========================
     Fetch Files (USER ONLY)
  ========================= */
  const fetchFiles = async () => {
    try {
      const res = await axios.get(FILE_ENDPOINTS.GET_MY_FILES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // filter by current folder
      const folderFiles = res.data.filter(
        (file) => file.metadata?.folderId === folderId,
      );

      setFiles(folderFiles);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    if (folderId) fetchFiles();
  }, [folderId]);

  /* =========================
     Delete File
  ========================= */
  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(FILE_ENDPOINTS.DELETE_FILE(fileId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)]/50 rounded-xl shadow-sm border border-[var(--border-light)]/50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">Files</h2>
        <span className="text-sm text-[var(--text-muted)]">
          {files.length} items
        </span>
      </div>

      {/* Empty State */}
      {files.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border-light)] rounded-lg">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-2">
            No files yet
          </h3>
          <p className="text-[var(--text-muted)]">
            Upload your first file to get started
          </p>
        </div>
      ) : (
        /* Files Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border-light)]"
            >
              <img
                src={`${FILE_ENDPOINTS.GET_FILE(file._id)}?token=${token}`}
                alt={file.filename}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => handleDeleteFile(file._id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesSection;
