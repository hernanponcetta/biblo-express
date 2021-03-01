const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");

const dbPassword = config.get("db_password");

console.log(dbPassword);

module.exports = function () {
  mongoose.connect(
    `mongodb+srv://biblo_admin:${dbPassword}@biblo.nnxdk.mongodb.net/biblo?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const db = mongoose.connection;
  db.once("open", function () {
    winston.info(`Connected to ${config.get("db")}`);
  });
};
