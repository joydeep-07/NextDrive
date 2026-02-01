// socket/index.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Folder = require("../models/Folder.model");
const Chat = require("../models/Chat.model");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  /* =========================
     Socket Auth Middleware
  ========================= */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role }
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  /* =========================
     Socket Events
  ========================= */
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.user.id);

    /* Join folder room */
    socket.on("join-folder", async (folderId) => {
      try {
        const folder = await Folder.findById(folderId);
        if (!folder) return;

        const isOwner = folder.owner.toString() === socket.user.id;
        const isCollaborator = folder.collaborators.some(
          (id) => id.toString() === socket.user.id,
        );
        const isAdmin = socket.user.role === "admin";

        if (!isOwner && !isCollaborator && !isAdmin) return;

        socket.join(folderId);
        console.log(`📁 User joined folder: ${folderId}`);
      } catch (err) {
        console.error("Join folder error:", err);
      }
    });

    /* Send message */
    socket.on("send-message", async ({ folderId, message }) => {
      try {
        if (!message?.trim()) return;

        const chat = await Chat.create({
          folder: folderId,
          sender: socket.user.id,
          message,
        });

        const populated = await chat.populate("sender", "firstName email role");

        io.to(folderId).emit("receive-message", populated);
      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.user.id);
    });
  });

  return io;
};

module.exports = initSocket;
