import { useEffect, useState } from "react";
import CreateFolderButton from "../components/CreateFolderButton";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:3000/api/folders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch folders");
        }

        setFolders(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFolders();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="p-6">
      <CreateFolderButton
        onCreated={(folder) => setFolders((prev) => [folder, ...prev])}
      />

      {loading && <p className="mt-4 text-sm">Loading folders...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && folders.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No folders created yet</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="p-4 border border-[var(--border-light)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition"
          >
            📁 {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
