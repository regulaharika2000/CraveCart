import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // Filters
  const [filters, setFilters] =
    useState({
      status: "",
      payment_method: "",
      search: "",
    });

  // Fetch orders whenever filters change
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Fetch orders
  const fetchOrders = async () => {

    try {

      setLoading(true);

      let query = "/orders?";

      // Status filter
      if (filters.status) {
        query += `status=${filters.status}&`;
      }

      // Payment filter
      if (filters.payment_method) {
        query += `payment_method=${filters.payment_method}&`;
      }

      // Search filter
      if (filters.search) {
        query += `search=${filters.search}&`;
      }

      const response =
        await API.get(query);

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // Status colors
  const getStatusClass = (status) => {

    switch (status) {

      case "Placed":
        return "status placed";

      case "Preparing":
        return "status preparing";

      case "Out for Delivery":
        return "status delivery";

      case "Delivered":
        return "status delivered";

      case "Cancelled":
        return "status cancelled";

      default:
        return "status";
    }
  };

  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  return (
    <div className="container">

      <h1>My Orders</h1>

      {/* Filters */}
      <div className="filters">

        {/* Search */}
        <input
          type="text"
          placeholder="Search food item"
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >

          <option value="">
            All Status
          </option>

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

        {/* Payment Filter */}
        <select
          value={filters.payment_method}
          onChange={(e) =>
            setFilters({
              ...filters,
              payment_method:
                e.target.value,
            })
          }
        >

          <option value="">
            All Payments
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Card">
            Card
          </option>

          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

        </select>

      </div>

      {/* Orders */}
      {orders.length === 0 ? (

        <h3>No orders found</h3>

      ) : (

        orders.map((order) => (

          <div
            key={order.id}
            className="card"
          >

            <h3>
              Order #{order.id}
            </h3>

            <p>
              Restaurant ID:
              {order.restaurant_id}
            </p>

            <p>
              Food Items:
              {order.food_items}
            </p>

            <p>
              Quantity:
              {order.quantity}
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
              Status:

              <span
                className={
                  getStatusClass(
                    order.status
                  )
                }
                style={{
                  marginLeft: "10px",
                }}
              >
                {order.status}
              </span>

            </p>

            <Link
              to={`/orders/${order.id}`}
            >
              View Details
            </Link>

          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;