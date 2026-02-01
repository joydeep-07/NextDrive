const { getGFS } = require("../config/gridfs");
const mongoose = require("mongoose");
const Folder = require("../models/Folder.model");

// Check if user has access to folder (owner or collaborator)

const hasFolderAccess = async (folderId, userId) => {
  if (!folderId) return false;

  const folder = await Folder.findById(folderId);
  if (!folder) return false;

  // owner
  if (folder.owner.toString() === userId) return true;

  // collaborator
  return folder.collaborators.some(
    (collabId) => collabId.toString() === userId,
  );
};

// Upload Files
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const gfs = getGFS();
    if (!gfs) return res.status(500).json({ message: "GridFS not ready" });

    const uploadedFiles = [];

    for (const file of req.files) {
      const uploadStream = gfs.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: {
          owner: req.user.id,
          folderId: req.body.folderId || null,
        },
      });

      uploadStream.end(file.buffer);

      uploadedFiles.push({
        filename: file.originalname,
        id: uploadStream.id,
      });
    }

    res.status(201).json({
      success: true,
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Get File by ID (with access check)
exports.getFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const gfs = getGFS();

    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    const isOwner = file.metadata?.owner?.toString() === req.user.id;

    let hasAccess = isOwner;

    if (!isOwner && file.metadata?.folderId) {
      hasAccess = await hasFolderAccess(file.metadata.folderId, req.user.id);
    }

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);

    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch file" });
  }
};

// Get My Files (Owner + Collaborator)
exports.getMyFiles = async (req, res) => {
  try {
    const gfs = getGFS();
    const userId = req.user.id;

    // folders where user is owner or collaborator
    const folders = await Folder.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).select("_id");

    const folderIds = folders.map((f) => f._id.toString());

    const files = await gfs
      .find({
        $or: [
          { "metadata.owner": userId },
          { "metadata.folderId": { $in: folderIds } },
        ],
      })
      .toArray();

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load files" });
  }
};

// Delete File (OWNER ONLY)
exports.deleteFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const gfs = getGFS();

    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    // owner check
    if (file.metadata?.owner?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await gfs.delete(fileId);

    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};


// Rename File (OWNER + COLLABORATOR)
exports.renameFile = async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ message: "New filename is required" });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const gfs = getGFS();

    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    // owner check
    let hasAccess =
      file.metadata?.owner?.toString() === req.user.id;

    // collaborator check
    if (!hasAccess && file.metadata?.folderId) {
      hasAccess = await hasFolderAccess(
        file.metadata.folderId,
        req.user.id
      );
    }

    if (!hasAccess) {
      return res.status(403).json({ message: "Not allowed to rename" });
    }

    // Update filename in GridFS files collection
    await mongoose.connection.db
      .collection("uploads.files") 
      .updateOne(
        { _id: fileId },
        { $set: { filename: newName } }
      );

    res.json({
      success: true,
      message: "File renamed successfully",
      filename: newName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rename failed" });
  }
};
