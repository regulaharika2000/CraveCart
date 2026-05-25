import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import OrderDetails from "./pages/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <>
    <Navbar />
  <Routes>

    {/* Public Routes */}
    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    {/* Customer Routes */}
    <Route
      path="/orders"
      element={
        <ProtectedRoute
          allowedRoles={[
            "customer",
            "admin",
            "restaurant_staff",
          ]}
        >
          <MyOrders />
        </ProtectedRoute>
      }
    />

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute
          allowedRoles={["admin"]}
        >
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    {/* Staff Routes */}
    <Route
      path="/staff"
      element={
        <ProtectedRoute
          allowedRoles={[
            "restaurant_staff",
            "admin",
          ]}
        >
          <StaffDashboard />
        </ProtectedRoute>
      }
    />

    {/* Order Details */}
    <Route
      path="/orders/:id"
      element={
        <ProtectedRoute
          allowedRoles={[
            "customer",
            "admin",
            "restaurant_staff",
          ]}
        >
          <OrderDetails />
        </ProtectedRoute>
      }
    />

    <Route
  path="/notifications"
  element={
    <ProtectedRoute
      allowedRoles={[
        "customer",
        "admin",
        "restaurant_staff",
      ]}
    >
      <Notifications />
    </ProtectedRoute>
  }
/>

  </Routes>
</>
  );
}

export default App;