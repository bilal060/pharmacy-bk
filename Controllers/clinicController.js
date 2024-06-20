const { clinicData } = require("../helper/dataFormat");
const Clinic = require("../Models/clinicModel");
const factory = require("./HandlerFactory");
const csv = require("csv-parser");
const fs = require("fs");


const deleteClinic = factory.deleteOne(Clinic);
const getAllClinic = factory.getAll(Clinic, null, { status: true });
const  uploadClinicData = async (req, res,next) => {
  const filePath = req.file.path;
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const processedData = clinicData(results);
        await Clinic.insertMany(processedData);
        res.status(200).json({ message: "Data uploaded successfully" });
      } catch (error) {
        return next(new HttpError("Error Uploading Data", 404));
      }
    });
};

exports.deleteClinic = deleteClinic;
exports.getAllClinic = getAllClinic;
exports.uploadClinicData = uploadClinicData;
