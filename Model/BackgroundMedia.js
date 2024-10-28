// models/BackgroundMedia.js
const mongoose = require("mongoose");

const backgroundMediaSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ["image", "video"],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BackgroundMedia", backgroundMediaSchema);
