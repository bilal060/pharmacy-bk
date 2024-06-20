const mongoose = require("mongoose");

const ICDSchema = new mongoose.Schema(
  {

  icdCode:String,
  shortDesc: String,
  longDesc: String,
  benefits: [{
    type: {
        type: String,
        enum: ["default"], 
    },
    benefitGroup: {
        type: String,
    },
    benefitCode: {
        type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
  },
}]
  },
  {
    timestamps: true,
  }
);

const ICD = mongoose.model('ICDGrouping', ICDSchema);

module.exports = ICD;




