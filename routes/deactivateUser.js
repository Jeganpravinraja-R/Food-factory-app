const { User, validate } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.delete("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(400).send("Invalid user with no identity");

  res.send(user);
});

module.exports = router;
