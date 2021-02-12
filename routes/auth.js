const config = require("config");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//User authentication
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  let user = await User.findOne({ eMail: req.body.eMail });
  if (!user)
    return res
      .status(400)
      .send({
        error: {
          status: 400,
          message: "Bad Request - Email or password not valid",
        },
      });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send({
        error: {
          status: 400,
          message: "Bad Request - Email or password not valid",
        },
      });

  const token = user.generateAuthToken();
  res.send({ eMail: user.eMail, token: token });
});

function validate(req) {
  const schema = Joi.object({
    eMail: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
