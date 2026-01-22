const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // change if needed
    credentials: true,
  }),
);

app.use(express.json());
connectDB();


app.use("/api/users", require("./routes/User.routes"));
app.use("/api/folders", require("./routes/Folder.route"));


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running 🚀",
  });
});

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
