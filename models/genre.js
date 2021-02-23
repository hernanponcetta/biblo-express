const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required().messages({
      "string.base": "name should be a type string",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a max length of {#limit}",
      "string.empty": "name should not be empty",
      "any.required": "name is a required field",
    }),
  });

  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
