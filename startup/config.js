const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("Fatal ERROr: jwtPrivateKey is not defined");
  }
};
