const validateId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Author, validate } = require("../models/author");
const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

//Multiple authors lookup
router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.send({
    authors: _.map(authors, (author) => {
      return _.pick(author, [
        "_id",
        "name",
        "bio",
        "authorPhoto",
        "born",
        "death",
      ]);
    }),
  });
});

//Single author create
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { estatus: 400, message: error.details[0].message } });

  const author = new Author({
    name: req.body.name,
    bio: req.body.bio,
    authorPhoto: req.body.authorPhoto,
    born: req.body.born,
    death: req.body.death,
  });

  await author.save();

  res.send({ author: author });
});

//Single author update by Id
router.put("/:id", [auth, admin, validateId], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { statud: 400, message: error.details[0].message } });

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      bio: req.body.bio,
      authorPhoto: req.body.authorPhoto,
      born: req.body.born,
      death: req.body.death,
    },
    { new: true }
  );
  if (!author)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Author Id was not found" } });

  res.send({
    author: _.pick(author, [
      "_id",
      "name",
      "bio",
      "authorPhoto",
      "born",
      "death",
    ]),
  });
});

//Single author Delete
router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Author Id was not found" } });

  res.send(
    _.pick(author, ["_id", "name", "bio", "authorPhoto", "born", "death"])
  );
});

//Single author lookup
router.get("/:id", validateId, async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Author Id was not found" } });

  res.send(
    _.pick(author, ["_id", "name", "bio", "authorPhoto", "born", "death"])
  );
});

module.exports = router;
