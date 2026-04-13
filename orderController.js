const Order = require("../models/Order");
const Food = require("../models/Food");
const QRCode = require("qrcode");

// ================= CREATE ORDER =================
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    // Basic validation
    if (!restaurantId || !items || items.length === 0) {
      return res.status(400).json({ msg: "Invalid order data" });
    }

    let totalAmount = 0;

    for (let item of items) {
      const food = await Food.findById(item.foodId);

      // Check food exists
      if (!food) {
        return res.status(404).json({ msg: "Food not found" });
      }

      totalAmount += food.price * item.quantity;

      // Add customization price safely
      if (item.customization && Array.isArray(item.customization)) {
        item.customization.forEach(c => {
          totalAmount += c.price || 0;
        });
      }
    }

    // Generate QR code
    const qrData = `ORDER_${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      items,
      totalAmount,
      paymentStatus: "success",
      status: "pending",
      qrCode
    });

    res.status(201).json({
      msg: "Order created",
      order
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET USER ORDERS =================
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("restaurantId", "name")
      .populate("items.foodId", "name price");

    res.json(orders);

  } catch (error) {
    console.log("GET ORDERS ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= COMPLETE ORDER =================
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.status === "completed") {
      return res.json({ msg: "Order already completed" });
    }

    // Penalty logic (optional)
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const diffMinutes = (now - orderTime) / (1000 * 60);

    if (diffMinutes > 30) {
      order.penalty = 50;
    }

    order.status = "completed";
    await order.save();

    res.json({
      msg: "Order completed",
      order
    });

  } catch (error) {
    console.log("COMPLETE ORDER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= EXPORT =================
module.exports = {
  createOrder,
  getUserOrders,
  completeOrder
};