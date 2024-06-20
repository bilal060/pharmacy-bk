const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const priceSheetSchema = new Schema({
    regulatorDrugCode: String,
    DDC:Number,
    DOH:Number,
    RPO:Number,
    prices: [{
        code: String,
        price: Number,
        startDate: Date,
        endDate: Date
    }]
    ,
    startDate: Date,
    endDate: Date
});

const PriceSheet = mongoose.model('PriceSheet', priceSheetSchema);

module.exports = PriceSheet;

