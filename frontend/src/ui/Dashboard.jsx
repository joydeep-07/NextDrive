import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CreateFolderButton from "../components/CreateFolderButton";
import { FOLDER_ENDPOINTS } from "../api/endpoint";
import { FaDownload, FaEllo, FaTrash } from "react-icons/fa";
import { IoEllipsisHorizontal, IoEllipsisVertical } from "react-icons/io5";
import { FiDelete } from "react-icons/fi";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

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

  // Toggle menu visibility for a specific folder
  const toggleMenu = (folderId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === folderId ? null : folderId);
  };

  // Close menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 🗑 Delete folder (OWNER ONLY)
  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation();
    setActiveMenu(null); // Close menu

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
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-main)" }}
            >
              Your Folders
            </h1>
            {folders.length > 0 && (
              <p
                className="text-sm opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                Showing {folders.length} folder{folders.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <CreateFolderButton
            onCreated={(newFolder) =>
              setFolders((prev) => [newFolder, ...prev])
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {folders.map((folder) => {
            const isOwner = folder.owner === loggedInUserId;

            return (
              <div
                key={folder._id}
                className="group relative bg-[var(--bg-secondary)]/30 rounded-lg p-4 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/folder/${folder._id}`)}
              >
                {/* 🏷 Admin Badge */}
                {isOwner && (
                  <span
                    className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "white",
                    }}
                  >
                    Admin
                  </span>
                )}

                {/* 📂 Three-dot Menu */}
                {isOwner && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => toggleMenu(folder._id, e)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Folder options"
                    >
                      <IoEllipsisVertical />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenu === folder._id && (
                      <div
                        className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg py-1 z-10"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border-color)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleDeleteFolder(e, folder._id)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                          style={{ color: "var(--error)" }}
                        >
                          <FaTrash />
                          Delete
                        </button>

                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"> 
                        <FaDownload/>
                         Download Zip</button>
                      </div>
                    )}
                  </div>
                )}

                {/* 📂 Folder Icon */}
                <div className="flex justify-center mt-8 mb-4">
                  <img
                    src="/folder.svg"
                    alt="Folder Icon"
                    className="w-30 h-30 transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Folder Name */}
                <h3
                  className="text-center font-medium truncate px-2"
                  style={{ color: "var(--text-main)" }}
                  title={folder.name}
                >
                  {folder.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
