const auth = require("./auth");
const user = require("./user");
const data = require("./insertData");

const initRouter = (app) => {
  app.use("/auth", auth);
  app.use("/user", user);
  app.use("/data", data);
};

module.exports = initRouter;
