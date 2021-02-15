const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({
      error: {
        status: 400,
        message: `Bad Request - ${req.params.id} is not a valid Id`,
      },
    });

  next();
};
