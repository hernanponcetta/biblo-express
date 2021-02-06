const winston = require("winston");
const morgan = require("morgan");
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  winston.info("Morgan enabled...");
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
