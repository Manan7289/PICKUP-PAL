const express = require("express");
const router = express.Router();

const { addFood, getFoodByRestaurant } = require("../controllers/foodController");
const protect = require("../middleware/authMiddleware");

// Add food (protected)
router.post("/add", protect, addFood);

// Get food for a restaurant
router.get("/:id", getFoodByRestaurant);

module.exports = router;