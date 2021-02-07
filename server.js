const winston = require("winston");
const app = require("./app");
require("./startup/db")();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});
