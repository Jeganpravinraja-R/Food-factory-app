const { User } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAINNAME;
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: DOMAIN,
});
const jwt = require("jsonwebtoken");
const updatePass = require("../middleware/updatepass");
const auth = require("../middleware/auth");

router.put("/", auth, async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User with this email does not exist");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_UPDATEPASS_KEY);

  const data = {
    from: "noreply@gmail.com",
    to: email,
    subject: "Update Password Link",
    html: `
          <h2>Please click on given link to activate your account</h2>
          <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
    
    
    `,
  };

  const updateLink = await User.updateOne({ updateLink: token });

  if (!updateLink) return res.status(400).send(" link invalid");

  mg.messages().send(data, function (error, body) {
    if (error) {
      return res.status(400).send("something failed");
    }
    return res
      .status(200)
      .send("Email has been sent, kindly follow the instructions");
  });
});

router.put("/resetpassword", updatePass, async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updateUser = await User.findOne({ updatelink });

  if (!updateUser)
    return res.status(400).send("Invalid link or it got expired");

  const user = await User.updateOne({
    password: req.body.password,
    updatelink: "",
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  if (user) return res.status(200).send("Your password changed successfully");
  res.send(user);
});

function ValidateUser(user) {
  const schema = {
    email: Joi.string().required().min(6).max(255).trim().email(),
    password: Joi.string().required().min(6).max(255).trim(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
