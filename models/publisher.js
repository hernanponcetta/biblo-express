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
    name: Joi.string().required(),
  });

  return schema.validate(publisher);
}

exports.Publisher = Publisher;
exports.publisherSchema = publisherSchema;
exports.validate = validatePublisher;
