const express = require("express");
const icdController = require("../Controllers/icdController");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post(
  "/uploadIcdData",
  upload.single("file"),
  icdController.uploadIcdData
);

module.exports = router;
