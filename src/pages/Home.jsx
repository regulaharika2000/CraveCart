import { useEffect, useState } from "react";
import "./Home.css";

import API from "../api/axios";
import toast from "react-hot-toast";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurant_id: "",
    food_items: "",
    quantity: 1,
    delivery_address: "",
    contact_number: "",
    payment_method: "",
    special_instructions: "",
    total_amount: "",
  });

  // Fetch restaurants
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await API.get("/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/orders", formData);

      toast.success("Order placed successfully");

      // reset form
      setFormData({
        restaurant_id: "",
        food_items: "",
        quantity: 1,
        delivery_address: "",
        contact_number: "",
        payment_method: "",
        special_instructions: "",
        total_amount: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Order failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">

      <div className="hero-section">

        {/* LEFT SIDE */}
        <div className="hero-left">

          <h1>
            Delicious Food Delivered Fast 🍔
          </h1>

          <p>
            Order from your favorite restaurants
            with real-time tracking and fast delivery.
          </p>

          <div className="hero-features">

            <div className="feature-box">🚚 Fast Delivery</div>
            <div className="feature-box">🍕 Top Restaurants</div>
            <div className="feature-box">📍 Live Tracking</div>

          </div>

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="order-form-card">

          <h2>Place Your Order</h2>

          <form onSubmit={handleSubmit}>

            {/* Restaurant */}
            <div className="input-group">
              <select
                name="restaurant_id"
                value={formData.restaurant_id}
                onChange={handleChange}
              >
                <option value="">Select Restaurant</option>

                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Items */}
            <div className="input-group">
              <input
                name="food_items"
                placeholder="Food items"
                value={formData.food_items}
                onChange={handleChange}
              />
            </div>

            {/* Quantity */}
            <div className="input-group">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="input-group">
              <textarea
                name="delivery_address"
                placeholder="Delivery address"
                value={formData.delivery_address}
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div className="input-group">
              <input
                name="contact_number"
                placeholder="Contact number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>

            {/* Payment */}
            <div className="input-group">
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="">Payment Method</option>
                <option value="Cash on Delivery">
                  Cash on Delivery
                </option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {/* Instructions */}
            <div className="input-group">
              <textarea
                name="special_instructions"
                placeholder="Special instructions"
                value={formData.special_instructions}
                onChange={handleChange}
              />
            </div>

            {/* Total */}
            <div className="input-group">
              <input
                type="number"
                name="total_amount"
                placeholder="Total amount"
                value={formData.total_amount}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="order-btn"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Home;