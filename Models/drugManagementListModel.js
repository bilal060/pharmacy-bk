const mongoose = require("mongoose");

const drugManagementListTableSchema = new mongoose.Schema({
    allowed: [{
        drugID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Drug", 
            required: true
        }
    }],
    needApproval: [{
        drugId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Drug",
            required: true
        }
    }],
    rejected: [{
        drugId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Drug",
            required: true
        }
    }]
});

const DrugManagementListTable = mongoose.model("DrugManagementList", drugManagementListTableSchema);

module.exports = DrugManagementListTable;
