import { useEffect, useState } from "react";

import API from "../api/axios";

function AdminDashboard() {

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // Fetch analytics
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const response =
        await API.get(
          "/dashboard/summary"
        );

      setSummary(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Total Orders</h2>
          <h3>
            {summary.totalOrders}
          </h3>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Delivered Orders</h2>
          <h3>
            {summary.deliveredOrders}
          </h3>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Cancelled Orders</h2>
          <h3>
            {summary.cancelledOrders}
          </h3>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Pending Deliveries</h2>
          <h3>
            {summary.pendingOrders}
          </h3>
        </div>

      </div>

      {/* Sales */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >

        <h2>Total Sales</h2>

        <h1>
          ₹{summary.totalSales}
        </h1>

      </div>

      {/* Restaurant Stats */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >

        <h2>
          Restaurant Statistics
        </h2>

        {summary.restaurantStats.map(
          (restaurant, index) => (

            <div key={index}>

              <p>
                {restaurant.name}
                —
                {restaurant.totalOrders}
                orders
              </p>

            </div>
          )
        )}

      </div>

      {/* Daily Sales */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >

        <h2>Daily Sales</h2>

        {summary.dailySales.length === 0 ? (

          <p>No sales available</p>

        ) : (

          summary.dailySales.map(
            (sale, index) => (

              <div key={index}>

                <p>
                  {sale.date}
                  —
                  ₹{sale.sales}
                </p>

              </div>
            )
          )
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;