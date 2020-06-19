const { User, validate } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const DOMAIN = "process.env.MAILGUN_DOMAINNAME";
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: DOMAIN,
});
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACC_ACTIVATE
  );

  const data = {
    from: "noreply@gmail.com",
    to: email,
    subject: "Account Activation Link",
    html: `
            <h2>Please click on given link to activate your account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
      
      
      `,
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      return res.status(400).send("something failed");
    }
    return res
      .status(200)
      .send("Email has been sent, kindly activate your account");
  });
});

router.post("/email-activate", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const token = req.header("X-activate-token");
  if (!token) return res.status(400).send("Invalid activation token");

  const decoded = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);
  req.body = user;

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(user);
});

module.exports = router;
