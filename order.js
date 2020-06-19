const { Order, validate } = require("../models/order");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/users");
const { Foods } = require("../models/food");
const { Cuisine } = require("../models/cuisine");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const order = await Order.find().sort("-orderNum");
  res.send(order);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("invalid customer");

  const food = await Foods.findById(req.body.foodId);
  if (!food) return res.status(400).send("invalid request");

  const Cuisine = await Cuisine.findById(req.body.foodId);
  if (!cuisine) return res.status(400).send("invalid request");

  const order = new User({
    user: {
      _id: user._id,
      name: user.name,
      status: user.status,
    },
    food: {
      _id: food._id,
      name: food.name,
    },
    cuisine: {
      _id: cuisine._id,
      name: cuisine.name,
    },
  });

  await order.save();
  res.send(order);
});

router.get("/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params._id);

  if (!order)
    return res.status(400).send("The order with the given ID is invalid");

  res.send(order);
});

module.exports = router;
