const Chat = require("../models/Chat.model");

/**
 * Get folder messages
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ folder: req.params.folderId })
      .populate("sender", "firstName email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send message
 */
exports.sendMessage = async (req, res) => {
  try {
    const chat = await Chat.create({
      folder: req.params.folderId,
      sender: req.user.id,
      message: req.body.message,
    });

    const populated = await chat.populate("sender", "firstName email role");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
