const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { errorWithStatus } = require("../middlewares/handleError");
module.exports = {
  getCurrent: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params._id).select("-password");
    if (!user) return errorWithStatus(403, "user not exists.", res);
    return res.json({
      success: Boolean(user) ? true : false,
      mes: Boolean(user) ? "Success" : "Failed.",
      user,
    });
  }),
  getAll: asyncHandler(async (req, res) => {
    const usersPromise = User.find().select("-password");
    const countPromise = User.countDocuments();
    const [users, count] = await Promise.all([usersPromise, countPromise]);
    if (!users) return errorWithStatus(403, "No users found.", res);
    return res.json({
      success: Boolean(users),
      mes: Boolean(users) ? "Success" : "Failed.",
      count,
      users,
    });
  }),
  addUser: asyncHandler(async (req, res) => {
    const existingUser = await User.exists({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });
    if (existingUser) return errorWithStatus(403, "user has existed.", res);
    const user = await User.create(req.body);
    return res.json({
      success: Boolean(user) ? true : false,
      mes: Boolean(user) ? "Success" : "Failed.",
    });
  }),
  updatedUser: asyncHandler(async (req, res) => {
    const response = await User.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    return res.json({
      success: Boolean(response) ? true : false,
      mes: Boolean(response) ? "Success" : "Failed.",
    });
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const response = await User.findByIdAndDelete(req.params._id);
    return res.json({
      success: Boolean(response) ? true : false,
      mes: Boolean(response) ? "Success" : "Failed.",
    });
  }),
};
