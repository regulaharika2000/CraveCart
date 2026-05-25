import { useEffect, useState } from "react";

import API from "../api/axios";


function StaffDashboard() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [commentData, setCommentData] =
    useState({});

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const response =
        await API.get("/orders");

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // Update order status
  const updateStatus = async (
    orderId,
    status
  ) => {

    try {

      await API.put(
        `/orders/${orderId}`,
        { status }
      );

      toast.success("Status updated");

      fetchOrders();

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Update failed"
);
    }
  };

  // Add comment
  const addComment = async (orderId) => {

    try {

      await API.post(
        `/orders/${orderId}/comments`,
        {
          comment:
            commentData[orderId] || "",
        }
      );

      toast.success("Comment added");

      setCommentData({
        ...commentData,
        [orderId]: "",
      });

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Comment failed"
);

    }
  };

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Restaurant Staff Dashboard</h1>

      {orders.length === 0 ? (
        <h3>No orders available</h3>
      ) : (

        orders.map((order) => (

          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
            }}
          >

            <h3>
              Order #{order.id}
            </h3>

            <p>
              Food Items:
              {order.food_items}
            </p>

            <p>
              Quantity:
              {order.quantity}
            </p>

            <p>
              Status:
              <strong>
                {order.status}
              </strong>
            </p>

            {/* Status Update */}
            <select
              onChange={(e) =>
                updateStatus(
                  order.id,
                  e.target.value
                )
              }
              value={order.status}
            >

              <option value="Placed">
                Placed
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Out for Delivery">
                Out for Delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

            <br /><br />

            {/* Comment */}
            <textarea
              placeholder="Preparation comment"
              value={
                commentData[order.id] || ""
              }
              onChange={(e) =>
                setCommentData({
                  ...commentData,
                  [order.id]:
                    e.target.value,
                })
              }
            />

            <br /><br />

            <button
              onClick={() =>
                addComment(order.id)
              }
            >
              Add Comment
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default StaffDashboard;