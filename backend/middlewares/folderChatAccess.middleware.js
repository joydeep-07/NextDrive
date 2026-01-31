const Folder = require("../models/Folder.model");

const folderChatAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // "admin"
    const folderId = req.params.folderId || req.body.folderId;

    if (!folderId) {
      return res.status(400).json({ message: "Folder ID required" });
    }

    // Admin → always allowed
    if (role === "admin") return next();

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const isOwner = folder.owner.toString() === userId;
    const isCollaborator = folder.collaborators.some(
      (c) => c.toString() === userId,
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Chat access denied" });
    }

    req.folder = folder;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = folderChatAccess;
