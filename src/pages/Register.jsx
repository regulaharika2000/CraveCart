import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import toast from "react-hot-toast";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  // Handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      await API.post(
        "/auth/register",
        formData
      );

      toast.success("Registration successful");

      navigate("/login");

    } catch (error) {

      toast.error("Registration failed");

    } finally {

      setLoading(false);

    }
  };

  return (
  <div className="register-page">

    <div className="register-card">

      <h1>Create Account 🚀</h1>
      <p>Join to start ordering delicious food</p>

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <div className="input-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="restaurant_staff">Restaurant Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

    </div>

  </div>
);
}

export default Register;