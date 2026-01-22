import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← add this
import CreateFolderButton from "../components/CreateFolderButton";
import { FOLDER_ENDPOINTS } from "../api/endpoint";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(FOLDER_ENDPOINTS.GET_FOLDERS, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch folders");
        }

        setFolders(data);
      } catch (err) {
        console.error("Fetch folders error:", err);
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


  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  return (
    <div className="p-6">
      <CreateFolderButton
        onCreated={(folder) => setFolders((prev) => [folder, ...prev])}
      />

      {loading && <p className="mt-4 text-sm">Loading folders...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && folders.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No folders created yet</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {folders.map((folder) => (
          <div
            key={folder._id}
            onClick={() => handleFolderClick(folder._id)} 
            className="
              p-4 border border-[var(--border-light)]
              rounded-lg cursor-pointer
              hover:bg-[var(--bg-secondary)]
              transition
            "
          >
            📁 {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
