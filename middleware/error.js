const winston = require("winston");

module.exports = function (req, res, next) {
  res.status(500).send("Something failed.");
};
