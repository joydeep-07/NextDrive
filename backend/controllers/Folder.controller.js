const Folder = require("../models/Folder.model");
const User = require("../models/User.model");

/**
 * Create Folder
 */
exports.createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;

    const folder = await Folder.create({
      name,
      description,
      owner: req.user.id, // from auth middleware
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send Collaboration Request
 */
exports.sendCollaborationRequest = async (req, res) => {
  try {
    const { folderId, userId } = req.body;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Only owner can send request
    if (folder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      folder.collaborators.includes(userId) ||
      folder.collaborationRequests.includes(userId)
    ) {
      return res.status(400).json({ message: "User already invited" });
    }

    folder.collaborationRequests.push(userId);
    await folder.save();

    res.json({ message: "Collaboration request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept Collaboration Request
 */
exports.acceptCollaborationRequest = async (req, res) => {
  try {
    const { folderId } = req.body;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = req.user.id;

    if (!folder.collaborationRequests.includes(userId)) {
      return res.status(400).json({ message: "No request found" });
    }

    // Remove from requests
    folder.collaborationRequests = folder.collaborationRequests.filter(
      (id) => id.toString() !== userId,
    );

    // Add to collaborators
    folder.collaborators.push(userId);

    await folder.save();

    res.json({ message: "Collaboration request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Folder (Owner or Collaborator)
 */
exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id)
      .populate("owner", "firstName email")
      .populate("collaborators", "firstName email");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = req.user.id;

    const hasAccess =
      folder.owner._id.toString() === userId ||
      folder.collaborators.some((collab) => collab._id.toString() === userId);


    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get All Folders for Logged-in User
 * (Owner OR Collaborator)
 */
exports.getMyFolders = async (req, res) => {
  try {
    const userId = req.user.id;

    const folders = await Folder.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ createdAt: -1 });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Delete Folder (Owner only)
 */
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // 🔒 Only owner can delete
    if (folder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await folder.deleteOne();

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
