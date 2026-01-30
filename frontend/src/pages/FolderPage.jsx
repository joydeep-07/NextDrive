import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UploadFile from "../components/UploadFile";
import CollaborationRequest from "../components/CollaborationRequest";
import { FOLDER_ENDPOINTS, FILE_ENDPOINTS } from "../api/endpoint";
import axios from "axios";

const FolderPage = () => {
  const { folderId } = useParams();
  const token = localStorage.getItem("token");

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hasSelectedImages, setHasSelectedImages] = useState(false);

  /* =========================
     Fetch Folder
  ========================= */
  useEffect(() => {
    const fetchFolder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(FOLDER_ENDPOINTS.GET_BY_ID(folderId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to load folder");
        }

        const data = await res.json();
        setFolder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderId, token]);

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
    fetchFiles();
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

  /* =========================
     Loading / Error
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
        Loading folder...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--error)]">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 px-4 transition-all">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--text-main)] font-heading">
            {folder.name}
          </h1>

          {folder.description ? (
            <p className="text-[var(--text-muted)]">{folder.description}</p>
          ) : (
            <p className="text-[var(--text-muted)] italic">
              No description provided
            </p>
          )}
        </div>

        {/* Action Panel */}
        <div className="bg-[var(--bg-secondary)]/50 rounded-xl shadow-sm border border-[var(--border-light)]/50 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {!hasSelectedImages && (
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-main)]">
                  Folder Actions
                </h2>
                <p className="text-sm mt-1 text-[var(--text-muted)]">
                  Upload files or invite collaborators
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <UploadFile
                folderId={folderId}
                onPreviewChange={setHasSelectedImages}
              />

              {!hasSelectedImages && <CollaborationRequest />}
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-[var(--bg-secondary)]/50 rounded-xl shadow-sm border border-[var(--border-light)]/50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Files
            </h2>
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
      </div>
    </div>
  );
};

export default FolderPage;
