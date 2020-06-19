const mongoose = require("mongoose");
const Joi = require("joi");

const cuisineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
});

const Cuisine = mongoose.model("cuisine", cuisineSchema);

function validateCuisine(cuisine) {
  const schema = {
    name: Joi.string().required().trim().min(3).max(50),
  };
  return Joi.validate(cuisine, schema);
}

exports.Cuisine = Cuisine;
exports.validate = validateCuisine;
