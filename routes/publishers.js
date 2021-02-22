const _ = require("lodash");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Publisher, validate } = require("../models/publisher");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Multiple publishers lookup
router.get("/", async (req, res) => {
  const publishers = await Publisher.find();

  res.send(
    _.map(publishers, (publisher) => {
      return _.pick(publisher, ["_id", "name"]);
    })
  );
});

//Single publisher create
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  const publisher = new Publisher({
    name: req.body.name,
  });
  await publisher.save();
  res.send(publisher);
});

//Single publisher update
router.put("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({
      error: {
        status: 400,
        message: `Bad Request - ${req.params.id} is not a valid Id`,
      },
    });

  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { status: 400, message: error.details[0].message } });

  const publisher = await Publisher.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!publisher)
    return res.status(404).send({
      error: {
        status: 403,
        message: `Not Found - No publisher was found with ${req.params.id} Id`,
      },
    });
  res.send(publisher);
});

//Single publisher delete
router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({
      error: {
        status: 400,
        message: `Bad Request - ${req.params.id} is not a valid Id`,
      },
    });

  const publisher = await Publisher.findByIdAndRemove(req.params.id);
  if (!publisher)
    return res.status(404).send({
      error: {
        status: 404,
        message: `Not Found - No publisher was found with ${req.params.id} Id`,
      },
    });

  res.send(_.pick(publisher, ["_id", "name"]));
});

//Single publisher lookup
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({
      error: {
        status: 400,
        message: "Bad Request - Not a valid Id",
      },
    });

  const publisher = await Publisher.findById(req.params.id);

  if (!publisher)
    return res.status(404).send({
      error: {
        status: 404,
        message: "Not Found - No publisher found",
      },
    });

  res.send(publisher);
});

module.exports = router;
