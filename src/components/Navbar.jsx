import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
function Navbar() {

  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      className="navbar"
    >

      <Link
        to="/"
        style={{ color: "white" }}
      >
        Home
      </Link>
      <Link
  to="/notifications"
  style={{ color: "white" }}
>
  Notifications
</Link>

      {/* Customer */}
      {user?.role === "customer" && (
        <Link
          to="/orders"
          style={{ color: "white" }}
        >
          My Orders
        </Link>
      )}

      {/* Staff */}
      {user?.role === "restaurant_staff" && (
        <Link
          to="/staff"
          style={{ color: "white" }}
        >
          Staff Dashboard
        </Link>
      )}

      {/* Admin */}
      {user?.role === "admin" && (
        <Link
          to="/admin"
          style={{ color: "white" }}
        >
          Admin Dashboard
        </Link>
      )}

      {/* Login/Register */}
      {!user && (
        <>
          <Link
            to="/login"
            style={{ color: "white" }}
          >
            Login
          </Link>

          <Link
            to="/register"
            style={{ color: "white" }}
          >
            Register
          </Link>
        </>
      )}

      {/* Logout */}
      {user && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}

    </div>
  );
}

export default Navbar;