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
  renameFile, 
} = require("../controllers/file.controller");


router.post("/upload", auth, upload.array("files", 10), uploadFiles);
router.get("/", auth, getMyFiles);
router.patch("/rename/:id", auth, renameFile);
router.get("/:id", authFromQueryOrHeader, getFile);
router.delete("/:id", auth, deleteFile);

module.exports = router;
