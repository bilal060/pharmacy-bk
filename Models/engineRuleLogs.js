const mongoose = require("mongoose");

const engineRuleLogsSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  transactionId:String,
  clientResponse: [{
    name:String,
    status:String
  }],
  drugEngineResponse: [{
    name:String,
    status:String
  }],
});

const engineRuleLogs = mongoose.model("EngineRuleLogs", engineRuleLogsSchema);

module.exports = engineRuleLogs;
