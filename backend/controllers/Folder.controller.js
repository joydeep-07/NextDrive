const Folder = require("../models/Folder.model");
const { getIO } = require("../socket");

/* =========================
   Create Folder
========================= */
exports.createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;

    const folder = await Folder.create({
      name,
      description,
      owner: req.user.id,
    });

    // 🔔 Realtime update
    const io = getIO();
    io.to(req.user.id).emit("folder-created", folder);

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Invite Collaborator
========================= */
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

    // 🔔 Realtime invite
    const io = getIO();
    io.to(userId).emit("collaboration-invite", {
      folderId: folder._id,
      folderName: folder.name,
      from: senderId,
    });

    res.json({ message: "Invitation sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Accept Collaboration
========================= */
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

    // 🔔 Realtime update
    const io = getIO();
    io.to(folder.owner.toString()).emit("collaboration-accepted", {
      folderId,
      userId,
    });

    res.json({ message: "Invitation accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Get My Invitations
========================= */
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

/* =========================
   Get Folder By ID
========================= */
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

/* =========================
   Get My Folders
========================= */
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

/* =========================
   Delete Folder
========================= */
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (folder.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await folder.deleteOne();

    const io = getIO();
    io.to(req.user.id).emit("folder-deleted", folder._id);

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Folder Participants
========================= */
exports.getFolderParticipants = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id)
      .populate("owner", "firstName lastName email")
      .populate("collaborators", "firstName lastName email");

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const userId = req.user.id;
    const hasAccess =
      folder.owner._id.toString() === userId ||
      folder.collaborators.some((c) => c._id.toString() === userId);

    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    res.json({
      owner: folder.owner,
      collaborators: folder.collaborators,
      totalParticipants: 1 + folder.collaborators.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Leave Folder
========================= */
exports.leaveFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    const userId = req.user.id;

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (folder.owner.toString() === userId) {
      return res.status(400).json({ message: "Owner cannot leave the folder" });
    }

    folder.collaborators.pull(userId);
    await folder.save();

    const io = getIO();
    io.to(folder._id.toString()).emit("collaborator-left", {
      userId,
    });

    res.json({ message: "You left the folder successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
