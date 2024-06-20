const mongoose = require('mongoose');
const bcrypt = require('bcrypt')




const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
      },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
      }, 
      location: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
    },

    role: {         
        type: String,
        enum: ['Admin', 'Payer'],
        default:'Payer',
      },

    specialtyId: String,
    specialty: String,
    memberEndData:Date,
    lastFillDate:Date
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.correctotp = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.createotp = async function () {
  const otp = `${Math.floor(1000 + Math.random() * 900)}`
  const hashotp = await bcrypt.hash(otp, 12);
  this.otp = hashotp;
  this.otpExpireTime = Date.now() + 10 * 60 * 1000;
  return otp;
};
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
