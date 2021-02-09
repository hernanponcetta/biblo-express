const auth = require("../middleware/auth");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { token } = require("morgan");
const router = express.Router();

//Multiple user lookup
router.get("/", async (req, res) => {
  res.send(await User.find());
});

//Single user create
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  let user = await User.findOne({ eMail: req.body.eMail });
  if (user)
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - User already exist",
      },
    });

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "eMail", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//Single user update
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

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res.send(user);
});

//Single user delete
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("No se encontro un usuario con ese Id.");

  res.send(user);
});

//Single user lookup
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.send(user);
});

module.exports = router;
