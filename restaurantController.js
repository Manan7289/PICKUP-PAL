const Restaurant = require("../models/Restaurant");

// Add Restaurant
const addRestaurant = async (req, res) => {
  try {
    const { name, location, timing } = req.body;

    const restaurant = await Restaurant.create({
      ownerId: req.user._id,
      name,
      location,
      timing
    });

    res.status(201).json({
      msg: "Restaurant added",
      restaurant
    });

  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addRestaurant, getRestaurants };