const { number, string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const { publisherSchema } = require("./publisher");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    author: {
      type: new mongoose.Schema({
        name: {
          type: String,
          trim: true,
          required: true,
        },
      }),
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    publisherId: {
      type: publisherSchema,
      required: true,
    },
    itemStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    isbn: {
      type: Number,
      required: true,
      min: 0000000000000,
      max: 9999999999999,
    },
    available: {
      type: Boolean,
      required: true,
    },
    bookCover: {
      type: String,
      trim: true,
    },
  })
);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    authorId: Joi.string().min(5).max(255),
    price: Joi.number().min(0).required(),
    publisherId: Joi.string().required(),
    itemStock: Joi.number().min(0).max(255),
    genreId: Joi.string().required(),
    isbn: Joi.number().min(0000000000000).max(9999999999999).required(),
    available: Joi.boolean().required(),
    bookCover: Joi.string(),
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
