import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createFolder } from "../api/folder.api";

const CreateFolderButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Folder name required");
      return;
    }

    try {
      setLoading(true);
      const res = await createFolder({ name, description });
      onCreated?.(res.data);

     
      setTimeout(() => {
        setName("");
        setDescription("");
        setOpen(false);
      }, 300);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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

      {/* Modal Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && handleCancel()}
          >
            {/* Modal Content */}
            <motion.div
              className="bg-[var(--bg-main)] p-6 rounded-xl w-full max-w-xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-xl font-semibold mb-4 text-[var(--text-primary)]"
                
              >
                Create a New Folder
              </h2>

              <div
               
              >
                <input
                  type="text"
                  placeholder="Folder name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-3 p-3 border border-[var(--border-light)] rounded-lg outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div
               
              >
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mb-4 p-3 border border-[var(--border-light)] rounded-lg outline-none min-h-[100px] resize-none transition-all"
                  disabled={loading}
                />
              </div>

              <div
                className="flex justify-end gap-3"
               
              >
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-[var(--border-light)] font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                 
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  disabled={loading || !name.trim()}
                  className="px-5 py-2 bg-[var(--accent-primary)] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  
                >
                  {loading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
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
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Create Folder
                    </motion.span>
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
