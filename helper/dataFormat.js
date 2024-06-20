const convertStringToBoolean = (str) => {
  const lowerStr = str.toLowerCase();
  return lowerStr === 'y' || lowerStr === 'true';
};

const convertStringToDate = (str) => {
  if (!str) return null;
  const [month, day, year] = str.split("/");
  if (!month || !day || !year) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date) ? null : date;
};

const convertStringToNumber = (str) => {
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
};

const mapGender = (gender) => {
  const genderMap = {
    M: "male",
    F: "female",
    N: "neutral",
  };
  return genderMap[gender] || null;
};



const drugData = (data) => {
  return data.map((row) => ({
    familyCode: row["FAMILY CODE"],
    ddcCode: row["DDC Code"],
    dohRpoCode: row["DOH RPO Code"],
    fullName: row["FULL NAME"],
    roaCode: row["ROA Code"],
    roaDesc: row["ROA Desc"],
    ingredient: row["Ingredient"],
    strength: row["Strength"],
    formAndPack: row["Form & Pack"],
    granularUnits: row["Granular Units"],
    brandGeneric: row["BrandGeneric"],
    dispenseMode: row["Dispense Mode"],
    dhaSource: row["DHA Source"],
    IsDhaEbp: convertStringToBoolean(row["Is DHA EBP"]),
    ddcActive: convertStringToBoolean(row["DDC Active"]),
    ddcCDeletionDate: convertStringToDate(row["DDC Deletion Date"]),
    ddcPrice: convertStringToNumber(row["DDC Price"]),
    dohActive: convertStringToBoolean(row["DOH Active"]),
    dohDeletionDate: convertStringToDate(row["DOH Deletion Date"]),
    dohPrice: convertStringToNumber(row["DOH Price"]),
    rpoActive: convertStringToBoolean(row["RPO Active"]),
    rpoDeletionDate: convertStringToDate(row["RPO Deletion Date"]),
    rpoPrice: convertStringToNumber(row["RPO Price"]),
    ageTo: convertStringToNumber(row["Age To"]),
    ageFrom: convertStringToNumber(row["Age From"]),
    gender: mapGender(row["Gender"]),
    maxDD: convertStringToNumber(row["MaxDD"]),
    maxDS: convertStringToNumber(row["MaxDS"]),
  }));
};





const clinicData = (data) => {
  return data.map((row) => ({
    license: row["License"],
    clinicianName: row["Clinician Name"],
    status: convertStringToBoolean(row["Status"]),
    activeFrom: convertStringToDate(row["Active From"]),
    activeTo: convertStringToDate(row["Active To"]),
    specialtyId: row["Speciality ID"],
    specialty: row["Speciality"],
  }));
};

exports.drugData = drugData;
exports.clinicData = clinicData;
