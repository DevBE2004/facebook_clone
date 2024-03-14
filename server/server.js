const express = require("express");
require("dotenv").config();
const dbconnect = require("./config/dbconnect");
const initRouter = require("./routes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   cors({
//     method: [],
//     origin:'*',
//   })
// );
initRouter(app);
dbconnect();
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
