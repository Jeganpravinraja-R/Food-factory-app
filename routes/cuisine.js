const { Cuisine, validate } = require("../models/cuisine");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const cuisine = await Cuisine.find().sort("name");
  res.send(cuisine);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cuisine = await new Cuisine({ name: req.body.name });
  await cuisine.save();
  res.send(cuisine);
});
router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cuisine = await Cuisine.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!cuisine)
    return res.status(400).send("The cuisine with the given ID is invalid");

  res.send(cuisine);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const cuisine = await Cuisine.findByIdAndRemove(req.params.id);

  if (!cuisine)
    return res.status(400).send("The cuisie with the givenID is invalid");

  res.send(cuisine);
});

router.get("/:id", auth, async (req, res) => {
  const cuisine = await Cuisine.findById(req.params.id);

  if (!cuisine) return res.status(400).send("invalid request");

  res.send(cuisine);
});

module.exports = router;
