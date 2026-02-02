import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CreateFolderButton from "../components/CreateFolderButton";
import DeleteModal from "../components/DeleteModal";
import { FOLDER_ENDPOINTS } from "../api/endpoint";
import { FaDownload, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import Storage from "./Storage";
import { FiLogOut } from "react-icons/fi";
import { socket } from "../utils/socket"; // ✅ socket

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // 🔴 Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Decode user
  let loggedInUserId = null;
  if (token) {
    try {
      loggedInUserId = jwtDecode(token).id;
    } catch {
      console.error("Invalid token");
    }
  }

  // 🔒 Prevent duplicates
  const folderIdsRef = useRef(new Set());

  /* =========================
     Initial Fetch
  ========================= */
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
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setFolders(data);
        folderIdsRef.current = new Set(data.map((f) => f._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [token, navigate]);

  /* =========================
     🔴 Realtime Socket Events
  ========================= */
  useEffect(() => {
    const onFolderCreated = (folder) => {
      if (folderIdsRef.current.has(folder._id)) return;

      folderIdsRef.current.add(folder._id);
      setFolders((prev) => [folder, ...prev]);
    };

    const onFolderDeleted = (folderId) => {
      folderIdsRef.current.delete(folderId);
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
    };

    const onCollaboratorLeft = ({ userId, folderId }) => {
      if (userId === loggedInUserId) {
        folderIdsRef.current.delete(folderId);
        setFolders((prev) => prev.filter((f) => f._id !== folderId));
      }
    };

    socket.on("folder-created", onFolderCreated);
    socket.on("folder-deleted", onFolderDeleted);
    socket.on("collaborator-left", onCollaboratorLeft);

    return () => {
      socket.off("folder-created", onFolderCreated);
      socket.off("folder-deleted", onFolderDeleted);
      socket.off("collaborator-left", onCollaboratorLeft);
    };
  }, [loggedInUserId]);

  /* =========================
     UI Helpers
  ========================= */
  const toggleMenu = (folderId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === folderId ? null : folderId);
  };

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const openDeleteModal = (e, folderId) => {
    e.stopPropagation();
    setActiveMenu(null);
    setSelectedFolderId(folderId);
    setShowDeleteModal(true);
  };

  /* =========================
     Delete Folder
  ========================= */
  const confirmDeleteFolder = async () => {
    try {
      const res = await fetch(
        FOLDER_ENDPOINTS.DELETE_FOLDER(selectedFolderId),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      folderIdsRef.current.delete(selectedFolderId);
      setFolders((prev) => prev.filter((f) => f._id !== selectedFolderId));

      setShowDeleteModal(false);
      setSelectedFolderId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================
     Leave Folder
  ========================= */
  const leaveFolder = async (e, folderId) => {
    e.stopPropagation();
    setActiveMenu(null);

    if (!window.confirm("Leave this folder?")) return;

    try {
      const res = await fetch(FOLDER_ENDPOINTS.LEAVE_FOLDER(folderId), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      folderIdsRef.current.delete(folderId);
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="p-6 min-h-screen bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Storage />
            <p className="text-sm opacity-70 text-[var(--text-secondary)]">
              Showing {folders.length} folder{folders.length !== 1 && "s"}
            </p>
          </div>

          <CreateFolderButton
            onCreated={(folder) => {
              if (folderIdsRef.current.has(folder._id)) return;
              folderIdsRef.current.add(folder._id);
              setFolders((prev) => [folder, ...prev]);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {folders.map((folder) => {
            const ownerId =
              typeof folder.owner === "string"
                ? folder.owner
                : folder.owner?._id;

            const isOwner = ownerId === loggedInUserId;

            return (
              <div
                key={folder._id}
                onClick={() => navigate(`/folder/${folder._id}`)}
                className="group relative bg-[var(--bg-secondary)]/30 rounded-lg p-4 cursor-pointer"
              >
                {isOwner && (
                  <span className="absolute top-3 left-3">
                    <MdAdminPanelSettings className="text-xl text-white" />
                  </span>
                )}

                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => toggleMenu(folder._id, e)}
                    className="p-1.5 rounded-full hover:bg-[var(--bg-hover)]"
                  >
                    <IoEllipsisVertical />
                  </button>

                  {activeMenu === folder._id && (
                    <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      {isOwner && (
                        <button
                          onClick={(e) => openDeleteModal(e, folder._id)}
                          className="w-full px-4 py-2 text-left flex gap-2 text-[var(--error)] hover:bg-white/10"
                        >
                          <FaTrash /> Delete
                        </button>
                      )}

                      <button className="w-full px-4 py-2 text-left flex gap-2 hover:bg-white/10">
                        <FaDownload /> Download Zip
                      </button>

                      {!isOwner && (
                        <button
                          onClick={(e) => leaveFolder(e, folder._id)}
                          className="w-full px-4 py-2 text-left flex gap-2 text-[var(--error)] hover:bg-white/10"
                        >
                          <FiLogOut /> Leave Folder
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-8 mb-4">
                  <img src="/folder.svg" alt="Folder" className="w-30 h-30" />
                </div>

                <h3 className="text-center font-medium truncate text-[var(--text-main)]">
                  {folder.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowDeleteModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteModal
              onCancel={() => setShowDeleteModal(false)}
              onConfirm={confirmDeleteFolder}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
