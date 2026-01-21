import { useState } from "react";
import { createFolder } from "../api/folder.api";

const CreateFolderButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Folder name required");

    try {
      setLoading(true);
      const res = await createFolder({ name, description });
      onCreated?.(res.data); // refresh list
      setName("");
      setDescription("");
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white"
      >
        + New Folder
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-[var(--bg-main)] p-6 rounded-xl w-80">
            <h2 className="text-xl font-semibold mb-4">Create Folder</h2>

            <input
              type="text"
              placeholder="Folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-1 bg-[var(--accent-primary)] text-white rounded"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateFolderButton;
