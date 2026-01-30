// routes/folder.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createFolder,
  sendCollaborationRequest,
  acceptCollaborationRequest,
  getMyInvitations,
  getFolderById,
  getMyFolders,
  deleteFolder,
} = require("../controllers/Folder.controller");

router.post("/", auth, createFolder);
router.get("/", auth, getMyFolders);

router.post("/invite", auth, sendCollaborationRequest);
router.post("/accept", auth, acceptCollaborationRequest);

// 🔔 NEW
router.get("/invitations", auth, getMyInvitations);

router.get("/:id", auth, getFolderById);
router.delete("/:id", auth, deleteFolder);

module.exports = router;
