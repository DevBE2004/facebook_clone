const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    roleId: { type: mongoose.Types.ObjectId, ref: "Role", default: "User" },
    email: {
      type: String,
      unique: true,
      default: "unique-email-placeholder",
      required: function () {
        return this.email !== "unique-email-placeholder" && !this.mobile;
      },
    },
    mobile: {
      type: String,
      unique: true,
      default: "unique-mobile-placeholder",
      required: function () {
        return this.mobile !== "unique-mobile-placeholder" && !this.email;
      },
    },
    password: { type: String, required: true },
    birthday: { type: String, required: true },
    sex: { type: String, enum: ["Nam", "Nu"], required: true },
    friends: { type: Array },
    groups: { type: Array },
    videos: { type: Array },
    avatar: { type: String },
    images: { type: Array },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

module.exports = mongoose.model("User", userSchema);
