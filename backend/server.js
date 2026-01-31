const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./db");
const { initGridFS } = require("./config/gridfs");

const Folder = require("./models/Folder.model");
const Chat = require("./models/Chat.model");

dotenv.config();

const app = express();

/* =========================
   Middlewares
========================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

/* =========================
   DB & GridFS
========================= */
connectDB();
initGridFS();

/* =========================
   REST Routes (UNCHANGED)
========================= */
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/folders", require("./routes/folder.route"));
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/chat", require("./routes/chat.routes"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running 🚀",
  });
});

/* =========================
   Error Handler
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* =========================
   SOCKET.IO SETUP
========================= */
const server = http.createServer(app);

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

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
