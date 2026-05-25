const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/initDB");
const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors({
  origin: "https://crave-cart-enjoy.vercel.app/",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
//const orderRoutes = require("./routes/orderRoutes");

app.get("/", (req, res) => {
  res.send("Food Delivery Backend Running");
});


app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

app.get(
  "/api/staff",
  authMiddleware,
  roleMiddleware("restaurant_staff", "admin"),
  (req, res) => {
    res.json({
      message: "Welcome Staff",
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
