const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.once("open", function () {
    winston.info(`Connected to ${config.get("db")}`);
  });
};
