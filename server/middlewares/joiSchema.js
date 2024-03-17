const joi = require("joi");

module.exports = {
  stringReq: joi.string().required(),
  numberReq: joi.number().required(),
  arrayReq: joi.array().required(),
  email: joi.string().email().optional(),
  mobile: joi
    .string()
    .regex(/^(84|0[35789])[0-9]{8,9}$/)
    .optional(),
};
