const express = require("express");
const helmet = require("helmet");
const books = require("../routes/books");
const users = require("../routes/users");
const genres = require("../routes/genres");
const authors = require("../routes/authors");
const publishers = require("../routes/publishers");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(helmet());
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/genres", genres);
  app.use("/api/authors", authors);
  app.use("/api/publishers", publishers);
  app.use("/api/auth", auth);

  app.use(error);
};
