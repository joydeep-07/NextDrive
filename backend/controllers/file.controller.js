const { getGFS } = require("../config/gridfs");
const mongoose = require("mongoose");

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


exports.getFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const gfs = getGFS();

    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    // permission check
    if (file.metadata?.owner.toString() !== req.user.id) {
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

exports.getMyFiles = async (req, res) => {
  try {
    const gfs = getGFS();

    const files = await gfs.find({ "metadata.owner": req.user.id }).toArray();

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to load files" });
  }
};


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
    if (file.metadata?.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await gfs.delete(fileId);

    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
