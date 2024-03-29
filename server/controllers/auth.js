const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/role");
const { errorWithStatus } = require("../middlewares/handleError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, sendSMS } = require("../utils/sendCode");
const { generateCode, formatPhoneNumber } = require("../utils/helper");
module.exports = {
  register: asyncHandler(async (req, res) => {
    const { email, mobile, ...userData } = req.body;
    const code = generateCode(6);
    const emailEdited = email + "!@#$%^" + code;
    const mobileEdited = mobile + "!@#$%^" + code;

    const [userExists, role] = await Promise.all([
      User.exists({ $or: [{ email }, { mobile }] }),
      Role.findOne({ value: "USER" }).select("_id"),
    ]);

    if (email && !mobile) {
      if (userExists) return errorWithStatus(403, "User already exists.", res);

      await User.create({ email: emailEdited, roleId: role._id, ...userData });
      const subject = `Mã code để xác thực ứng dụng facebook của bạn.`;
      const link = `http://localhost:5000/auth/finally-register/${code}`;
      sendEmail(email, subject, code, link);
    } else {
      if (userExists) return errorWithStatus(403, "User already exists.", res);
      await User.create({
        mobile: mobileEdited,
        roleId: role._id,
        ...userData,
      });

      const message = `Mã xác thực ứng dụng facebook của bạn là: ${code}`;
      sendSMS(formatPhoneNumber(mobile), message);
    }
    setTimeout(async () => {
      await User.deleteOne({
        $or: [{ email: emailEdited }, { mobile: mobileEdited }],
      });
    }, 1 * 60 * 1000);
    return res.status(200).json({
      success: Boolean(newUser) ? true : false,
      message: Boolean(newUser)
        ? email
          ? "Kiểm tra email của bạn"
          : "Kiểm tra số điện thoại của bạn"
        : "Đã xảy ra một lỗi trong quá trình tạo tài khoản, vui lòng thử lại",
    });
  }),
  finallyRegister: asyncHandler(async (req, res) => {
    const user = User.findOne({
      $or: [
        { email: new RegExp(`${req.params.code}`) },
        { mobile: new RegExp(`${req.params.code}`) },
      ],
    });
    const role = Role.findOne({ value: "USER" }).select("_id");
    const [userNotActive, roleId] = await Promise.all([user, role]);
    if (userNotActive) {
      const updates = { roleId: roleId._id };
      if (userNotActive.email)
        updates.email = userNotActive.email?.split("!@#$%^")[0];
      if (userNotActive.mobile)
        updates.mobile = userNotActive.mobile?.split("!@#$%^")[0];
      await User.updateOne({ _id: role._id }, updates);
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
