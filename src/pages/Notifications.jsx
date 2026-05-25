import { useEffect, useState } from "react";

import API from "../api/axios";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {

    try {

      const response =
        await API.get("/notifications");

      setNotifications(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <h2>Loading notifications...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Notifications</h1>

      {notifications.length === 0 ? (

        <h3>No notifications available</h3>

      ) : (

        notifications.map((item) => (

          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >

            <h3>
              {item.status}
            </h3>

            <p>
              {item.notes}
            </p>

            <small>
              Order ID:
              {item.order_id}
            </small>

            <br />

            <small>
              {item.created_at}
            </small>

          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;