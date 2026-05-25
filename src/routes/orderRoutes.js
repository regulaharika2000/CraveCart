const express = require("express");
const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const {
    restaurant_id,
    food_items,
    quantity,
    delivery_address,
    contact_number,
    payment_method,
    special_instructions,
    total_amount,
  } = req.body;

  // Validation
  if (
    !restaurant_id ||
    !food_items ||
    !quantity ||
    !delivery_address ||
    !contact_number ||
    !payment_method
  ) {
    return res.status(400).json({
      message: "All required fields must be filled",
    });
  }

  // Quantity validation
  if (quantity <= 0) {
    return res.status(400).json({
      message: "Invalid quantity",
    });
  }

  // Contact validation
  if (contact_number.length !== 10) {
    return res.status(400).json({
      message: "Invalid contact number",
    });
  }

  const query = `
    INSERT INTO food_orders
    (
      customer_id,
      restaurant_id,
      food_items,
      quantity,
      delivery_address,
      contact_number,
      payment_method,
      special_instructions,
      total_amount
    )
    VALUES(?,?,?,?,?,?,?,?,?)
  `;

  db.run(
    query,
    [
      req.user.id,
      restaurant_id,
      food_items,
      quantity,
      delivery_address,
      contact_number,
      payment_method,
      special_instructions,
      total_amount,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      const orderId = this.lastID;

      // Add order history
      const historyQuery = `
        INSERT INTO order_history
        (order_id,status,updated_by,notes)
        VALUES(?,?,?,?)
      `;

      db.run(historyQuery, [
        orderId,
        "Placed",
        req.user.id,
        "Order created",
      ]);

      res.status(201).json({
        message: "Order placed successfully",
        orderId,
      });
    }
  );
});



router.get("/", authMiddleware, (req, res) => {
  const {
    status,
    payment_method,
    customer_name,
    restaurant_name,
  } = req.query;

  let query = `
    SELECT
      food_orders.*,
      users.name AS customer_name,
      restaurants.name AS restaurant_name
    FROM food_orders
    JOIN users
      ON food_orders.customer_id = users.id
    JOIN restaurants
      ON food_orders.restaurant_id = restaurants.id
    WHERE 1=1
  `;

  const params = [];

  // Customer should see only own orders
  if (req.user.role === "customer") {
    query += " AND food_orders.customer_id = ?";
    params.push(req.user.id);
  }

  // Filters
  if (status) {
    query += " AND food_orders.status = ?";
    params.push(status);
  }

  if (payment_method) {
    query += " AND food_orders.payment_method = ?";
    params.push(payment_method);
  }

  if (customer_name) {
    query += " AND users.name LIKE ?";
    params.push(`%${customer_name}%`);
  }

  if (restaurant_name) {
    query += " AND restaurants.name LIKE ?";
    params.push(`%${restaurant_name}%`);
  }

  query += " ORDER BY food_orders.created_at DESC";

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(orders);
  });
});




router.put(
  "/:id",
  authMiddleware,
  (req, res) => {
    const orderId = req.params.id;

    const { status } = req.body;

    // Allowed roles
    if (
      req.user.role !== "restaurant_staff" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Valid statuses
    const validStatuses = [
      "Placed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Update order
    const updateQuery =
      "UPDATE food_orders SET status=? WHERE id=?";

    db.run(updateQuery, [status, orderId], function (err) {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      // Add history timeline
      const historyQuery = `
        INSERT INTO order_history
        (order_id,status,updated_by,notes)
        VALUES(?,?,?,?)
      `;

      db.run(historyQuery, [
        orderId,
        status,
        req.user.id,
        `Order status changed to ${status}`,
      ]);

      res.json({
        message: "Order status updated",
      });
    });
  }
);

router.post(
  "/:id/comments",
  authMiddleware,
  (req, res) => {
    const orderId = req.params.id;

    const { comment } = req.body;

    // Only staff/admin allowed
    if (
      req.user.role !== "restaurant_staff" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Validation
    if (!comment) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    // Insert comment
    const query = `
      INSERT INTO order_comments
      (order_id,staff_id,comment)
      VALUES(?,?,?)
    `;

    db.run(
      query,
      [orderId, req.user.id, comment],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        // Add timeline history
        const historyQuery = `
          INSERT INTO order_history
          (order_id,status,updated_by,notes)
          VALUES(?,?,?,?)
        `;

        db.run(historyQuery, [
          orderId,
          "Comment Added",
          req.user.id,
          comment,
        ]);

        res.status(201).json({
          message: "Comment added successfully",
        });
      }
    );
  }
);

router.get(
  "/:id/history",
  authMiddleware,
  (req, res) => {
    const orderId = req.params.id;

    const query = `
      SELECT
        order_history.*,
        users.name AS updated_by_name
      FROM order_history
      LEFT JOIN users
        ON order_history.updated_by = users.id
      WHERE order_history.order_id = ?
      ORDER BY order_history.created_at ASC
    `;

    db.all(query, [orderId], (err, history) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json(history);
    });
  }
);

module.exports = router;