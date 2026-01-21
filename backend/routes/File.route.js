const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getFilesByFolder,
} = require("../controllers/File.controller");

const auth = require("../middlewares/auth.middleware");

router.post("/upload", auth, uploadFile);
router.get("/:folderId", auth, getFilesByFolder);

module.exports = router;
