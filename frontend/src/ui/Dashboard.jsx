import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CreateFolderButton from "../components/CreateFolderButton";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Decode logged-in user ID
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchFolders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(FOLDER_ENDPOINTS.GET_FOLDERS, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setFolders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [token, navigate]);

  // 🗑 Delete folder (OWNER ONLY)
  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation(); // prevent navigation

    const confirmed = window.confirm(
      "Are you sure you want to delete this folder?",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${FOLDER_ENDPOINTS.DELETE_FOLDER}/${folderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }

      // Remove from UI
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-main)" }}
          >
            Your Folders
            {folders.length > 0 && (
              <p className="text-sm">
                Showing {folders.length} folder
                {folders.length !== 1 ? "s" : ""}
              </p>
            )}
          </h1>

          <CreateFolderButton
            onCreated={(newFolder) =>
              setFolders((prev) => [newFolder, ...prev])
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {folders.map((folder) => {
            const isOwner = folder.owner === loggedInUserId;

            return (
              <div
                key={folder._id}
                onClick={() => navigate(`/folder/${folder._id}`)}
                className="group relative p-5 rounded-sm bg-[var(--bg-secondary)]/30 border border-[var(--border-light)]/50 hover:border-[var(--border-light)] cursor-pointer transition-all duration-300"
              >
                {/* 🏷 Admin Badge */}
                {isOwner && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-[2px] rounded-full font-semibold"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--bg-main)",
                    }}
                  >
                    Admin
                  </span>
                )}

                {/* 🗑 Delete button (owner only) */}
                {isOwner && (
                  <button
                    onClick={(e) => handleDeleteFolder(e, folder._id)}
                    className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-md border hover:opacity-80"
                    style={{
                      borderColor: "var(--error)",
                      color: "var(--error)",
                    }}
                  >
                    Delete
                  </button>
                )}

                <h3
                  className="font-medium text-lg truncate"
                  style={{ color: "var(--text-main)" }}
                >
                  {folder.name}
                </h3>

                {folder.description && (
                  <p className="text-sm font-light line-clamp-2 text-[var(--text-secondary)]/70">
                    {folder.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
