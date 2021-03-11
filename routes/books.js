const validateId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const { Book, validate } = require("../models/book");
const { Genre } = require("../models/genre");
const { Author } = require("../models/author");
const { Publisher } = require("../models/publisher");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Multiple books lookup
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.send({
    books: _.map(books, (book) => {
      return _.pick(book, [
        "_id",
        "title",
        "author",
        "price",
        "publisher",
        "itemStock",
        "genre",
        "isbn",
        "available",
        "bookCover",
      ]);
    }),
  });
});

//Single book create
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - " + error.details[0].message,
      },
    });

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No genre found with ${req.body.genreId}`,
      },
    });

  const author = await Author.findById(req.body.authorId);
  if (!author)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No author was found with ${req.body.authorId}`,
      },
    });

  const publisher = await Publisher.findById(req.body.publisherId);
  if (!publisher)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No publisher was found with ${req.body.publisherId}`,
      },
    });

  const book = new Book({
    title: req.body.title,
    author: {
      _id: author._id,
      name: author.name,
    },
    price: req.body.price,
    publisher: {
      _id: publisher._id,
      name: publisher.name,
    },
    itemStock: req.body.itemStock,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    isbn: req.body.isbn,
    available: req.body.available,
    bookCover: req.body.bookCover,
  });

  await book.save();
  res.send({
    book: _.pick(book, [
      "_id",
      "title",
      "author",
      "price",
      "publisher",
      "itemStock",
      "genre",
      "isbn",
      "available",
      "bookCover",
    ]),
  });
});

//Single book update
router.put("/:id", [auth, admin, validateId], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - " + error.details[0].message,
      },
    });

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No genre found with ${req.body.genreId}`,
      },
    });

  const author = await Author.findById(req.body.authorId);
  if (!author)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No author found with ${req.body.authorId}`,
      },
    });

  const publisher = await Publisher.findById(req.body.publisherId);
  if (!publisher)
    return res.status(400).send({
      error: {
        status: 400,
        message: `No publisher found with ${req.body.publisherId}`,
      },
    });

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      author: {
        _id: author._id,
        name: author.name,
      },
      price: req.body.price,
      publisher: {
        _id: publisher._id,
        name: publisher.name,
      },
      itemStock: req.body.itemStock,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      isbn: req.body.isbn,
      available: req.body.available,
      bookCover: req.body.bookCover,
    },
    { new: true }
  );

  if (!book)
    return res.status(404).send({
      error: {
        status: 404,
        message: `No book found with ${req.params.id}`,
      },
    });

  res.send({
    book: _.pick(book, [
      "_id",
      "title",
      "author",
      "price",
      "publisher",
      "itemStock",
      "genre",
      "isbn",
      "available",
      "bookCover",
    ]),
  });
});

//Single book delete
router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book)
    return res.status(404).send({
      error: {
        status: 404,
        message: `No book found with ${req.params.id}`,
      },
    });

  res.send({
    book: _.pick(book, [
      "_id",
      "title",
      "author",
      "price",
      "publisher",
      "itemStock",
      "genre",
      "isbn",
      "available",
      "bookCover",
    ]),
  });
});

//Single book lookup
router.get("/:id", validateId, async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book)
    return res.status(404).send({
      error: {
        status: 404,
        message: `No book found with ${req.params.id}`,
      },
    });

  res.send({
    book: _.pick(book, [
      "_id",
      "title",
      "author",
      "price",
      "publisher",
      "itemStock",
      "genre",
      "isbn",
      "available",
      "bookCover",
    ]),
  });
});

module.exports = router;
