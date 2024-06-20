const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ddiSheetSchema = new Schema({
    drug1: { type: Schema.Types.ObjectId, ref: 'Drug' },
    drug2: { type: Schema.Types.ObjectId, ref: 'Drug' },
    severity: String
});

const DdiSheet = mongoose.model('DdiSheet', ddiSheetSchema);

module.exports = DdiSheet;
