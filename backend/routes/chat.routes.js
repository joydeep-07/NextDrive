const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const folderChatAccess = require("../middlewares/folderChatAccess.middleware");
const { getMessages, sendMessage } = require("../controllers/chat.controller");

router.get("/:folderId", auth, folderChatAccess, getMessages);

router.post("/:folderId", auth, folderChatAccess, sendMessage);

module.exports = router;
