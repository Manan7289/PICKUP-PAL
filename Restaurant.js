const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: String,
  location: String,

  isOpen: {
    type: Boolean,
    default: true
  },

  timing: String,

  penalty: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);