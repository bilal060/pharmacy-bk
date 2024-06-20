const fs = require('fs');
const mongoose = require('mongoose');
const ClinicsSheet = require('../Models/clinicsSheetModel'); 
const ddiSheet = require('../Models/ddiSheetModel'); 
const DurgList = require('../Models/masterDrugListModel'); 
const PriceSheet = require('../Models/priceSheetModel'); 
const ICDSheet = require('../Models/icdGroupingSheetModel'); 
const IndicationsSheet = require('../Models/indicationsSheetModel'); 
const ConntraIndication = require('../Models/contraIndicationsSheetModel'); 

const DB = "mongodb+srv://hafizhasnain:1122@cluster0.dwt3iz6.mongodb.net/pharmacy_DB";

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const clinicJson = JSON.parse(
  fs.readFileSync(`${__dirname}/clinics.json`, 'utf-8')
);

const ddiJson = JSON.parse(
  fs.readFileSync(`${__dirname}/ddi.json`, 'utf-8')
);

const durgJson = JSON.parse(
  fs.readFileSync(`${__dirname}/drug.json`, 'utf-8')
);
const priceJson = JSON.parse(
  fs.readFileSync(`${__dirname}/price.json`, 'utf-8')
);
const ICDJson = JSON.parse(
  fs.readFileSync(`${__dirname}/icd.json`, 'utf-8')
);
const IndicationsSheetJson = JSON.parse(
  fs.readFileSync(`${__dirname}/indications.json`, 'utf-8')
);

const ConntraIndicationJson = JSON.parse(
  fs.readFileSync(`${__dirname}/contra.json`, 'utf-8')
);
const importData = async () => {
  try {
    // await ClinicsSheet.create(clinicJson); 
    // await ddiSheet.create(ddiJson); 
    //  await DurgList.create(durgJson); 
    // await PriceSheet.create(priceJson); 
    //  await ICDSheet.create(ICDJson); 
    // await IndicationsSheet.create(IndicationsSheetJson); 
     await ConntraIndication.create(ConntraIndicationJson); 
    console.log('Data successfully loaded!');
  } catch (err) {
    console.error('Error importing data:', err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await ClinicsSheet.deleteMany();
    await ddiSheet.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error('Error deleting data:', err); // Log deletion errors
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
