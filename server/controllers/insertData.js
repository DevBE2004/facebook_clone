const asynHandler = require("express-async-handler");
const Role = require("../models/role");
module.exports = {
  insertData: asynHandler(async (req, res) => {
    const response = await Role.create(req.body);
    return res.json({
      success: Boolean(response) ? true : false,
      mes:Boolean(response)?"Thành công.": "Thất bại.",
    });
  }),
};
