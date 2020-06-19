const { User } = require("../models/users");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.put("/:id", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
    },

    { new: true }
  );

  if (!user)
    return res.status(400).send("The User with the givenId is not found");

  res.send(user);
});

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(6).max(255).trim().email(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
