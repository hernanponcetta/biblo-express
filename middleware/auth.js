const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({
      error: {
        status: 401,
        message: "Unauthorized - The request requires user authentication",
      },
    });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - Invalid token",
      },
    });
  }
};
