import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UploadFile from "../components/UploadFile";
import CollaborationRequest from "../components/CollaborationRequest";
import FilesSection from "../components/FilesSection";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const FolderPage = () => {
  const { folderId } = useParams();
  const token = localStorage.getItem("token");

  const [folder, setFolder] = useState(null);
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
        {/* Header */}
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
        <div className="bg-[var(--bg-secondary)]/20 rounded-xl border border-[var(--border-light)]/50 p-6">
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

              {!hasSelectedImages && (
                <CollaborationRequest folderId={folder._id} />
              )}
            </div>
          </div>
        </div>

        {/* Files Section (EXTRACTED) */}
        <FilesSection folderId={folderId} />
      </div>
    </div>
  );
};

export default FolderPage;
