import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFolderButton from "../components/CreateFolderButton";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        console.error("Dashboard folders fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [token, navigate]);

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
            {/* Folder count */}
            {folders.length > 0 && (
              <p className=" text-sm">
                Showing {folders.length} folder{folders.length !== 1 ? "s" : ""}
              </p>
            )}
          </h1>

          <CreateFolderButton
            onCreated={(newFolder) =>
              setFolders((prev) => [newFolder, ...prev])
            }
          />
        </div>

        {loading && (
          <div className="text-center py-16">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mb-3"
              style={{ borderColor: "var(--accent-primary)" }}
            ></div>
            <p className="font-body" style={{ color: "var(--text-muted)" }}>
              Loading your folders...
            </p>
          </div>
        )}

        {error && (
          <div
            className="mb-8 p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--error)",
              color: "var(--error)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="font-body">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && folders.length === 0 && (
          <div
            className="text-center py-16 border-2 border-dashed rounded-2xl"
            style={{
              borderColor: "var(--border-light)",
              backgroundColor: "var(--bg-tertiary)",
            }}
          >
            <div
              className="text-5xl mb-4"
              style={{ color: "var(--accent-soft)" }}
            >
              📂
            </div>
            <h3
              className="text-xl font-heading mb-2"
              style={{ color: "var(--text-main)" }}
            >
              No folders yet
            </h3>
            <p
              className="font-body mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Create your first folder to get started
            </p>
            <CreateFolderButton
              onCreated={(newFolder) =>
                setFolders((prev) => [newFolder, ...prev])
              }
              variant="empty-state"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => navigate(`/folder/${folder._id}`)}
              className="group relative p-5 rounded-sm bg-[var(--bg-secondary)]/30 border border-[var(--border-light)]/50 hover:border-[var(--border-light)] flex items-center cursor-pointer transition-all duration-300"
            >
              {/* Folder icon with accent color */}
              {/* <div className="text-3xl mb-4 transition-transform">📁</div> */}

              {/* Folder name */}
              <div>
                <h3
                  className="font-medium text-lg truncate"
                  style={{ color: "var(--text-main)" }}
                >
                  {folder.name}
                </h3>

                {/* Folder description */}
                {folder.description && (
                  <p
                    className="font-body text-[var(--text-secondary)]/70 font-light text-sm mb-3 line-clamp-2"
                    style={{ color: "" }}
                  >
                    {folder.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
