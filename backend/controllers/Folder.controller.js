const Folder = require("../models/Folder.model");

// Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;

    const folder = await Folder.create({
      name,
      description,
      owner: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invite Collaborator

exports.sendCollaborationRequest = async (req, res) => {
  try {
    const { folderId, userId } = req.body;
    const senderId = req.user.id;

    const folder = await Folder.findById(folderId);

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (!folder.owner.equals(senderId))
      return res.status(403).json({ message: "Only owner can invite" });

    if (
      folder.collaborators.includes(userId) ||
      folder.collaborationRequests.includes(userId)
    ) {
      return res.status(400).json({ message: "User already invited" });
    }

    folder.collaborationRequests.push(userId);
    await folder.save();

    res.json({ message: "Invitation sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept Collaboration Request
exports.acceptCollaborationRequest = async (req, res) => {
  try {
    const { folderId } = req.body;
    const userId = req.user.id;

    const folder = await Folder.findById(folderId);

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (!folder.collaborationRequests.includes(userId)) {
      return res.status(400).json({ message: "No invitation found" });
    }

    folder.collaborationRequests.pull(userId);
    folder.collaborators.push(userId);

    await folder.save();

    res.json({ message: "Invitation accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my notifications
exports.getMyInvitations = async (req, res) => {
  try {
    const userId = req.user.id;

    const folders = await Folder.find({
      collaborationRequests: userId,
    })
      .populate("owner", "firstName lastName email")
      .select("name owner createdAt");

    res.json({ invitations: folders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get folder by id
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
      folder.collaborators.some((c) => c._id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  get my folders (owner + collaborator)
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

// Delete Folder
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await folder.deleteOne();

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Folder Participants (owner + collaborators)
exports.getFolderParticipants = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id)
      .populate("owner", "firstName lastName email")
      .populate("collaborators", "firstName lastName email");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = req.user.id;

    const hasAccess =
      folder.owner._id.toString() === userId ||
      folder.collaborators.some(
        (c) => c._id.toString() === userId
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      owner: folder.owner,
      collaborators: folder.collaborators,
      totalParticipants: 1 + folder.collaborators.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Leave Folder (collaborator only)
exports.leaveFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user.id;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Owner cannot leave
    if (folder.owner.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Owner cannot leave the folder" });
    }

    // Check if user is a collaborator
    if (!folder.collaborators.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a collaborator of this folder" });
    }

    // Remove collaborator
    folder.collaborators.pull(userId);
    await folder.save();

    res.json({ message: "You left the folder successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
