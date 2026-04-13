const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
      },
      quantity: Number,
      customization: Array
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    default: "pending" // pending → preparing → ready → completed
  },

  paymentStatus: {
    type: String,
    default: "pending"
  },

  qrCode: String

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);