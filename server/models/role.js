const mongoose = require("mongoose");

var roleSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
