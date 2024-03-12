module.exports = {
  errorWithStatus: (statusCode, mes, res) => {
    return res.status(statusCode).json({
      success: false,
      mes,
    });
  },
};
