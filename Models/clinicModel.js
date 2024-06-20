const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clinicSchema = new Schema({
    license: String,
    clinicianName: String,
    status: Boolean,
    activeFrom: Date,
    activeTo: Date,
    specialtyId: String,
    specialty: String
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
