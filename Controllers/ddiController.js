const Drug = require("../Models/drugModel");
const DDI = require("../Models/ddiModel");
const csv = require("csv-parser");
const fs = require("fs");
const HttpError = require("../utils/httpError");
const factory = require("./HandlerFactory");


const uploadDdiData = async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  let isFirstRow = true;

  fs.createReadStream(filePath)
    .pipe(csv(["familyCode1", "familyCode2", "severity"]))
    .on("data", (data) => {
      if (isFirstRow) {
        isFirstRow = false;
        return;
      }
      results.push(data);
    })
    .on("end", async () => {
      try {
        for (const row of results) {
          const { familyCode1, familyCode2, severity } = row;

          const drugs1 = await Drug.find({ familyCode: familyCode1 });
          const drugs2 = await Drug.find({ familyCode: familyCode2 });

          if (drugs1.length > 0 && drugs2.length > 0) {
            const ddiEntries = [];
            for (const drug1 of drugs1) {
              for (const drug2 of drugs2) {
                ddiEntries.push({
                  drug1: drug1._id,
                  drug2: drug2._id,
                  severity: severity,
                });
              }
            }
            await DDI.insertMany(ddiEntries);
          } else {
            console.log(
              `Drug not found for familyCode1: ${familyCode1} or familyCode2: ${familyCode2}`
            );
          }
        }

        res.status(200).send("DDI CSV processed successfully");
      } catch (error) {
        console.error("Error:", error);
        return next(new HttpError("Error Data Upload", 500));
      }
    });
};


const deleteDdi = factory.deleteOne(DDI);
const getAllDdi = factory.getAll(DDI,"drug1 drug2");


exports.uploadDdiData = uploadDdiData;
exports.deleteDdi = deleteDdi;
exports.getAllDdi = getAllDdi;
