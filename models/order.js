const mongoose = require("mongoose");
const Joi = require("joi");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    user: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 50,
        },
        status: {
          type: String,
          enum: ["GOLD", "SILVER", "BRONZE"],
          default: "BRONZE",
        },
      }),
      required: true,
    },
    food: {
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
    ingredrients: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        availableQuantity: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    orderNum: {
      type: Number,
      required: true,
      unique: true,
      default: 0,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: ["DELIVERED", "PENDING", "NOTORDERED"],
      default: "NOTORDERED",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },

    dateOfDelivery: {
      type: Date,
      default: Date.now,
    },
    modeOfTransport: {
      type: String,
      enum: ["CAR", "BICYCLE", "TWO-WHEELERS"],
      default: "TWO-WHEELERS",
    },
  })
);

function validateOrders(order) {
  const schema = {
    userId: Joi.objectId().required(),
    foodId: Joi.objectId().required(),
    cuisineId: Joi.objectId().required(),
  };
  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrders;
