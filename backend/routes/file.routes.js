const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const authFromQueryOrHeader = require("../middlewares/authFromQueryOrHeader");
const upload = require("../middlewares/multer");

const {
  uploadFiles,
  getFile,
  getMyFiles,
  deleteFile,
  renameFile, // ✅ added
} = require("../controllers/file.controller");

/* =========================
   ⬆ Upload files (protected)
========================= */
router.post("/upload", auth, upload.array("files", 10), uploadFiles);

/* =========================
   📂 Get logged-in user's files
========================= */
router.get("/", auth, getMyFiles);

/* =========================
   ✏️ Rename file
   (Owner + Collaborators)
========================= */
router.patch("/rename/:id", auth, renameFile);

/* =========================
   👁 View / Stream file
   (Supports <img> via query token)
========================= */
router.get("/:id", authFromQueryOrHeader, getFile);

/* =========================
   🗑 Delete file (OWNER ONLY)
========================= */
router.delete("/:id", auth, deleteFile);

module.exports = router;
