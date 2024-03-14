const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/role");
const { errorWithStatus } = require("../middlewares/handleError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const { generateCode } = require("../utils/helper");

module.exports = {
  register: asyncHandler(async (req, res) => {
    const { email, mobile, ...userData } = req.body;
    const userExistsPromise = User.exists({ $or: [{ email }, { mobile }] });
    const roleIdPromise = Role.findOne({ value: "USER" }).select("_id");
    const [userExists, role] = await Promise.all([
      userExistsPromise,
      roleIdPromise,
    ]);
    if (userExists) return errorWithStatus(403, "User already exists.", res);
    const code = generateCode(6);
    const emailEdited = email + "!@#$%^" + code;
    const newUser = await User.create({
      email: emailEdited,
      mobile,
      roleId: role._id,
      ...userData,
    });

    if (newUser) {
      const subject = `Mã code để xác thực ứng dụng facebook của bạn.`;
      // const link = `${process.env.CLIENT_URL}/auth/finally-register/${code}`;
      const link = `http://localhost:5000/auth/finally-register/${code}`;
      sendEmail(email, subject, code, link);
      setTimeout(async () => {
        await User.deleteOne({ email: emailEdited });
      }, 5 * 60 * 1000);
    }
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? "Kiểm tra email của bạn"
        : "Đã xảy ra một lỗi trong quá trình tạo tài khoản, vui lòng thử lại",
    });
  }),
  finallyRegister: asyncHandler(async (req, res) => {
    const user = User.findOne({ email: new RegExp(`${req.params.code}`) });
    const role = Role.findOne({ value: "USER" }).select("_id");
    const [userNotActive, roleId] = await Promise.all([user, role]);
    if (userNotActive) {
      userNotActive.email = userNotActive.email.split("!@#$%^")[0];
      userNotActive.roleId = roleId._id;
      await userNotActive.save();
    }
    return res.status(200).json({
      success: Boolean(userNotActive) ? true : false,
      message: Boolean(userNotActive)
        ? "Tạo tài khoản thành công"
        : "Đã xảy ra lỗi trong quá trình thực hiện",
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
