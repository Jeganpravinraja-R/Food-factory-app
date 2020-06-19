const { User } = require("../models/users");
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
const reset = require("../middleware/reset");

router.put("/", async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User with this email does not exist");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_PASSWORD_KEY);

  const data = {
    from: "noreply@gmail.com",
    to: email,
    subject: "Forgot password Link",
    html: `
          <h2>Please click on given link to activate your account</h2>
          <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
    
    
    `,
  };

  const resetLink = await User.updateOne({ resetLink: token });

  if (!resetLink) return res.status(400).send("reset link invalid");

  mg.messages().send(data, function (error, body) {
    if (error) {
      return res.status(400).send("something failed");
    }
    return res
      .status(200)
      .send("Email has been sent, kindly follow the instructions");
  });
});

router.put("/resetpassword", reset, async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const resetUser = await User.findOne({ resetLink });

  if (!resetUser)
    return res.status(400).send("User with this email does not exist");

  const user = await User.updateOne({
    password: req.body.password,
    resetlink: "",
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
