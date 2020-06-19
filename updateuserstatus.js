const { User } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validateUserStatus(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userStatus = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },

    { new: true }
  );

  if (!userStatus)
    return res.status(400).send("The User with the givenId is not found");

  res.send(user);
});

function validateUserStatus(userStatus) {
  const schema = {
    status: Joi.string()
      .validate("GOLD", "SILVER", "BRONZE")
      .allow("GOLD", "SILVER", "BRONZE")
      .default("BRONZE"),
  };
  return Joi.validate(userStatus, schema);
}

module.exports = router;
