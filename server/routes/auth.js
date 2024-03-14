const router = require("express").Router();
const ctrl = require("../controllers/auth");
const { validateJoi } = require("../middlewares/validateJoi");
const joi = require("joi");
const { email, mobile, stringReq } = require("../middlewares/joiSchema");

router.post(
  "/register",
  validateJoi(
    joi
      .object({
        mobile,
        email,
        sex: stringReq,
        birthday: stringReq,
        password: stringReq,
        fName: stringReq,
        lName: stringReq,
      })
      .or("email", "mobile")
  ),
  ctrl.register
);
router.post(
  "/login",
  validateJoi(
    joi
      .object({
        email,
        mobile,
        password: joi.string().required(),
      })
      .or("email", "mobile")
  ),
  ctrl.login
);
router.get("/finally-register/:code", ctrl.finallyRegister);
module.exports = router;
