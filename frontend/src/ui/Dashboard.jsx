import { useState } from "react";
import CreateFolderButton from "../components/CreateFolderButton";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);

  return (
    <div className="p-6">
      <CreateFolderButton
        onCreated={(folder) => setFolders([folder, ...folders])}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="p-4 border rounded-lg cursor-pointer"
          >
            📁 {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
