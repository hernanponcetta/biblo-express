const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston");
const morgan = require("morgan");
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  winston.info("Morgan enabled...");
}

module.exports = app;
