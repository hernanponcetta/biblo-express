const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await User.find());
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User({
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    eMail: req.body.eMail,
  });

  user = await user.save();
  res.send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      eMail: req.body.eMail,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("No se encontro un usuario con ese Id.");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("No se encontro un usuario con ese Id.");

  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("No se encontro un usuario con ese Id");

  res.send(user);
});

module.exports = router;
