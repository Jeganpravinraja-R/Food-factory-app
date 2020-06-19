const express = require("express");
const signup = require("../routes/signup");
const login = require("../routes/login");
const food = require("../routes/food");
const cuisine = require("../routes/cuisine");
const ingredient = require("../routes/ingredrients");
const order = require("../routes/order");
const update = require("../routes/updateuser");
const updateuserstatus = require("../routes/updateuserstatus");
const updatepassword = require("../routes/updatepassword");
const forgotpassword = require("../routes/forgotpassword");
const deactivateuser = require("../routes/deactivateUser");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", signup);
  app.use("/api/login", login);
  app.use("/api/food", food);
  app.use("/api/cuisine", cuisine);
  app.use("/api/ingredients", ingredient);
  app.use("/api/order", order);
  app.use("/api/updateuser", update);
  app.use("/api/updateuserstatus", updateuserstatus);
  app.use("/api/updatepassword", updatepassword);
  app.use("/api/forgotpassword", forgotpassword);
  app.use("/api/deleteuser", deactivateuser);
  app.use(error);
};
