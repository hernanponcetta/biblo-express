const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
});

const Publisher = mongoose.model("Publisher", publisherSchema);

function validatePublisher(publisher) {
  const schema = new Joi.object({
    name: Joi.string().min(5).max(55).required().messages({
      "string.base": "name should be a type string",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a max length of {#limit}",
      "string.empty": "name should not be empty",
      "any.required": "name is a required field",
    }),
  });

  return schema.validate(publisher);
}

exports.Publisher = Publisher;
exports.publisherSchema = publisherSchema;
exports.validate = validatePublisher;
