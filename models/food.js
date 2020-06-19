const mongoose = require("mongoose");
const Joi = require("joi");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  createdAt: {
    type: { Date, default: Date.now },
  },
  cuisine: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true,
      },
    }),
    required: true,
  },
  ingredients: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
      },
    }),
    required: true,
  },
  lotNumber: {
    type: Number,
    unique: true,
    min: 0,
  },
  costOfProduction: {
    type: Number,
    min: 0,
    max: 5000,
    required: true,
  },
  sellingCost: {
    type: Number,
    min: 0,
    max: 10000,
    required: true,
  },
});

const Foods = mongoose.model("food", foodSchema);

function validateFood(food) {
  const schema = {
    name: Joi.string().required().min(5).max(255).trim(),
    cuisineId: Joi.objectId().required(),
  };
  return Joi.validate(food, schema);
}

exports.Foods = Foods;
exports.validate = validateFood;
