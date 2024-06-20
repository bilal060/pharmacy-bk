const express = require("express");
const clinicController = require("../Controllers/clinicController");
const upload = require("../middlewares/upload");
const router = express.Router();



router.post(
    "/uploadClinicData",
    upload.single("file"),
    clinicController.uploadClinicData
  );
router.route("/").get(clinicController.getAllClinic);
router.route("/:id").delete(clinicController.deleteClinic);

module.exports = router;
