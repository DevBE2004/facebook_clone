const router = require("express").Router();
const ctrl = require("../controllers/insertData");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/role", ctrl.insertData);

module.exports = router;
