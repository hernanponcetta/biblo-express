const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.connect("mongodb://localhost/bibloDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.once("open", function () {
    winston.info("Connected to mongoDB...");
  });
};
