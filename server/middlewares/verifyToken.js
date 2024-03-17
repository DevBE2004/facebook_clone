const jwt = require("jsonwebtoken");
const { errorWithStatus } = require("../middlewares/handleError");
module.exports = {
  verifyToken: (req, res, next) => {
    const validateToken = req.headers.authorization.startsWith("Bearer");
    if(!validateToken)return errorWithStatus(401, "token invalid.", res)
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) return errorWithStatus(401, "token invalid.", res);
      req.user = decode;
      next();
    });
  },
  isAdmin: (req, res, next) => {
    if (req.user.role === "ADMIN") next();
    return errorWithStatus(401, "require role Admin.", res);
  },
};
