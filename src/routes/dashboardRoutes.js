const express = require("express");
const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    const summary = {};

    // Total Orders
    db.get(
      "SELECT COUNT(*) AS totalOrders FROM food_orders",
      [],
      (err, totalResult) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        summary.totalOrders = totalResult.totalOrders;

        // Delivered Orders
        db.get(
          "SELECT COUNT(*) AS deliveredOrders FROM food_orders WHERE status='Delivered'",
          [],
          (err, deliveredResult) => {

            summary.deliveredOrders =
              deliveredResult.deliveredOrders;

            // Cancelled Orders
            db.get(
              "SELECT COUNT(*) AS cancelledOrders FROM food_orders WHERE status='Cancelled'",
              [],
              (err, cancelledResult) => {

                summary.cancelledOrders =
                  cancelledResult.cancelledOrders;

                // Pending Deliveries
                db.get(
                  `
                  SELECT COUNT(*) AS pendingOrders
                  FROM food_orders
                  WHERE status!='Delivered'
                  AND status!='Cancelled'
                  `,
                  [],
                  (err, pendingResult) => {

                    summary.pendingOrders =
                      pendingResult.pendingOrders;

                    // Total Sales
                    db.get(
                      `
                      SELECT SUM(total_amount) AS totalSales
                      FROM food_orders
                      WHERE status='Delivered'
                      `,
                      [],
                      (err, salesResult) => {

                        summary.totalSales =
                          salesResult.totalSales || 0;

                        // Restaurant-wise Stats
                        db.all(
                          `
                          SELECT
                            restaurants.name,
                            COUNT(food_orders.id) AS totalOrders
                          FROM food_orders
                          JOIN restaurants
                            ON food_orders.restaurant_id = restaurants.id
                          GROUP BY restaurants.id
                          `,
                          [],
                          (err, restaurantStats) => {

                            summary.restaurantStats =
                              restaurantStats;

                            // Daily Sales
                            db.all(
                              `
                              SELECT
                                DATE(created_at) AS date,
                                SUM(total_amount) AS sales
                              FROM food_orders
                              WHERE status='Delivered'
                              GROUP BY DATE(created_at)
                              ORDER BY date DESC
                              `,
                              [],
                              (err, dailySales) => {

                                summary.dailySales =
                                  dailySales;

                                res.json(summary);
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

module.exports = router;