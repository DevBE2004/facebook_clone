const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/role");
const { errorWithStatus } = require("../middlewares/handleError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
  register: asyncHandler(async (req, res) => {
    const { email, mobile, ...userData } = req.body;
    const userExistsPromise = User.exists({ $or: [{ email }, { mobile }] });
    const roleIdPromise = Role.findOne({ value: "USER" }).select("_id");
    const [userExists, roleId] = await Promise.all([
      userExistsPromise,
      roleIdPromise,
    ]);
    if (userExists) return errorWithStatus(403, "User has existed.", res);
    const user = await User.create({
      ...userData,
      roleId: roleId,
      email: email.toLowerCase(),
    });
    return res.json({
      success: Boolean(user),
      mes: Boolean(user) ? "Thành công." : "Thất bại.",
    });
  }),
  login: asyncHandler(async (req, res) => {
    const { email, mobile, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { mobile }] }).select(
      "+password"
    );
    if (!user) return errorWithStatus(401, "User does not exist.", res);
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) return errorWithStatus(403, "Incorrect password.", res);
    const payload = {
      _id: user._id,
      role: user.role,
      name: user.fName + user.lName,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });
    return res.json({
      success: true,
      mes: "Thành công.",
      accessToken,
      refreshToken,
    });
  }),
};
