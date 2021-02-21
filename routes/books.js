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
  res.send(
    _.map(books, (book) => {
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
    })
  );
});

//Single book create
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No existe un género con ese Id");

  const author = await Author.findById(req.body.authorId);
  if (!author) return res.status(400).send("No existe un autor con ese Id");

  const publisher = await Publisher.findById(req.body.publisherId);
  if (!author) return res.status(400).send("No existe un autor con ese Id");

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
  res.send(book);
});

//Single book update
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No existe un género con ese Id");

  const author = await Author.findById(req.body.authorId);
  if (!author) return res.status(400).send("No existe un autor con ese Id");

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

  if (!book) return res.status(404).send("No se encontro un libro con ese Id.");

  res.send(book);
});

//Single book delete
router.delete("/:id", async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) return res.status(404).send("No se encontro un libro con ese Id.");

  res.send(book);
});

//Single book lookup
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send("No se encontro un libro con ese Id");

  res.send(book);
});

module.exports = router;
