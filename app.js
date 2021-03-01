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
require("./startup/prod")(app);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  winston.info("Morgan enabled...");
}

module.exports = app;
