const express = require("express");
const router = express.Router();

const { addRestaurant, getRestaurants } = require("../controllers/restaurantController");
const protect = require("../middleware/authMiddleware");

// Add restaurant (protected)
router.post("/add", protect, addRestaurant);

// Get all restaurants
router.get("/", getRestaurants);

module.exports = router;