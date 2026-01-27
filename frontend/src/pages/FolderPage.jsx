import React from "react";
import UploadFile from "../components/UploadFile";

const FolderPage = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-start items-center py-5">
      {/* CONTROL PANEL */}
      <h1 className="text-left">FOLDER NAME</h1>
      <div className="p-10 border w-7xl flex flex-row justify-between items-center">
        <div className="border p-4">
          <UploadFile />
        </div>
      </div>
      {/* Bottom */}
      <div className="p-10 border w-7xl">No Files found</div>
    </div>
  );
};

export default FolderPage;
