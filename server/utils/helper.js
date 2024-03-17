const crypto = require("crypto");

module.exports = {
  generateCode: (codeLength) => {
    const buffer = crypto.randomBytes(codeLength);
    const code = buffer.toString("hex").toUpperCase();
    return code;
  },
  formatPhoneNumber: (phone) => {
    const phoneCheck = phone.startsWith("0");
    if (phoneCheck) return `+84${phone.slice(1)}`;
    return `+${phone}`;
  },
};
