const mongoose = require("mongoose");
require("dotenv").config();
const dbconnect = () => {
  try {
    mongoose.connect(process.env.MGDB);
    console.log("Db connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbconnect;
