const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express(); // 👈 THIS LINE

// ✅ Fix CORS error
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});