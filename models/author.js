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
    name: Joi.string().required(),
    bio: Joi.string().required(),
    authorPhoto: Joi.string(),
    born: Joi.date().required(),
    death: Joi.date().required(),
  });

  return schema.validate(author);
}

exports.Author = Author;
exports.validate = validateAuthor;
