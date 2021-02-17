require("express-async-errors");
const winston = require("winston");

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    })
  );

  const logger = new winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
      }),
    ],
  });

  winston.add(
    new winston.transports.Console({
      format: winston.format.cli({ level: true }),
    })
  );
  logger.add(
    new winston.transports.Console({
      format: winston.format.cli({ level: true }),
      handleExceptions: true,
      handleRejections: true,
    })
  );
};
