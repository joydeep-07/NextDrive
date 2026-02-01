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
  getFolderParticipants,
} = require("../controllers/Folder.controller");

router.post("/", auth, createFolder);
router.get("/", auth, getMyFolders);

router.post("/invite", auth, sendCollaborationRequest);
router.post("/accept", auth, acceptCollaborationRequest);
router.get("/invitations", auth, getMyInvitations);

router.get("/:id", auth, getFolderById);
router.delete("/:id", auth, deleteFolder);
router.get("/:id/participants", auth, getFolderParticipants);

module.exports = router;
