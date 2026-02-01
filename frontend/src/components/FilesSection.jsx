import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FILE_ENDPOINTS } from "../api/endpoint";
import { FaSearch, FaEllipsisV, FaTrash, FaDownload, FaPen } from "react-icons/fa";
import DeleteModal from "./DeleteModal"; // Adjust path if needed

const FilesSection = ({ folderId }) => {
  const token = localStorage.getItem("token");

  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [renamingFileId, setRenamingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState("");


  const menuRef = useRef(null);

  /* =========================
     Fetch Files
  ========================= */
  const fetchFiles = async () => {
    try {
      const res = await axios.get(FILE_ENDPOINTS.GET_MY_FILES, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
     Close menu when clicking outside
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     Filtered files (search)
  ========================= */
  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* =========================
     Delete flow
  ========================= */
  const requestDelete = (file) => {
    setFileToDelete(file);
    setOpenMenuId(null); // close the dropdown menu
  };

  const cancelDelete = () => {
    setFileToDelete(null);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      await axios.delete(FILE_ENDPOINTS.DELETE_FILE(fileToDelete._id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles((prev) => prev.filter((f) => f._id !== fileToDelete._id));
      setFileToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete file. Please try again.");
      // You can choose to keep fileToDelete set → user can retry
      // or reset: setFileToDelete(null);
    }
  };

  // RENAME 


  const startRename = (file) => {
    setRenamingFileId(file._id);
    setNewFileName(file.filename);
    setOpenMenuId(null);
  };

  const cancelRename = () => {
    setRenamingFileId(null);
    setNewFileName("");
  };

  const confirmRename = async (file) => {
    if (!newFileName.trim() || newFileName === file.filename) {
      cancelRename();
      return;
    }

    try {
      await axios.patch(
        FILE_ENDPOINTS.RENAME_FILE(file._id),
        { newName: newFileName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setFiles((prev) =>
        prev.map((f) =>
          f._id === file._id ? { ...f, filename: newFileName } : f,
        ),
      );

      cancelRename();
    } catch (err) {
      console.error("Rename failed", err);
      alert("Failed to rename file");
    }
  };


  /* =========================
     Download File
  ========================= */
  const handleDownload = async (file) => {
    try {
      const url = `${FILE_ENDPOINTS.GET_FILE(file._id)}?token=${token}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)]/20 rounded-xl border border-[var(--border-light)]/50 p-6">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <div className="outline-none bg-[var(--bg-primary)] flex items-center border border-[var(--border-light)] rounded-full text-sm ">
            <FaSearch className="ml-3 text-[var(--text-secondary)]/70" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-transparent outline-none w-64 sm:w-72"
            />
          </div>
        </div>
        <span className="text-sm text-[var(--text-muted)]">
          {filteredFiles.length} items
        </span>
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border-light)] rounded-lg">
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-2">
            {searchTerm ? "No matching files" : "No files yet"}
          </h3>
          <p className="text-[var(--text-muted)]">
            {searchTerm
              ? "Try a different search term"
              : "Upload your first file to get started"}
          </p>
        </div>
      ) : (
        /* Files Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className="relative group rounded-lg overflow-hidden border border-[var(--border-light)] bg-[var(--bg-primary)] flex flex-col"
            >
              {/* Preview */}
              <div className="aspect-square relative">
                <img
                  src={`${FILE_ENDPOINTS.GET_FILE(file._id)}?token=${token}`}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/fallback-image.png"; // make sure this exists
                  }}
                />
              </div>

              {/* Filename + Menu */}
              <div className="flex justify-between items-center px-3 py-2.5">
                <div className="max-w-[75%]">
                  {renamingFileId === file._id ? (
                    <input
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={() => confirmRename(file)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmRename(file);
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="w-full text-xs px-2 py-1 rounded-xs bg-[var(--bg-secondary)] border border-[var(--border-light)] outline-none"
                    />
                  ) : (
                    <div
                      className="text-xs text-[var(--text-main)] font-medium truncate cursor-text"
                      onDoubleClick={() => startRename(file)}
                      title="Double click to rename"
                    >
                      {file.filename}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === file._id ? null : file._id);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition"
                  >
                    <FaEllipsisV size={14} />
                  </button>

                  {openMenuId === file._id && (
                    <div
                      ref={menuRef}
                      className="absolute bottom-full right-0 mb-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg shadow-xl py-1.5 min-w-[140px] z-20"
                    >
                      <button
                        onClick={() => {
                          handleDownload(file);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-primary)]/60"
                      >
                        <FaDownload size={14} />
                        Download
                      </button>

                      <button
                        onClick={() => startRename(file)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-primary)]/60"
                      >
                        <FaPen/> Rename
                      </button>

                      <button
                        onClick={() => requestDelete(file)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 text-sm hover:bg-red-50/50"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={cancelDelete} // click outside → close
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteModal onCancel={cancelDelete} onConfirm={confirmDelete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesSection;
