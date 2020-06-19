const mongoose = require("mongoose");
const Joi = require("joi");

const ingredrientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  lotNumber: {
    type: Number,
    unique: true,
    required: true,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  thresholdQuantity: {
    type: Number,
    required: true,
    min: 3,
    max: 255,
    default: 0,
  },
  items: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 0,
        maxlength: 5,
      },
      price: {
        type: Number,
        min: 0,
        max: 50,
      },
    }),
  },
  vendor: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 0,
        maxlenght: 50,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        minlength: 0,
        maxlenght: 50,
        trim: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    }),
  },
});

const Ingredrient = mongoose.model("ingedrient", ingredrientsSchema);

function validateIngredrients(ingedrient) {
  const schema = {
    name: Joi.string().required().min(5).max(255).trim(),
    availableQuantity: Joi.number().required().min(0).max(50),
    thresholdQuantity: Joi.number().required().min(0).max(50),
    vendorName: Joi.string().required().min(5).max(255).trim(),
    vendorEmail: Joi.string().required().min(5).max(255).trim().email(),
  };
  return Joi.validate(ingedrient, schema);
}

exports.Ingredrient = Ingredrient;
exports.validate = validateIngredrients;
