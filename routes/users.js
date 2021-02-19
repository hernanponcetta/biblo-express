const validateId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Multiple user lookup
router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find();

  res.send(
    _.map(users, (user) => {
      return _.pick(user, ["_id", "firstName", "lastName", "eMail", "isAdmin"]);
    })
  );
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

//User update
router.put("/me", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  user = _.pick(req.body, ["firstName", "lastName", "eMail", "password"]);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  user = await User.findByIdAndUpdate(req.user._id, user, { new: true });

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//Single user update by Id
router.put("/:id", [auth, admin, validateId], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({
      error: { status: 400, message: `${req.params.id} is not a valid Id` },
    });

  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  user = _.pick(req.body, [
    "firstName",
    "lastName",
    "eMail",
    "password",
    "isAdmin",
  ]);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  user = await User.findByIdAndUpdate(req.params.id, user, { new: true });

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//User delete
router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.user._id);

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//Single user delete by Id
router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//User lookup
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

//User lookup by Id
router.get("/:id", [auth, admin, validateId], async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res
      .status(404)
      .send({ error: { status: 404, message: "Not Found - User not found" } });

  res.send(_.pick(user, ["_id", "firstName", "lastName", "eMail"]));
});

module.exports = router;
