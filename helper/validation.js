const Clinic = require("../Models/clinicModel");
const Drug = require("../Models/drugModel");
const ICD = require("../Models/icdGroupingModel");
const User = require("../Models/userModel");

/**
 * Validates clinical data.
 * @param {Object} data - The clinical data to be validated.
 * @returns {Promise<Object>} - The result of the validation.
 * @throws {Error} - If an error occurs during the validation process.
 */
const validateClinicalData = async (data) => {
  let clinic, drug, user;
  let icds = [];
  let drugsByIcdIds = [];
  let checkDrugs = [];

  try {
    // R01.1 - Validate that the user (member) exists
    user = await User.findOne({ _id: data.memberId });
    if (!user) {
      return { rule: "R01.1", status: "fail", code: "CODE-002" };
    }

    // R01.2 - Validate that the clinic exists and is active
    clinic = await Clinic.findOne({ _id: data.clinicalId, status: true });
    if (!clinic) {
      return { rule: "R01.2", status: "fail", code: "CODE-002" };
    }

    // R01.4 - Validate that the drug is active across different regulators
    drug = await Drug.findOne({
      _id: data.drugId,
      ddcActive: true,
      dohActive: true,
      rpoActive: true,
    });
    if (!drug) {
      return { rule: "R01.4", status: "fail", code: "CODE-010" };
    }

    // R01.5 - Validate that the DHA source of the drug is 'DHA'
    if (drug.dhaSource !== "DHA") {
      return { rule: "R01.5", status: "fail", code: "NCOV-003" };
    }

    // R01.3 - Validate ICD to gender compatibility
    icds = await ICD.find({ icdCode: { $in: data.diagnosisICDs } });
    const icdIds = icds.map((icd) => icd._id);
    drugsByIcdIds = await Drug.findOne({
      _id: data.drugId,
      indication: { $in: icdIds },
      gender: data.gender,
    });
    if (!drugsByIcdIds) {
      return { rule: "R01.3", status: "fail", code: "CODE-014" };
    }

    // R01.6 - Check DOH Antibiotic Rule (Example implementation)
    const checkAntibioticRule = await Drug.findOne({
      _id: data.drugId,
      providerId: data.providerId,
    });
    if (!checkAntibioticRule) {
      return { rule: "R01.6", status: "fail", code: "NCOV-003" };
    }

    // R01.7 - Check if all drugs in the request are valid by verifying against provided drug IDs
    const drugIds = data.drugs.map(drug => drug._id);d
    checkDrugs = await Drug.find({ _id: { $in: drugIds } });
    if (!checkDrugs.length) {
      return { rule: "R01.7", status: "fail", code: "MNEC-006" };
    }

    return { message: "All rules successfully", status: "success" };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

/**
 * Validates engine data.
 * @param {Object} data - The engine data to be validated.
 * @returns {Promise<Object>} - The result of the validation.
 * @throws {Error} - If an error occurs during the validation process.
 */

const validateEngine = async (data) => {
  let drug, user;

  try {
    // R02.1 - Validate that the user (member) exists
    user = await User.findOne({ _id: data.memberId });
    if (!user) {
      return { rule: "R02.1", status: "fail", code: "AUTH-001" };
    }

    // R02.1 - Validate that the drug price matches the expected price
    drug = await Drug.findOne({ _id: data.drugId, rpoPrice: data.price });
    if (!drug) {
      return { rule: "R02.1", status: "fail", code: "AUTH-001" };
    }

    // R02.4 - Validate that the user's age falls within the allowed range for the drug
    if (!(user.age >= drug.ageFrom && user.age <= drug.ageTo)) {
      return { rule: "R02.4", status: "fail", code: "code-014" };
    }

    // R02.2 - Validate duration vs member end date
    if (data.durationDays > user.memberEndData) {
      return { rule: "R02.2", status: "fail", code: "CODE-012" };
    }

    // R02.3 - Validate quantity check
    const dailyDose = data.qty / data.durationDays;
    if (dailyDose > drug.maxDD) {
      return { rule: "R02.3", status: "fail", code: "CODE-013" };
    }

    // R02.5 - Validate drug to gender compatibility
    if (drug.gender !== 'N' && drug.gender !== user.gender) {
      return { rule: "R02.5", status: "fail", code: "CODE-015" };
    }

    // R02.6 - Validate drug to ICD contra-indications
    const contraIndications = await Drug.findOne({
      _id: data.drugId,
      'contraIndications': { $in: data.diagnosisICDs },
    });
    if (contraIndications) {
      return { rule: "R02.6", status: "fail", code: "CODE-016" };
    }

    // R02.7 - Validate drug to ICD indications
    const indications = await Drug.findOne({
      _id: data.drugId,
      'indications': { $in: data.diagnosisICDs },
    });
    if (!indications) {
      return { rule: "R02.7", status: "fail", code: "CODE-017" };
    }

    // R02.8 - Validate refill too soon
    const lastFillDate = user.lastFillDate; // Assuming this field exists
    const daysSinceLastFill = (new Date() - new Date(lastFillDate)) / (1000 * 60 * 60 * 24);
    const minDaysForRefill = (data.qty * 0.8); // 80% threshold
    if (daysSinceLastFill < minDaysForRefill) {
      return { rule: "R02.8", status: "fail", code: "CODE-018" };
    }

    // R02.9 - Validate drug-drug interactions
    const interactions = await DdiSheet.findOne({
      drug1: data.drugId,
      drug2: { $in: data.drugs },
      severity: '3',
    });
    if (interactions) {
      return { rule: "R02.9", status: "fail", code: "CODE-019" };
    }

    // R02.10 - Validate max day supply
    if (data.durationDays > drug.maxDS) {
      return { rule: "R02.10", status: "fail", code: "CODE-020" };
    }

    return { message: "All rules successfully", status: "success" };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

exports.validateClinicalData = validateClinicalData;
exports.validateEngine = validateEngine;
