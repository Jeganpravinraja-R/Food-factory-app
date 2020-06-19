const mongoose = require("mongoose");
const Joi = require("joi");
const router = require("../routes/signup");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 255,
  },
  status: {
    type: String,
    enum: ["GOLD", "SILVER", "BRONZE"],
    default: "BRONZE",
  },

  lastLoginAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
  },
  resetLink: {
    data: String,
    default: "",
  },
  updateLink: {
    data: String,
    default: "",
  },
});

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(6).max(255).trim().email(),
    password: Joi.string().required().min(6).max(255).trim(),
  };
  return Joi.validate(user, schema);
}

exports.User = User;

exports.validate = validateUser;
