const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const connectDB = require("./db");
const { initGridFS } = require("./config/gridfs");
const { initSocket } = require("./socket");

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
   REST Routes
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
   Server + Socket
========================= */
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
