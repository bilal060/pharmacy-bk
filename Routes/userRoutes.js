const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const { check } = require("express-validator");

router.post(
  "/login",
  [
    check("email").not().isEmpty().withMessage("Email is required"),
    check("password").not().isEmpty().withMessage("password is required"),
  ],
  userController.login
);

router.post(
  "/register",
  [
    check("name").not().isEmpty().withMessage("Email is required"),
    check("email").not().isEmpty().withMessage("Email is required"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage("Password length must be at least 8 characters"),
    check("passwordConfirm")
      .not()
      .isEmpty()
      .withMessage("Password confirmation is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
    check("specialtyId").optional({ checkFalsy: true }),
    check("specialty").optional({ checkFalsy: true }),
  ],
  userController.register
);
module.exports = router;
