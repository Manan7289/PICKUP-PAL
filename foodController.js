const Food = require("../models/Food");

// Add food
const addFood = async (req, res) => {
  try {
    const { restaurantId, name, price, customization } = req.body;

    const food = await Food.create({
      restaurantId,
      name,
      price,
      customization
    });

    res.status(201).json({
      msg: "Food added",
      food
    });

  } catch (error) {
    res.status(500).json(error);
  }
};

// Get food by restaurant
const getFoodByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id });
    res.json(foods);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addFood, getFoodByRestaurant };