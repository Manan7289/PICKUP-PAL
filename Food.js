const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  name: String,
  price: Number,

  isAvailable: {
    type: Boolean,
    default: true
  },

  customization: [
    {
      name: String,
      price: Number
    }
  ],

  isSpecial: {
    type: Boolean,
    default: false
  },

  offer: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);