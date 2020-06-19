const { Ingredrient, validate } = require("../models/ingredrients");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const ingredrient = await Ingredrient.find().sort("name");
  res.send(ingredrient);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ingredrient = new Ingredrient({
    name: req.body.name,
    availableQuantity: req.body.availableQuantity,
    thresholdQuantity: req.body.thresholdQuantity,
    vendor: {
      name: req.body.name,
      email: req.body.email,
      rating: req.body.rating,
    },
  });
  await ingredrient.save();
  res.send(ingredrient);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ingredrient = await Ingredrient.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      availableQuantity: req.body.availableQuantity,
      thresholdQuantity: req.body.thresholdQuantity,
      vendor: {
        name: req.body.name,
        email: req.body.email,
        rating: req.body.rating,
      },
    },
    { new: true }
  );

  if (!ingredrient)
    return res.status(400).send("The ingredient with the given ID is invalid");

  res.send(ingredrient);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const ingredrient = await Ingredrient.findByIdRemove(req.params.id);

  if (!ingredrient)
    return res.status(400).send("The cuisie with the givenID is invalid");

  res.send(ingredrient);
});

router.get("/?aq<tq", [auth, admin], async (req, res) => {
  const ingredrient = await Ingredrient.find({
    availableQuantity: { $lt: thresholdQuantity },
  })
    .limit(10)
    .sort({ name: 1 })
    .select("name availableQuantity thresholdQuantity");
  res.send(ingredrient);
});

router.get("/:vendor?rating= 4 & 5", [auth, admin], async (req, res) => {
  Ingredrient.find({ "vendor.rating": { $in: [4, 5] } })
    .limit(10)
    .sort({ name: 1 })
    .select("name", "vendor.name", "vendor.rating");
});

module.exports = router;
