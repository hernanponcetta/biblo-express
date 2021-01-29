const { Author, validate } = require("../models/author");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Multiple authors lookup
router.get("/", async (req, res) => {
  res.send(await Author.find());
});

//Single author create
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const author = new Author({
    name: req.body.name,
    bio: req.body.bio,
    authorPhoto: req.body.authorPhoto,
    born: req.body.born,
    death: req.body.death,
  });

  await author.save();

  res.send(author);
});

//Single author update
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
    return res.status(404).res.send("No se encontro un Autor con ese Id");

  res.send(author);
});

//Single author Delete
router.delete("/:id", async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author)
    return res.status(404).send("No se encontro un Autor con ese Id");

  res.send(author);
});

//Single author lookup
router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author)
    return res.status(404).send("No se encontro un Autor con ese Id");

  res.send(author);
});

module.exports = router;
