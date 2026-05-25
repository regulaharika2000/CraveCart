const express = require("express");
const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM restaurants";

  db.all(query, [], (err, restaurants) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(restaurants);
  });
});

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const { name, category, address, phone } = req.body;

    // Validation
    if (!name || !category) {
      return res.status(400).json({
        message: "Name and category required",
      });
    }

    const query =
      "INSERT INTO restaurants(name,category,address,phone) VALUES(?,?,?,?)";

    db.run(query, [name, category, address, phone], function (err) {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.status(201).json({
        message: "Restaurant added successfully",
        restaurantId: this.lastID,
      });
    });
  }
);

module.exports = router;