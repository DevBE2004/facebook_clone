const { errorWithStatus } = require("./handleError");

module.exports = {
  validateJoi: (schema) => (req, res, next) => {
    const error = schema.validate(req.body).error;
    if (error || error !== undefined)
      return errorWithStatus(403, error?.details[0].message, res);
    else next();
  },
};
