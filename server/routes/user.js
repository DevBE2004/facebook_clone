const router = require("express").Router();
const ctrl = require("../controllers/user");
const { validateJoi } = require("../middlewares/validateJoi");
const joi = require("joi");
const { mobile, email, stringReq } = require("../middlewares/joiSchema");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/:_id", ctrl.getCurrent);
router.get("/", verifyToken,isAdmin, ctrl.getAll);
router.post(
  "/add",
  validateJoi(
    joi.object({
      mobile,
      email,
      sex: stringReq,
      birthday: stringReq,
      password: stringReq,
      fName: stringReq,
      lName: stringReq,
    })
  ),
  verifyToken,
  isAdmin,
  ctrl.addUser
);
router.put(
  "/:_id",
  validateJoi(
    joi.object({
      mobile,
      email,
      sex: stringReq,
      birthday: stringReq,
      password: stringReq,
      fName: stringReq,
      lName: stringReq,
      roleId: stringReq,
    })
  ),
  verifyToken,
  isAdmin,
  ctrl.updatedUser
);
router.delete("/:_id", verifyToken, isAdmin, ctrl.deleteUser);

module.exports = router;
