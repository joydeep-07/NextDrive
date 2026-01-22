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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Folders</h1>
        <CreateFolderButton
          onCreated={(newFolder) => setFolders((prev) => [newFolder, ...prev])}
        />
      </div>

      {loading && <p className="text-center py-10">Loading your folders...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && folders.length === 0 && (
        <p className="text-center py-10 text-gray-500">
          You haven't created any folders yet
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {folders.map((folder) => (
          <div
            key={folder._id}
            onClick={() => navigate(`/folder/${folder._id}`)}
            className={`
              p-5 border rounded-xl cursor-pointer
              hover:shadow-md hover:border-blue-400 transition-all
              bg-white
            `}
          >
            <div className="text-4xl mb-3">📁</div>
            <h3 className="font-semibold text-lg truncate">{folder.name}</h3>
            {folder.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {folder.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
