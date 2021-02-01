const { Publisher, validate } = require("../models/publisher");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Multiple publishers lookup
router.get("/", async (req, res) => {
  res.send(await Publisher.find().sort("name"));
});

//Single publisher create
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const publisher = new Publisher({
    name: req.body.name,
  });
  await publisher.save();
  res.send(publisher);
});

//Single publisher update
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const publisher = await Publisher.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!publisher)
    return res.status(403).send("No se encontro ninguna editorial con es Id");

  res.send(publisher);
});

//Single publisher delete
router.delete("/:id", async (req, res) => {
  const publisher = await Publisher.findByIdAndRemove(req.params.id);
  if (!publisher)
    return res.status(403).send("No se encontro ninguna editorial con es Id");

  res.send(publisher);
});

//Single publisher lookup
router.get("/:id", async (req, res) => {
  const publisher = await Publisher.findById(req.params.id);

  if (!publisher)
    return res.status(404).send("No se encontro ninguna editorial con es Id");

  res.send(publisher);
});

module.exports = router;
