const { Foods, validate } = require("../models/food");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Cuisine } = require("../models/cuisine");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const food = await Foods.find().sort("name");
  res.send(food);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cuisine = await Cuisine.findById(req.body.cuisineId);
  if (!cuisine) res.status(400).send("invalid cuisine");

  const food = new Foods({
    name: req.body.name,
    cuisine: {
      _id: cuisine._id,
      name: cuisine.name,
    },
  });
  await food.save();
  res.send(food);
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cuisine = await Cuisine.findById(req.body.cuisineId);
  if (!cuisine) res.status(400).send("invalid cuisine");

  const food = await Foods.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      cuisine: {
        _id: cuisine._id,
        name: cuisine.name,
      },
    },
    { new: true }
  );

  if (!food)
    return res.status(400).send("The food with the given ID is invalid");

  res.send(food);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const food = await Foods.findByIdRemove(req.params.id);

  if (!food)
    return res.status(400).send("The cuisie with the givenID is invalid");

  res.send(food);
});

router.get("/:id", auth, async (req, res) => {
  const food = await Foods.findById(req.params.id);

  if (!food)
    return res.status(400).send("The cuisie with the givenID is invalid");

  res.send(food);
});

router.get("/?cp>sp", [auth, admin], async (req, res) => {
  const food = await Foods.find({ costOfProduction: { $gt: sellingCost } })
    .limit(10)
    .sort("-costOfProduction")
    .select(" name costOfProduction sellingCost ");
  res.send(food);
});

module.exports = router;
