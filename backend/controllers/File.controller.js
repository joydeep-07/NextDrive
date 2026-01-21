const Folder = require("../models/Folder.model");
const File = require("../models/File.model");

/**
 * Upload File (Owner + Collaborator)
 */
exports.uploadFile = async (req, res) => {
  try {
    const { folderId, fileName, fileUrl, fileType, fileSize } = req.body;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = req.user.id;

    const isOwner = folder.owner.toString() === userId;
    const isCollaborator = folder.collaborators.some(
      (id) => id.toString() === userId,
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const file = await File.create({
      fileName,
      fileUrl,
      folder: folderId,
      uploadedBy: userId,
      fileType,
      fileSize,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Files in Folder (Owner + Collaborator)
 */
exports.getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = req.user.id;

    const hasAccess =
      folder.owner.toString() === userId ||
      folder.collaborators.some((id) => id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const files = await File.find({ folder: folderId }).populate(
      "uploadedBy",
      "firstName email",
    );

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
