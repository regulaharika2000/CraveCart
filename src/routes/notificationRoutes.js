const express = require("express");
const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const query = `
    SELECT
      order_history.id,
      order_history.order_id,
      order_history.status,
      order_history.notes,
      order_history.created_at
    FROM order_history
    JOIN food_orders
      ON order_history.order_id = food_orders.id
    WHERE food_orders.customer_id = ?
    ORDER BY order_history.created_at DESC
  `;

  db.all(query, [req.user.id], (err, notifications) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(notifications);
  });
});

module.exports = router;