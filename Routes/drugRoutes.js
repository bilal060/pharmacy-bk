const express = require("express");
const DrugController = require("../Controllers/drugController");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post(
  "/drugUpload",
  upload.single("file"),
  DrugController.uploadDrugData
);
router.post(
  "/addIndicationsIntoDrugs",
  upload.single("file"),
  DrugController.addIndicationsIntoDrugs
);
router.post(
  "/addContraIndicationIntoDrugs",
  upload.single("file"),
  DrugController.addContraIndicationIntoDrugs
);
router.get("/getDrugsByFilters", DrugController.getDrugsByFilters);
router.route("/").get(DrugController.getAllDrug);
router.route("/:id").delete(DrugController.deleteDrug);

module.exports = router;
