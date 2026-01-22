const express = require("express");
const router = express.Router();

const {
  createFolder,
  sendCollaborationRequest,
  acceptCollaborationRequest,
  getFolderById,
  getMyFolders,
} = require("../controllers/Folder.controller");

const auth = require("../middlewares/auth.middleware"); // JWT middleware

router.post("/", auth, createFolder);
router.get("/", auth, getMyFolders);
router.post("/invite", auth, sendCollaborationRequest);
router.post("/accept", auth, acceptCollaborationRequest);
router.get("/:id", auth, getFolderById);

module.exports = router;
