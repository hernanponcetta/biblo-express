const winston = require("winston");

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.json(),
    })
  );

  const logger = new winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
        format: winston.format.json(),
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "exceptions.log" }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: "rejections.log" }),
    ],
  });

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: winston.format.cli(),
      })
    );
    logger.add(
      new winston.transports.Console({
        format: winston.format.cli(),
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }
};
