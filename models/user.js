const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
    eMail: {
      type: String,
      required: true,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    secondName: Joi.string().required(),
    eMail: Joi.string().email().required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
