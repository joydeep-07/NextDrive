const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

// CORS – allow frontend to send Authorization header
app.use(
  cors({
    origin: "http://localhost:5173", // 🔁 change if needed
    credentials: true,
  }),
);

// Body parser
app.use(express.json());

/* =======================
   DATABASE
======================= */
connectDB();

/* =======================
   ROUTES
======================= */
app.use("/api/users", require("./routes/User.routes"));
app.use("/api/folders", require("./routes/Folder.route"));
app.use("/api/files", require("./routes/File.route"));

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running 🚀",
  });
});

/* =======================
   ERROR HANDLER (OPTIONAL BUT RECOMMENDED)
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
