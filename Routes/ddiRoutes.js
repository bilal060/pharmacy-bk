const express = require("express");
const ddiController = require("../Controllers/ddiController");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/ddiUpload", upload.single("file"), ddiController.uploadDdiData);
router.route("/").get(ddiController.getAllDdi);


module.exports = router;
