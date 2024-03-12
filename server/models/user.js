const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema(
  {
    fName: { type: String, require: true },
    lName: { type: String, require: true },
    roleId: { type: mongoose.Types.ObjectId, ref: "Role",default:"User" },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
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
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

module.exports = mongoose.model("User", userSchema);
