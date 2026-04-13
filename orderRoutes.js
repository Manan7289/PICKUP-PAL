const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  completeOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

// Create order
router.post("/create", protect, createOrder);

// Get user orders
router.get("/my", protect, getUserOrders);

// Complete order (QR simulation)
router.post("/complete", protect, completeOrder);

module.exports = router;