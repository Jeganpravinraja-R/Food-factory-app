const { User } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_ACC_ACTIVATE
  );

  res.send(token);
});

function validateLogin(req) {
  const schema = {
    email: Joi.string().required().min(6).max(255).trim().email(),
    password: Joi.string().required().min(6).max(255).trim(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
