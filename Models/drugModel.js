// DrugSchema.js
const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema(
  {
    familyCode :String,
    ddcCode:String,
    dohRpoCode:String,
    fullName: String,
    roaCode:String,
    roaDesc:String,
    ingredient:String,
    strength:String,
    formAndPack:String,
    granularUnits:String,
    brandGeneric:String,
    dispenseMode:String,
    dhaSource:String,
    IsDhaEbp:String,
    ddcActive:Boolean,
    ddcCDeletionDate:Date,
    ddcPrice:Number,
    dohActive:Boolean,
    dohDeletionDate:Date,
    rpoActive:Boolean,
    rpoDeletionDate:Date,
    rpoPrice:Number,
    ageTo: Number,
    ageFrom: Number,
    gender: {
      type: String,
      enum: ["male", "female", "neutral"],
    },
    maxDD:Number,
    maxDS:Number,
    indication: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ICDGrouping' }],
    contraIndication: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ICDGrouping' }],
    maximumDays: Number,
  },
  {
    timestamps: true,
  }
);



const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
