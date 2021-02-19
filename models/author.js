const Joi = require("joi");
const mongoose = require("mongoose");

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    authorPhoto: {
      type: String,
    },
    born: {
      type: Date,
      required: true,
    },
    death: {
      type: Date,
    },
  })
);

function validateAuthor(author) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(55).required(),
    bio: Joi.string().min(5).max(255).required(),
    authorPhoto: Joi.string().min(5).max(255),
    born: Joi.date().required(),
    death: Joi.date().required(),
  });

  return schema.validate(author);
}

exports.Author = Author;
exports.validate = validateAuthor;
