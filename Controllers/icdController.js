const ICD = require("../Models/icdGroupingModel");
const csv = require("csv-parser");
const fs = require("fs");
const HttpError = require("../utils/httpError");

const uploadIcdData = async (req, res) => {
  const filePath = req.file.path;
  let isFirstRow = true;
  const results = [];
  fs.createReadStream(filePath)
    .pipe(
      csv(["icdCode", "shortDesc", "longDesc", "benefitGroup", "benefitCode"])
    )
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
          const { icdCode, shortDesc, longDesc, benefitGroup, benefitCode } =
            row;

          const benefitsArray = [
            {
              type: "default",
              benefitGroup: benefitGroup,
              benefitCode: benefitCode,
            },
          ];

          const icdEntry = new ICD({
            icdCode,
            shortDesc,
            longDesc,
            benefits: benefitsArray,
          });

          await icdEntry.save();
        }

        res.status(200).send("ICD CSV processed successfully");
      } catch (error) {
        console.error("Error:", error);
        return next(new HttpError("Error Data Upload", 500));
      }
    });
};

exports.uploadIcdData = uploadIcdData;
