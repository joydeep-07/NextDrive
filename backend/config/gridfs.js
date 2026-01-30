const mongoose = require("mongoose");
let gfs;

const initGridFS = () => {
  const conn = mongoose.connection;

  conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });
    console.log("✅ GridFS initialized");
  });
};

const getGFS = () => gfs;

module.exports = { initGridFS, getGFS };
