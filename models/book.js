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
    publisher: {
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
      min: 0,
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
    title: Joi.string().min(5).max(255).required().messages({
      "string.base": "title should be a type string",
      "string.min": "title should have a minimum length of {#limit}",
      "string.max": "title should have a max length of {#limit}",
      "string.empty": "title should not be empty",
      "any.required": "title is a required field",
    }),
    authorId: Joi.objectId().required().messages({
      objectId: "authorId should be a type string",
      "any.required": "authorId is a required field",
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "price should be a type number",
      "number.min": "price should be greater than 0",
      "any.required": "price is a required field",
    }),
    publisherId: Joi.objectId().required().messages({
      "any.required": "publisherId is a required field",
    }),
    itemStock: Joi.number().min(0).max(255).messages({
      "number.base": "itemStock should be a type number",
      "number.min": "itemStock should be greater than 0",
      "number.max": "itemStock should be less than 255",
      "any.required": "itemStock is a required field",
    }),
    genreId: Joi.objectId().required().messages({
      "any.required": "genreId is a required field",
    }),
    isbn: Joi.number().min(0).max(9999999999999).required().messages({
      "number.base": "isbn should be a type number",
      "number.min": "isbn should be greater than 0",
      "number.max": "isbn should be less than 9999999999999",
      "any.required": "isbn is a required field",
    }),
    available: Joi.boolean().required().messages({
      "boolean.base": "available should be a type boolean",
      "any.base": "available is a required field",
    }),
    bookCover: Joi.string().messages({
      "string.base": "title should be a type string",
      "any.required": "title is a required field",
    }),
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
