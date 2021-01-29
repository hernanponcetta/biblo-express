const Joi = require("joi");
const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
  })
);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    price: Joi.number().required(),
    available: Joi.boolean().required(),
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
