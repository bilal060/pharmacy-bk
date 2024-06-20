const createToken = require("../helper/createToken");
const User = require("../Models/userModel");
const HttpError = require("../utils/httpError");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')





  const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msgs = errors.array().map(error => `${error.path}: ${error.msg}`);
      return next(new HttpError(msgs, 422));
    }
    const { email, password } = req.body; 
    let user;
    user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new HttpError('email not found', 404))
    }
    let checkPassword;
    try {
      checkPassword = await bcrypt.compare(password, user.password);
    } catch (error) {
      return next(new HttpError('Error on bcrypt password', 500))
    }
    if (!checkPassword) {
      return next(new HttpError('incorrect Password', 401))
    }
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, next);
  
   res.status(200).json({
    token,
    user
   })
  }



  const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msgs = errors.array().map(error => `${error.path}: ${error.msg}`);
      return next(new HttpError(msgs, 422));
    }
    const { email, password,passwordConfirm ,specialtyId,specialty} = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email })
    } catch (error) {
      return next(new HttpError('Error user find', 404))
    }
    if (existingUser) {
      return next(new HttpError('user already register', 404))
    }
    const user = new User({
      email,
      password,
      passwordConfirm,
      specialtyId,
      specialty
    });
    await user.save();
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, next);
  
   res.status(200).json({
    token
   })
  }

  exports.login = login;
  exports.register = register;
