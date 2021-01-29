const { Book, validate } = require("../models/book");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await Book.find().sort("title"));
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    available: req.body.available,
  });

  book = await book.save();
  res.send(book);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      available: req.body.available,
    },
    { new: true }
  );

  if (!book) return res.status(404).send("No se encontro un libro con ese Id.");

  res.send(book);
});

router.delete("/:id", async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) return res.status(404).send("No se encontro un libro con ese Id.");

  res.send(book);
});

router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send("No se encontro un libro con ese Id");

  res.send(book);
});

module.exports = router;
