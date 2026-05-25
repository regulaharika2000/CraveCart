import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

import API from "../api/axios";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful");

      const role = response.data.user.role;

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      }
      else if (role === "restaurant_staff") {
        navigate("/staff");
      }
      else {
        navigate("/");
      }

    } catch (error) {

      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-page">

    <div className="login-card">

      <h1>Welcome Back 👋</h1>
      <p>Login to continue ordering food</p>

      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  </div>
);
}

export default Login;