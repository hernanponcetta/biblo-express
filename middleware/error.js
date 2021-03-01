const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, { metadata: err.stack });

  res
    .status(500)
    .send({ error: { status: 500, message: "Internal Server Error" } });
};
