const _ = require("lodash");
const validateId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();

//Multiple genres lookup
router.get("/", async (req, res, next) => {
  const genres = await Genre.find();

  res.send({
    genres: _.map(genres, (genre) => {
      return _.pick(genre, ["_id", "name"]);
    }),
  });
});

//Single genre create
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - " + error.details[0].message,
      },
    });

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send({ genre: _.pick(genre, ["_id", "name"]) });
});

//single genre update
router.put("/:id", [auth, admin, validateId], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - " + error.details[0].message,
      },
    });

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send({
      error: {
        status: 404,
        message: `No genre found with ${req.params.id} Id`,
      },
    });

  res.send({ genre: _.pick(genre, ["_id,", "name"]) });
});

//Single genre delete
router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send({
      error: {
        status: 404,
        message: `Not Found - Not user was found with ${req.params.id} Id`,
      },
    });

  res.send({ genre: _.pick(genre, ["_id", "name"]) });
});

//Single genre lookup
router.get("/:id", validateId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send({
      error: {
        status: 404,
        message: `Not Found - No genre was found with ${req.params.id} Id`,
      },
    });

  res.send({ genre: _.pick(genre, ["_id", "name"]) });
});

module.exports = router;
