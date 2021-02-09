const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  eMail: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Admin = mongoose.model("Admin", userSchema);

function validateAdmin(admin) {
  const schema = Joi.object({
    eMail: Joi.string().min(5).max(255).email().required().messages({
      "string.min": "email should be at least 5 characters",
      "string.max": "email should be less than 255 characters",
      "string.email": "email is not valid",
      "string.required": "email is a required field",
    }),
    password: Joi.string().min(5).max(1024).required().messages({
      "string.min": "password should be at least 5 characters",
      "string.max": "password should be less than 1024 characters",
      "string.required": "password is a required field",
    }),
  });

  return schema.validate(admin);
}

exports.Admin = Admin;
exports.validate = validateAdmin;
