const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const { initGridFS } = require("./config/gridfs");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
connectDB();
initGridFS();

// Routes
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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
