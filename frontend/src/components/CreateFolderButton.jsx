import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createFolder } from "../api/folder.api";
import { socket } from "../utils/socket"; // ✅ your socket instance

const CreateFolderButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Prevent duplicate folder insert (REST + socket)
  const createdFolderIdRef = useRef(null);

  /* =========================
     Realtime Listener
  ========================= */
  useEffect(() => {
    const handleRealtimeCreate = (folder) => {
      // Ignore duplicate (already added via REST)
      if (createdFolderIdRef.current === folder._id) return;

      onCreated?.(folder);
    };

    socket.on("folder-created", handleRealtimeCreate);

    return () => {
      socket.off("folder-created", handleRealtimeCreate);
    };
  }, [onCreated]);

  /* =========================
     Create Folder
  ========================= */
  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await createFolder({ name, description });

      // Mark this folder as already handled
      createdFolderIdRef.current = res.data._id;

      // Immediate UI update (optimistic)
      onCreated?.(res.data);

      setTimeout(() => {
        setName("");
        setDescription("");
        setOpen(false);
        createdFolderIdRef.current = null;
      }, 300);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <>
      {/* Create Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 z-10 rounded-sm bg-[var(--bg-secondary)] text-white font-medium shadow-md hover:shadow-lg transition-shadow"
      >
        Create New Folder
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          >
            <motion.div
              className="bg-[var(--bg-main)] p-6 rounded-xl w-full max-w-xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                Create a New Folder
              </h2>

              <input
                type="text"
                placeholder="Folder name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full mb-3 p-3 border border-[var(--border-light)] rounded-lg outline-none"
              />

              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full mb-4 p-3 border border-[var(--border-light)] rounded-lg min-h-[100px] resize-none outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-[var(--border-light)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  disabled={loading || !name.trim()}
                  className="px-5 py-2 bg-[var(--accent-primary)] text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating...
                    </motion.span>
                  ) : (
                    "Create Folder"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateFolderButton;
