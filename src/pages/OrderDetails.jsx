import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch details
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {

    try {

      // Get all orders
      const orderResponse =
        await API.get("/orders");

      // Find single order
      const selectedOrder =
        orderResponse.data.find(
          (item) =>
            item.id === Number(id)
        );

      setOrder(selectedOrder);

      // Get timeline/history
      const historyResponse =
        await API.get(
          `/orders/${id}/history`
        );

      setHistory(historyResponse.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!order) {
    return <h2>Order not found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Order Details</h1>

      {/* Order Info */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >

        <h3>
          Food Items:
          {order.food_items}
        </h3>

        <p>
          Quantity:
          {order.quantity}
        </p>

        <p>
          Address:
          {order.delivery_address}
        </p>

        <p>
          Contact:
          {order.contact_number}
        </p>

        <p>
          Payment:
          {order.payment_method}
        </p>

        <p>
          Total:
          ₹{order.total_amount}
        </p>

        <p>
          Current Status:
          <strong>
            {order.status}
          </strong>
        </p>

      </div>

      {/* Timeline */}
      <h2>Order Timeline</h2>

      {history.length === 0 ? (
        <p>No timeline available</p>
      ) : (

        history.map((item) => (

          <div
            key={item.id}
            style={{
              borderLeft:
                "4px solid blue",

              paddingLeft: "15px",

              marginBottom: "20px",
            }}
          >

            <h4>
              {item.status}
            </h4>

            <p>
              {item.notes}
            </p>

            <small>
              {item.created_at}
            </small>

          </div>
        ))
      )}

    </div>
  );
}

export default OrderDetails;