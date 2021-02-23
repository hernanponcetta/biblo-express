const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const { request } = require("express");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
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
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(5).max(50).required().messages({
      "string.base": "firstName should be a type string",
      "string.min": "firstName should have a minimum length of {#limit}",
      "string.max": "firstName should have a max length of {#limit}",
      "any.required": "firstName is a required field",
    }),
    lastName: Joi.string().min(5).max(50).required().messages({
      "string.base": "lastName should be a type string",
      "string.min": "lastName should have a minimum length of {#limit}",
      "string.max": "lastName should have a max length of {#limit}",
      "any.required": "lastName is a required field",
    }),
    eMail: Joi.string().min(5).max(255).email().required().messages({
      "string.base": "eMail should be a type string",
      "string.min": "eMail should have a minimum length of {#limit}",
      "string.max": "eMail should have a max length of {#limit}",
      "string.email": "eMail shoul be a valid email",
      "any.required": "eMail is a required field",
    }),
    password: Joi.string().min(5).max(1024).required().messages({
      "string.base": "password should be a type string",
      "string.min": "password should have a minimum length of {#limit}",
      "string.max": "password should have a max length of {#limit}",
      "any.required": "password is a required field",
    }),
    isAdmin: Joi.boolean().messages({
      "boolean.base": "isAdmin should be a type boolean",
    }),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
