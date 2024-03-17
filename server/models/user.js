const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    roleId: { type: mongoose.Types.ObjectId, ref: "Role", default: "User" },
    email: {
      type: String,
      required: function () {
        return !this.mobile
      },
      unique: function () {
        return this.email !== null && this.email !== undefined;
      },
    },
    mobile: {
      type: String,
      required: function () {
        return !this.email;
      },
      unique: function () {
        return this.mobile !== null && this.mobile !== undefined;
      },
    },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
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
