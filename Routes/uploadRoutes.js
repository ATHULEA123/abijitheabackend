const express = require("express");
const router = express.Router();
const uploadController = require("../Controller/uploadcontroler");

// Only use the middleware for the upload route
router.post("/upload-background", uploadController.upload, uploadController.uploadBackgroundMedia);
router.put("/upload-background", uploadController.upload, uploadController.updateBackgroundMedia);

router.get("/upload-background", uploadController.getBackgroundMedia);

module.exports = router;

