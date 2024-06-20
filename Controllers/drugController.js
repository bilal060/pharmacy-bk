const factory = require("./HandlerFactory");
const Drug = require("../Models/drugModel");
const { CustomStatusCodes } = require("../utils/customStatusCodes");
const calculateAgeFromDOB = require("../utils/calculateAge");
const csv = require("csv-parser");
const fs = require("fs");
const { drugData } = require("../helper/dataFormat");
const ICD = require("../Models/icdGroupingModel");
const HttpError = require("../utils/httpError");
const { validateClinicalData } = require("../helper/validation");



const apiParameters = {
  requestId:'',
  providerId:'',
  clinicalId:'',
  memberId:'',
  memberEndData:'',
  dob:'',
  gender:'',
  drugListKey:'',
  diagnosisICDs:'',
  drugs:[],
  drugId:'',
  drugCode:'',
  qty:'',
  durationDays:'',
}


const getDrugsByFilters = async (req, res, next) => {
  try {
    const validation = await validateClinicalData(req.body);
    console.log(validation);

    res.send(validation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const uploadDrugData = async (req, res) => {
  const filePath = req.file.path;

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const processedData = drugData(results);
        await Drug.insertMany(processedData);
        res.status(200).json({ message: "Data uploaded successfully" });
      } catch (error) {      
        return next(new HttpError("Error Uploading Data", 404));
      }
    });
};

/**
 * Adds indications into drugs based on a CSV file.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the CSV file is processed successfully.
 */
const addIndicationsIntoDrugs = async (req, res, next) => {
  const filePath = req.file.path;
  let isFirstRow = true;
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv(["familyCode", "icdCode"]))
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
          const { familyCode, icdCode } = row;
          const drugs = await Drug.find({ familyCode });
          if (!drugs.length) {
            console.log(`No drugs found for familyCode: ${familyCode}`);
            continue;
          }
          const icd = await ICD.findOne({ icdCode });
          if (!icd) {
            console.log(`No ICD found for icdCode: ${icdCode}`);
            continue;
          }

          for (const drug of drugs) {
            if (!drug.indication) {
              drug.indication = [];
            }
            if (!drug.indication.includes(icd._id)) {
              drug.indication.push(icd._id);
              await drug.save();
            }
          }
        }

        res.status(200).send("ICD CSV processed successfully");
      } catch (error) {
        console.error("Error:", error);
        return next(new HttpError("Error Uploading Data", 404));
      }
    });
};

const addContraIndicationIntoDrugs = async (req, res, next) => {
  const filePath = req.file.path;
  let isFirstRow = true;
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv(["familyCode", "icdCode"]))
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
          const { familyCode, icdCode } = row;
          const drugs = await Drug.find({ familyCode });
          if (!drugs.length) {
            console.log(`No drugs found for familyCode: ${familyCode}`);
            continue;
          }
          const icd = await ICD.findOne({ icdCode });
          if (!icd) {
            console.log(`No ICD found for icdCode: ${icdCode}`);
            continue;
          }

          for (const drug of drugs) {
            if (!drug.contraIndication) {
              drug.contraIndication = [];
            }
            if (!drug.contraIndication.includes(icd._id)) {
              drug.contraIndication.push(icd._id);
              await drug.save();
            }
          }
        }

        res.status(200).send("ICD CSV processed successfully");
      } catch (error) {
        console.error("Error:", error);
        return next(new HttpError("Error Uploading Data", 404));
      }
    });
};

const deleteDrug = factory.deleteOne(Drug);
const getAllDrug = factory.getAll(Drug, [{ path: 'indication' }, { path: 'contraIndication' }]);


exports.getAllDrug = getAllDrug;
exports.getDrugsByFilters = getDrugsByFilters;
exports.deleteDrug = deleteDrug;
exports.addIndicationsIntoDrugs = addIndicationsIntoDrugs;
exports.addContraIndicationIntoDrugs = addContraIndicationIntoDrugs;
exports.uploadDrugData = uploadDrugData;
