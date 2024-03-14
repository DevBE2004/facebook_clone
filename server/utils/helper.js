const crypto = require("crypto");

module.exports = {
  generateCode: (codeLength) => {
    const buffer = crypto.randomBytes(codeLength);
    const code = buffer.toString("hex").toUpperCase();
    return code;
  },
};
